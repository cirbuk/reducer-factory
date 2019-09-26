import { isFunction, isValidString, at } from "@bit/kubric.utils.common.lodash";
import { toArray } from "../../utils";
import { patchState } from "@bit/kubric.redux.state.utils";

export default ({ defaultState = 0, to, step = 1, next = [], previous = [], first = [], last = [], max, min = 0, ops: extraOps = [], ...rest }) => {
  const getMax = state => isFunction(max) ? max(state) : +max;
  const getMin = state => isFunction(min) ? min(state) : +min;
  const hasTo = isValidString(to);
  const getCurrentCount = state => hasTo ? at(state, to)[0] : state;
  const getNewState = (state, finalCount) => {
    if (hasTo) {
      const splits = to.split('.');
      const last = splits.pop();
      return patchState(state, {
        path: splits.join('.')
      }, {
        [last]: finalCount
      });
    }
    return finalCount;
  };
  const result = {
    ...rest,
    defaultState,
    ops: [{
      types: toArray(next),
      transform(val, state) {
        const maxCount = getMax();
        const proposedCount = getCurrentCount(state) + step;
        const finalCount = proposedCount > maxCount ? maxCount : proposedCount;
        return getNewState(state, finalCount);
      }
    }, {
      types: toArray(previous),
      transform(val, state) {
        const minCount = getMin();
        const proposedCount = getCurrentCount(state) - step;
        const finalCount = proposedCount < minCount ? minCount : proposedCount;
        return getNewState(state, finalCount);
      }
    }, {
      types: toArray(first),
      transform(val, state) {
        return getNewState(state, getMin(state));
      }
    }, {
      types: toArray(last),
      transform(val, state) {
        return getNewState(state, getMax(state));
      }
    }]
  };
  result.ops = [
    ...result.ops.filter(({ types = [] }) => types.length > 0),
    ...extraOps
  ];
  return result;
}
;
