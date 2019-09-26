import { createStore, combineReducers } from "redux";
import ReducerFactory from "../index";

const factory = new ReducerFactory({
  payloadPath: "data.payload"
});

describe("payloadPath tests", () => {
  let store;

  beforeEach(() => {
    store = createStore(combineReducers(factory.getReducers({
      name: {
        defaultState: "",
        types: "NAME_CHANGED",
        from: "name"
      }
    })));
  });

  it("1. default state test", () =>
    expect(store.getState()).toEqual({
      name: ""
    }));

  it("2. should fetch from data.name", () => {
    store.dispatch({
      type: "NAME_CHANGED",
      data: {
        payload: {
          name: "kubric"
        }
      }
    });
    expect(store.getState()).toEqual({
      name: "kubric"
    });
  });
});