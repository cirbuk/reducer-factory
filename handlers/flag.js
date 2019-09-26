import { ops } from "../constants";
import { at, isUndefined } from "@bit/kubric.utils.common.lodash"
import { applyTransform, assignAtPath } from "../utils";

export default (state, { op, transform } = {}, dispatchedAction) => {
  const { type, to } = op;
  const hasPath = !isUndefined(to);
  let newValue;
  if (type === ops.ON) {
    newValue = true;
  } else if (type === ops.OFF) {
    newValue = false;
  } else if (type === ops.TOGGLE) {
    const currentValue = !hasPath ? state : at(state, to)[0];
    newValue = !!!currentValue;
  }
  newValue = applyTransform(newValue, transform, state, dispatchedAction);
  if (!hasPath) {
    return newValue;
  } else {
    return assignAtPath(newValue, to, state);
  }
}