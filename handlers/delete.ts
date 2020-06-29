import { applyTransform, assignAtPath } from "../utils";
import { get, isUndefined, isValidString } from "@kubric/litedash";
import { patchState } from "@kubric/reduxutils";
import { ParsedReducerOpDef, ReduxAction } from "../interfaces";

export default (state: any, { op, defaultValue, transform, basePath = '' }: ParsedReducerOpDef, dispatchedAction: ReduxAction, valueOverride?: any) => {
  const { to, from = '', at: deleteAt } = op;
  const payload = basePath.length === 0 ? dispatchedAction : get(dispatchedAction, basePath);
  let valueToDelete = !isUndefined(valueOverride) ? valueOverride : get(payload, from, defaultValue);
  valueToDelete = applyTransform(valueToDelete, transform, state, op);

  // For this op, valueToDelete denotes the value to be deleted
  // if deleteAt is present, it will override the valueToDelete and the value at the position will be deleted
  let currentState = state;
  if(isValidString(to)) {
    currentState = get(state, to);
  }
  let newState;
  if(isValidString(currentState) && !isUndefined(deleteAt)) {
    // @ts-ignore
    newState = currentState.slice(0, deleteAt) + currentState.slice(deleteAt + 1);
  } else if(Array.isArray(currentState) && !isUndefined(deleteAt)) {
    // @ts-ignore
    newState = [...currentState.slice(0, deleteAt), ...currentState.slice(deleteAt + 1)];
  } else if(Array.isArray(currentState) && !isUndefined(valueToDelete)) {
    newState = currentState.filter(val => val !== valueToDelete);
  } else {
    newState = state;
  }
  return isValidString(to) ? assignAtPath(newState, to as string, state) : newState;
};