import { ops } from "../../constants";
import { toArray } from "../../utils";

export default ({ defaultState = false, to, on = [], off = [], toggle = [], ops: extraOps = [], ...rest }) => {
  const result = {
    ...rest,
    defaultState,
    ops: [{
      op: ops.ON,
      to,
      types: toArray(on)
    }, {
      op: ops.OFF,
      to,
      types: toArray(off)
    }, {
      op: ops.TOGGLE,
      to,
      types: toArray(toggle)
    }]
  };
  result.ops = [
    ...result.ops.filter(({ types = [] }) => types.length > 0),
    ...extraOps
  ];
  return result;
};