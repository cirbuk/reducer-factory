import ReducerFactory, { ops } from "../../index";
import { combineReducers, createStore } from "redux";

const factory = new ReducerFactory();

const config = {
  reducers: {
    name: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "name",
        types: ["NAME_CHANGED"],
      }]
    },
    type: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "typePayload",
        types: ["TYPE_CHANGED"],
      }]
    },
    format: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "format",
        types: ["FORMAT_CHANGED"],
      }]
    },
    loading: {
      defaultState: false,
      ops: [{
        op: ops.ON,
        types: ["LOADED"],
      }]
    }
  },
  actions: {
    FETCHED: [{
      op: ops.ASSIGN,
      reducers: {
        name: "name",
        type: "typePayload",
        format: "format",
        loading: "loading"
      }
    }],
    FETCHED_FROM_SERVICE: [{
      op: ops.ASSIGN,
      reducers: {
        name: "response.name",
        type: "response.typePayload",
        format: "response.format",
        loading: "response.loading"
      }
    }]
  }
};

describe("Basic+ types test", () => {
  let store;

  beforeEach(() => {
    store = createStore(combineReducers(factory.getReducers(config)));
  });

  it("should return default value",
    () => expect(store.getState()).toEqual({
      name: "",
      type: "",
      format: "",
      loading: false
    }));

  it("should change values", () => {
    store.dispatch({
      type: "NAME_CHANGED",
      name: "test"
    });
    store.dispatch({
      type: "TYPE_CHANGED",
      typePayload: "type"
    });
    store.dispatch({
      type: "FORMAT_CHANGED",
      format: "format"
    });
    store.dispatch({
      type: "LOADED",
    });
    return expect(store.getState())
      .toEqual({
        name: "test",
        type: "type",
        format: "format",
        loading: true
      });
  });

  it("should change values from actions def for FETCHED", () => {
    store.dispatch({
      type: "FETCHED",
      name: "test",
      typePayload: "type",
      format: "format",
      loading: true
    });
    return expect(store.getState())
      .toEqual({
        name: "test",
        type: "type",
        format: "format",
        loading: true
      });
  });

  it("should change values from actions def for FETCHED_FROM_SERVICE", () => {
    store.dispatch({
      type: "FETCHED_FROM_SERVICE",
      response: {
        name: "test",
        typePayload: "type",
        format: "format",
        loading: true
      }
    });
    return expect(store.getState())
      .toEqual({
        name: "test",
        type: "type",
        format: "format",
        loading: true
      });
  });
});