import { isString, isUndefined, isFunction, isValidString, isPlainObject } from "@kubric/litedash";
import { ops } from "./constants";
import handlers from './handlers';
import MacroExpander from './handlers/macros';
import { composeReducers } from "@bit/kubric.redux.reducers.utils";
import Resolver from "@kubric/resolver";

const resolver = new Resolver();

export { ops, macros } from './constants';

export default class ReducerFactory {
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

  _processOp(op) {
    const { type, from, to, ...restOp } = op;
    if (isUndefined(this.opHandlers[type])) {
      throw new Error(`Unrecognized action "${type}" found in the config`);
    } else if (Array.isArray(from)) {
      if (!Array.isArray(to) || to.length !== from.length) {
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
    } else if (Array.isArray(to)) {
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

  _parseOps(opsArray = [], { globalTransformer, globalDefault }) {
    return opsArray.reduce((acc, opConfig) => {
      let { types = [], transform: localTransformer, defaultValue: localDefault, ...opObject } = opConfig;
      if (isUndefined(opObject)) {
        throw new Error(`No valid "op" declaration found in: ${JSON.stringify(opConfig)}`);
      }
      if (isString(types)) {
        types = [types];
      }
      let parsedOp = {
        type: ops.ASSIGN
      };
      if (isValidString(opObject.op)) {
        parsedOp = {
          type: opObject.op
        }
      }
      const { op: type, ...restOp } = opObject;
      parsedOp = {
        type: isValidString(type) ? type : ops.ASSIGN,
        ...restOp
      };
      parsedOp = this._processOp(parsedOp);
      const transform = localTransformer || globalTransformer;
      const defaultValue = !isUndefined(localDefault) ? localDefault : globalDefault;
      return types.reduce((acc, type) => {
        acc[type] = parsedOp.reduce((acc, op) => {
          acc.push({
            op,
            transform,
            defaultValue
          });
          return acc;
        }, acc[type] || []);
        return acc;
      }, acc);
    }, {});
  }

  _generateReducer(types, { defaultState, reducer } = {}) {
    return (state = defaultState, action = {}) => {
      const { type = "__UNDEFINED_TYPE__" } = action;
      const currentOps = types[type];
      if (!isUndefined(currentOps)) {
        return currentOps.reduce((state, currentOp) => {
          let { op: configOp } = currentOp;
          let { type, payload: payloadOverride } = configOp;
          const handler = this.opHandlers[type];
          let newAction = JSON.parse(JSON.stringify(action));
          newAction.payload = !isUndefined(payloadOverride) ? payloadOverride : newAction.payload;
          return handler(state, {
            ...currentOp,
            op: resolver.resolve(configOp, action.payload),
            basePath: this.payloadPath
          }, newAction);
        }, state);
      } else {
        return isFunction(reducer) ? reducer(state, action) : state;
      }
    };
  }

  static _getExtraReducer(reducer, defaultState) {
    if (Array.isArray(reducer)) {
      return composeReducers(reducer, defaultState);
    }
    return reducer;
  };

  _actionsToReducerConfig(actionsConfig) {
    return Object.keys(actionsConfig)
      .reduce((acc, actionType) =>
        actionsConfig[actionType].reduce((acc, actionConfig) => {
          const { op: opType, reducers: reducerMap = {} } = actionConfig;
          return Object.keys(reducerMap)
            .reduce((acc, reducerName) => {
              let op = reducerMap[reducerName];
              if (isString(op)) {
                op = {
                  from: op
                }
              }
              const currentReducerConfig = acc[reducerName] || {};
              const { ops: reducerOps = [] } = currentReducerConfig;
              reducerOps.push({
                types: [actionType],
                op: opType,
                ...op
              });
              currentReducerConfig.ops = reducerOps;
              acc[reducerName] = currentReducerConfig;
              return acc;
            }, acc);
        }, acc), {});
  }

  _mergeConfigs(src = {}, dest = {}) {
    return Object.keys(src).reduce((acc, srcKey) => {
      let srcReducer = this.macroExpander.expand(src[srcKey]);
      if (!acc[srcKey]) {
        acc[srcKey] = srcReducer;
      } else {
        const { ops: destOps = [] } = acc[srcKey];
        if (!isPlainObject(srcReducer)) {
          srcReducer = {
            defaultState: srcReducer
          };
        }
        let { ops: srcOps = [], ...rest } = srcReducer;
        const { defaultState, transform, reducer, defaultValue, ...opConfig } = (rest || {});
        if (srcOps.length === 0 && Object.keys(opConfig).length > 0) {
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

  getReducers({ reducers: reducerConfig, actions: actionsConfig, ...restConfig } = {}) {
    if (isUndefined(reducerConfig) && isUndefined(actionsConfig)) {
      reducerConfig = restConfig || {};
    }
    let finalConfig = this._actionsToReducerConfig(actionsConfig || {});
    finalConfig = this._mergeConfigs(reducerConfig, finalConfig);
    return Object.keys(finalConfig)
      .reduce((reducers, reducerName) => {
        let reducerConfig = finalConfig[reducerName];
        let { defaultState, transform: globalTransformer, reducer, ops: opsConfig = [], defaultValue: globalDefault, ...op } = reducerConfig;
        defaultState = JSON.parse(JSON.stringify(defaultState));
        const extraReducer = ReducerFactory._getExtraReducer(reducer, defaultState);
        if (opsConfig.length === 0 && Object.keys(op).length > 0) {
          opsConfig = [op];
        }
        if (opsConfig.length === 0 && isFunction(extraReducer)) {
          reducers[reducerName] = (state = defaultState, action) => extraReducer(state, action);
        } else if (opsConfig.length > 0) {
          const types = this._parseOps(opsConfig, {
            globalTransformer,
            globalDefault
          });
          reducers[reducerName] = this._generateReducer(types, {
            defaultState,
            reducer: extraReducer
          });
        } else if (!isUndefined(defaultState)) {
          reducers[reducerName] = (state = defaultState) => state;
        }
        return reducers;
      }, {});
  }

  getReducer(config) {
    const { reducer } = this.getReducers({
      reducer: config
    });
    return reducer;
  }
}