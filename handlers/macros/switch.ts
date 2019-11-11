import { ops } from "../../constants";
import { toArray } from "../../utils";
import { Op, ReducerDef, ReducerOpDef, SwitchMacroDef } from "../../interfaces";

export default ({ defaultState = false, to, on = [], off = [], toggle = [], ops: extraOps = [], ...rest }: SwitchMacroDef) => {
  const result: ReducerDef = {
    ...rest,
    defaultState,
    ops: [{
      op: ops.ON as Op.ON,
      to,
      types: toArray(on)
    }, {
      op: ops.OFF as Op.OFF,
      to,
      types: toArray(off)
    }, {
      op: ops.TOGGLE as Op.TOGGLE,
      to,
      types: toArray(toggle)
    }]
  };
  result.ops = [
    ...(result.ops as Array<ReducerOpDef>).filter(({ types = [] }) => types.length > 0),
    ...extraOps
  ];
  return result;
};