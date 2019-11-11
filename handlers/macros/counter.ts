import { isFunction, isValidString, get } from "@kubric/litedash";
import { toArray } from "../../utils";
import { patchState } from "@kubric/reduxutils";
import { CounterMacroDef, ReducerDef, ReducerOpDef } from "../../interfaces";

export default ({ defaultState = 0, to, step = 1, next = [], previous = [], first = [], last = [], max, min = 0, ops: extraOps = [], ...rest }: CounterMacroDef) => {
  const getMax = (state: any) => isFunction(max) ? (max as Function)(state) : +(max as number);
  const getMin = (state: any) => isFunction(min) ? (min as Function)(state) : +min;
  const hasTo = isValidString(to);
  const getCurrentCount = (state: any) => hasTo ? get(state, to) : state;
  const getNewState = (state: any, finalCount: number) => {
    if(hasTo) {
      const splits = (to as string).split('.');
      const last = splits.pop() as string;
      return patchState(state, {
        [last]: finalCount
      }, {
        path: splits.join('.')
      });
    }
    return finalCount;
  };
  const result: ReducerDef = {
    ...rest,
    defaultState,
    ops: [{
      types: toArray(next),
      transform(val: any, state: any) {
        const maxCount = getMax(state);
        const proposedCount = getCurrentCount(state) + step;
        const finalCount = proposedCount > maxCount ? maxCount : proposedCount;
        return getNewState(state, finalCount);
      }
    }, {
      types: toArray(previous),
      transform(val: any, state: any) {
        const minCount = getMin(state);
        const proposedCount = getCurrentCount(state) - step;
        const finalCount = proposedCount < minCount ? minCount : proposedCount;
        return getNewState(state, finalCount);
      }
    }, {
      types: toArray(first),
      transform(val: any, state: any) {
        return getNewState(state, getMin(state));
      }
    }, {
      types: toArray(last),
      transform(val: any, state: any) {
        return getNewState(state, getMax(state));
      }
    }]
  };
  result.ops = [
    ...(result.ops as Array<ReducerOpDef>).filter(({ types = [] }) => types.length > 0),
    ...extraOps
  ];
  return result;
}
;
