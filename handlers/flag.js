import { ops } from "../constants";
import { get, isUndefined } from "@kubric/litedash"
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
    const currentValue = !hasPath ? state : get(state, to);
    newValue = !!!currentValue;
  }
  newValue = applyTransform(newValue, transform, state, dispatchedAction);
  if (!hasPath) {
    return newValue;
  } else {
    return assignAtPath(newValue, to, state);
  }
}