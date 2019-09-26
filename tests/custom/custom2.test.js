import ReducerFactory from "../../index";
import _ from 'lodash';
import { createStore } from 'redux';

const factory = new ReducerFactory({
  ops: {
    //Returns the stringified version of the state always
    JSON_STRING_ASSIGN: (state, {
      op, //Name of the op - JSON_STRING_ASSIGN
      basePath = '', //payloadPath defined with the reducer factory. In this case it will be "payload"
      ...rest //all other properties that are defined in the reducer definition
    } = {}, dispatchedAction) => {
      const { defaultValue, transform } = rest;
      const payload = _.get(dispatchedAction, basePath, defaultValue);
      const transformed = _.isFunction(transform) ? transform(payload) : payload;
      return JSON.stringify(transformed);
    }
  },
  payloadPath: "payload"
});

const reducer = factory.getReducer({
  defaultState: "[]",
  types: "FETCHED",
  op: "JSON_STRING_ASSIGN",
  defaultValue: {}
});

describe("Custom op tests", () => {
  let store;

  beforeEach(() => {
    store = createStore(reducer);
  });

  it("should return default", () => expect(store.getState()).toEqual("[]"));

  it("should return '{}' for undefined payload", () => {
    store.dispatch({
      type: "FETCHED"
    });
    return expect(store.getState()).toEqual("{}")
  });

  it("should return proper stringified JSON from payload", () => {
    store.dispatch({
      type: "FETCHED",
      payload: {
        map1: "test",
        map2: "blast"
      }
    });
    return expect(store.getState()).toEqual('{"map1":"test","map2":"blast"}');
  });
});