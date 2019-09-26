import { createStore, combineReducers } from "redux";
import ReducerFactory from "../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

describe("constant tests", () => {
  let store;

  beforeEach(() => {
    store = createStore(factory.getReducer({
      defaultState: {
        name: "",
        id: null
      },
      ops: [{
        types: "ASSIGN_PAYLOAD_OVERRIDE",
        payload: {
          defaultName: "test",
          defaultId: 1
        },
        from: ["defaultName", "defaultId"],
        to: ["name", "id"]
      }, {
        types: "ASSIGN_UNDEFINED",
        payload: {},
        from: "undefined.path"
      }]
    }));
  });

  it("1. default state test", () =>
    expect(store.getState()).toEqual({
      name: "",
      id: null
    }));

  it("2. should assign from payload override", () => {
    store.dispatch({
      type: "ASSIGN_PAYLOAD_OVERRIDE",
      payload: {
        name: "kubric",
        id: "2"
      }
    });
    expect(store.getState()).toEqual({
      name: "test",
      id: 1
    });
  });

  it("3. should assign undefined from payload override", () => {
    store.dispatch({
      type: "ASSIGN_UNDEFINED",
      payload: {
        undefined: {
          path: {
            name: "kubric",
            id: "2"
          }
        }
      }
    });
    expect(store.getState()).toEqual(undefined);
  });
});