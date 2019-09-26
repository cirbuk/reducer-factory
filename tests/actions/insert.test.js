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
    array1: {
      defaultState: [1, 2, 3, 4, 5],
      ops: [{
        op: ops.APPEND,
        from: "array1",
        types: ["INSERT_ARRAY1"]
      }]
    },
    array2: {
      defaultState: [6, 7, 8, 9, 0],
      ops: [{
        op: ops.APPEND,
        from: "array2",
        types: ["INSERT_ARRAY2"]
      }]
    }
  },
  actions: {
    FETCHED: [{
      op: ops.ASSIGN,
      reducers: {
        name: "name",
        type: "typePayload",
        format: "format"
      }
    }, {
      op: ops.INSERT,
      reducers: {
        array1: {
          from: "array1",
          at: 3
        },
        array2: {
          from: "array2",
          at: 2
        },
      }
    }]
  }
};

describe("Insert actions test", () => {
  let store;

  beforeEach(() => {
    store = createStore(combineReducers(factory.getReducers(config)));
  });

  it("should return default value",
    () => expect(store.getState()).toEqual({
      name: "",
      type: "",
      format: "",
      array1: [1, 2, 3, 4, 5],
      array2: [6, 7, 8, 9, 0]
    }));

  it("should assign from multiple ops",
    () => {
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
        type: "INSERT_ARRAY1",
        array1: [10, 20]
      });
      store.dispatch({
        type: "INSERT_ARRAY2",
        array2: [30, 40]
      });
      return expect(store.getState()).toEqual({
        name: "test",
        type: "type",
        format: "format",
        array1: [1, 2, 3, 4, 5, 10, 20],
        array2: [6, 7, 8, 9, 0, 30, 40]
      });
    });

  it("should insert at the right location",
    () => {
      store.dispatch({
        type: "FETCHED",
        name: "test",
        typePayload: "type",
        format: "format",
        array1: [10, 20],
        array2: [30, 40]
      });
      return expect(store.getState()).toEqual({
        name: "test",
        type: "type",
        format: "format",
        array1: [1, 2, 3, 10, 20, 4, 5],
        array2: [6, 7, 30, 40, 8, 9, 0]
      });
    });
});