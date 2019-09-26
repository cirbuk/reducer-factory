import { isFunction, at, set } from "@bit/kubric.utils.common.lodash"
import { patchState } from "@bit/kubric.redux.state.utils";

export const applyTransform = (toTransform, transform, state, action) =>
  isFunction(transform) ? transform(toTransform, state, action) : toTransform;

export const assignAtPath = (toAssign, path, state) => {
  const splits = path.split(".");
  const last = splits.pop();
  const pathUptoLast = splits.join('.');
  //If tha value is to be assigned as an element of the array
  if (!isNaN(+last) && Array.isArray(at(state, pathUptoLast)[0])) {
    //A new state is formed which is a replica of the existing state but with
    //all objects along the path cloned
    const newState = patchState(state, pathUptoLast, []);
    set(newState, path, toAssign);
    return newState;
  } else {
    return patchState(state, pathUptoLast, {
      [last]: toAssign
    });
  }
};

export const toArray = str => Array.isArray(str) ? str : [str];
