import { createStore } from "redux";
import ReducerFactory, { ops } from "../../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

describe("insert with multiple from to tests", () => {
  let store;

  beforeEach(() => {
    store = createStore(factory.getReducer({
      defaultState: {
        names: ["a", "b", "c", "d"],
        ids: [1, 2, 3, 4]
      },
      ops: [{
        types: "INSERT",
        op: ops.INSERT,
        from: ["name", "id"],
        to: ["names", "ids"],
        at: 2
      }]
    }));
  });

  it("1. default state test", () =>
    expect(store.getState()).toEqual({
      names: ["a", "b", "c", "d"],
      ids: [1, 2, 3, 4]
    }));

  it("2. should insert into multiple arrays", () => {
    store.dispatch({
      type: "INSERT",
      payload: {
        name: "test",
        id: 5
      },
    });
    expect(store.getState()).toEqual({
      names: ["a", "b", "test", "c", "d"],
      ids: [1, 2, 5, 3, 4]
    });
  });
});