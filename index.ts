import { isString, isUndefined, isFunction, isValidString, isPlainObject } from "@kubric/litedash";
import { ops } from "./constants";
import handlers from './handlers';
import MacroExpander from './handlers/macros';
import { composeReducers } from "@kubric/reduxutils";
import Resolver from "@kubric/resolver";
import {
  ReducerOpDef,
  OpHandlers,
  ParsedReducers,
  ReducerDef,
  FullConfig,
  ReducersConfig, ActionsConfig, ActionReducerDef, ParsedReducerOpDef, ParsedTypeOperation, ParsedTypeOperations
} from "./interfaces";

const resolver = new Resolver();

export { ops, macros } from './constants';

export default class ReducerFactory {
  macroExpander: MacroExpander;
  opHandlers: OpHandlers;
  payloadPath?: string;

  constructor({ macros: macroHandlers = {}, ops: opHandlers = {}, payloadPath = "" } = {}) {
    this.macroExpander = new MacroExpander({
      expanders: macroHandlers
    });
    this.opHandlers = {
      ...handlers,
      ...opHandlers
    };
    this.payloadPath = payloadPath;
  }

  _processOp(op: ParsedReducerOpDef): Array<ParsedReducerOpDef> {
    const { type, from, to, ...restOp } = op;
    if(isUndefined(this.opHandlers[type])) {
      throw new Error(`Unrecognized action "${type}" found in the config`);
    } else if(Array.isArray(from)) {
      if(!Array.isArray(to) || to.length !== from.length) {
        throw new Error(`Mismatch in the number of "from" and "to" mappings. If "from" is an array, \
      "to" also should be an array of equal length. The combination of from: ${JSON.stringify(from)} and to: ${JSON.stringify(to)} violates this`);
      }
      return from.reduce((acc, fromStr, index) => {
        acc.push({
          type,
          from: fromStr,
          to: to[index],
          ...restOp
        });
        return acc;
      }, []);
    } else if(Array.isArray(to)) {
      return to.reduce((acc, toStr) => {
        acc.push({
          type,
          from,
          to: toStr,
          ...restOp
        });
        return acc;
      }, []);
    } else {
      return [op];
    }
  };

  _parseOps(opsArray: Array<ReducerOpDef> = [], { globalTransformer, globalDefault }: { [index: string]: Function | undefined }) {
    return opsArray.reduce((acc, opConfig) => {
      let { types = [], transform: localTransformer, defaultValue: localDefault, ...opObject } = opConfig;
      if(isUndefined(opObject)) {
        throw new Error(`No valid "op" declaration found in: ${JSON.stringify(opConfig)}`);
      }
      if(isString(types)) {
        types = [types] as Array<string>;
      }
      const { op: type, ...restOp } = opObject;
      let parsedOp: ParsedReducerOpDef = {
        type: isValidString(type) ? type as string : ops.ASSIGN,
        ...restOp
      };
      const parsedOps = this._processOp(parsedOp);
      const transform = localTransformer || globalTransformer;
      const defaultValue = !isUndefined(localDefault) ? localDefault : globalDefault;
      return (types as Array<string>).reduce((acc: ParsedTypeOperations, type) => {
        acc[type] = parsedOps.reduce((acc: Array<ParsedTypeOperation>, op) => {
          acc.push({
            op,
            transform,
            defaultValue
          });
          return acc;
        }, (acc[type] || []) as Array<ParsedTypeOperation>);
        return acc;
      }, acc);
    }, {});
  }

  _generateReducer(types: ParsedTypeOperations, { defaultState, reducer }: { defaultState?: any, reducer?: Function } = {}) {
    return (state = defaultState, action = { type: "__UNDEFINED_TYPE__" }) => {
      const { type } = action;
      const currentOps = types[type];
      if(!isUndefined(currentOps)) {
        return currentOps.reduce((state, currentOp) => {
          let { op: configOp } = currentOp;
          let { type, payload: payloadOverride } = configOp;
          const handler = this.opHandlers[type];
          let newAction = JSON.parse(JSON.stringify(action));
          newAction.payload = !isUndefined(payloadOverride) ? payloadOverride : newAction.payload;
          return handler(state, {
            ...currentOp,
            op: resolver.resolve(configOp, newAction.payload),
            basePath: this.payloadPath
          }, newAction);
        }, state);
      } else {
        return isFunction(reducer) ? (reducer as Function)(state, action) : state;
      }
    };
  }

  static _getExtraReducer(reducer: Function | undefined, defaultState: any) {
    if(Array.isArray(reducer)) {
      return composeReducers(reducer, defaultState);
    }
    return reducer;
  };

  _actionsToReducerConfig(actionsConfig: ActionsConfig): ReducersConfig {
    return Object.keys(actionsConfig)
      .reduce((acc, actionType) =>
        actionsConfig[actionType].reduce((acc: ReducersConfig, actionConfig) => {
          const { op: opType, reducers: reducerMap = {} } = actionConfig;
          return Object.keys(reducerMap)
            .reduce((acc, reducerName) => {
              let op = reducerMap[reducerName];
              if(isString(op)) {
                op = {
                  from: op
                } as ReducerOpDef;
              }
              const currentReducerConfig = acc[reducerName] || {};
              const { ops: reducerOps = [] } = currentReducerConfig;
              reducerOps.push({
                types: [actionType],
                op: opType,
                ...(op as object)
              });
              currentReducerConfig.ops = reducerOps;
              acc[reducerName] = currentReducerConfig;
              return acc;
            }, acc);
        }, acc), {});
  }

  _mergeConfigs(src: ReducersConfig = {}, dest: ReducersConfig = {}) {
    return Object.keys(src).reduce((acc, srcKey) => {
      let srcReducer = this.macroExpander.expand(src[srcKey]);
      if(!acc[srcKey]) {
        acc[srcKey] = srcReducer;
      } else {
        const { ops: destOps = [] } = acc[srcKey];
        if(!isPlainObject(srcReducer)) {
          srcReducer = {
            defaultState: srcReducer
          };
        }
        let { ops: srcOps = [], ...rest } = srcReducer;
        const { defaultState, transform, reducer, defaultValue, ...opConfig } = (rest || {}) as ReducerDef;
        if(srcOps.length === 0 && Object.keys(opConfig).length > 0) {
          srcOps = [opConfig];
        }
        acc[srcKey] = {
          ...rest,
          ops: [
            ...destOps,
            ...srcOps
          ]
        };
      }
      return acc;
    }, dest);
  }

  getReducers({ reducers: reducerConfig, actions: actionsConfig, ...restConfig }: FullConfig | ReducersConfig = {}): ParsedReducers {
    if(isUndefined(reducerConfig) && isUndefined(actionsConfig)) {
      reducerConfig = (restConfig || {}) as ReducersConfig;
    }
    let finalConfig: ReducersConfig = this._actionsToReducerConfig((actionsConfig || {}) as ActionsConfig);
    finalConfig = this._mergeConfigs(reducerConfig as ReducersConfig, finalConfig);
    return Object.keys(finalConfig)
      .reduce((reducers: ParsedReducers, reducerName) => {
        let reducerConfig = finalConfig[reducerName];
        let { defaultState, transform: globalTransformer, reducer, ops: opsConfig = [], defaultValue: globalDefault, ...op } = reducerConfig;
        defaultState = JSON.parse(JSON.stringify(defaultState));
        const extraReducer = ReducerFactory._getExtraReducer(reducer, defaultState);
        if(opsConfig.length === 0 && Object.keys(op).length > 0) {
          // @ts-ignore
          opsConfig = [op];
        }
        if(opsConfig.length === 0 && isFunction(extraReducer)) {
          reducers[reducerName] = (state: any = defaultState, action: object) => (extraReducer as Function)(state, action);
        } else if(opsConfig.length > 0) {
          const types = this._parseOps(opsConfig, {
            globalTransformer,
            globalDefault
          });
          reducers[reducerName] = this._generateReducer(types, {
            defaultState,
            reducer: extraReducer
          });
        } else if(!isUndefined(defaultState)) {
          reducers[reducerName] = (state: any = defaultState) => state;
        }
        return reducers;
      }, {});
  }

  getReducer(config: ReducerDef): Function {
    const { reducer } = this.getReducers({
      reducer: config
    });
    return reducer;
  }
}