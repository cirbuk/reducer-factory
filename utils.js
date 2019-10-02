import { isFunction, set, get } from "@kubric/litedash"
import { patchState } from "@bit/kubric.redux.state.utils";

export const applyTransform = (toTransform, transform, state, action) =>
  isFunction(transform) ? transform(toTransform, state, action) : toTransform;

export const assignAtPath = (toAssign, path, state) => {
  const splits = path.split(".");
  const last = splits.pop();
  const pathUptoLast = splits.join('.');
  //If tha value is to be assigned as an element of the array
  if (!isNaN(+last) && Array.isArray(get(state, pathUptoLast))) {
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

export const composeReducers = (reducers = [], defaultState = {}) =>
  (state = defaultState, action) => reducers.reduce((state, reducer) => reducer(state, action), state);