import { isFunction, set, get } from "@kubric/litedash"
import { patchState } from "@kubric/reduxutils";
import { ReduxAction } from "./interfaces";

export const applyTransform = (toTransform: any, transform: Function | undefined, state: any, action: ReduxAction) =>
  isFunction(transform) ? (transform as Function)(toTransform, state, action) : toTransform;

export const assignAtPath = (toAssign: any, path: string, state: any) => {
  const splits = path.split(".");
  const last = splits.pop();
  const pathUptoLast = splits.join('.');
  //If tha value is to be assigned as an element of the array
  if(!isNaN(+(last as string)) && Array.isArray(get(state, pathUptoLast))) {
    //A new state is formed which is a replica of the existing state but with
    //all objects along the path cloned
    const newState = patchState(state, [], pathUptoLast);
    set(newState, path, toAssign);
    return newState;
  } else {
    return patchState(state, {
      [(last as string)]: toAssign
    }, pathUptoLast);
  }
};

export const toArray = (str: string | Array<string>) => Array.isArray(str) ? str : [str];

export const composeReducers = (reducers: Array<Function> = [], defaultState = {}) =>
  (state = defaultState, action: ReduxAction) => reducers.reduce((state, reducer) => reducer(state, action), state);