import { assignAtPath, applyTransform } from "../utils";
import { get, isUndefined } from "@kubric/litedash";
import { ops } from "../constants";
import { patchState } from "@kubric/reduxutils";

export default (state, { op, defaultValue, transform, basePath = '' } = {}, dispatchedAction) => {
  const { type, to, from = '', at: insertAt } = op;
  const payload = basePath.length === 0 ? dispatchedAction : get(dispatchedAction, basePath);
  let valueToAssign = get(payload, from, defaultValue);
  valueToAssign = applyTransform(valueToAssign, transform, state, op);
  if (type === ops.ASSIGN) {
    return isUndefined(to) ? valueToAssign : assignAtPath(valueToAssign, to, state);
  } else if (type === ops.APPEND || type === ops.INSERT) {
    return patchState(state, valueToAssign, {
      path: to,
      at: insertAt
    });
  } else if (type === ops.PREPEND) {
    return patchState(state, valueToAssign, {
      path: to,
      at: 0
    });
  }
};