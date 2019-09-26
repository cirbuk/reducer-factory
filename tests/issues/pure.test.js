import { createStore } from "redux";
import ReducerFactory, { ops } from "../../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

const types = {
  PAYLOAD_ASSIGN: "PAYLOAD_ASSIGN",
  ASSIGN_FROM_TO: "ASSIGN_FROM_TO",
  ASSIGN_OBJECT_FROM_TO: "ASSIGN_OBJECT_FROM_TO",
  ASSIGN_ARRAY: "ASSIGN_ARRAY",
  ASSIGN_ARRAY_END: "ASSIGN_ARRAY_END",
  APPEND_OBJECT: "APPEND_OBJECT",
  APPEND_ARRAY: "APPEND_ARRAY"
};

const DEFAULT_STATE = {
  array: [
    {
      one: 1
    },
    {
      three: 1
    }
  ],
  object: {
    level: {
      name: "level1",
      level: {
        name: "level2",
        level: {
          name: "level3"
        }
      }
    },
    levels: ['level1', 'level2', 'level3']
  }
};

const reducer = factory.getReducer({
  defaultState: DEFAULT_STATE,
  ops: [{
    types: types.PAYLOAD_ASSIGN,
  }, {
    types: types.ASSIGN_FROM_TO,
    from: 'blast.assign',
    to: 'array.2'
  }, {
    types: types.ASSIGN_OBJECT_FROM_TO,
    from: 'blast.assign',
    to: 'object.level.level.assigned'
  }, {
    types: types.ASSIGN_ARRAY,
    to: 'array.1'
  }, {
    types: types.ASSIGN_ARRAY_END,
    to: 'array.2'
  }, {
    types: types.APPEND_OBJECT,
    op: ops.APPEND,
    to: "object.level.level"
  }, {
    types: types.APPEND_ARRAY,
    op: ops.APPEND,
    from: "blast",
    to: "object.levels"
  }]
});

describe("Purity tests", () => {
  let store;
  beforeEach(() => {
    store = createStore(reducer);
  });

  it("1. Default state value test", () => {
    expect(store.getState()).toEqual(DEFAULT_STATE);
  });

  it("2. Default state identity test", () => {
    expect(store.getState() !== DEFAULT_STATE).toEqual(true);
  });

  it("3. Payload assign value test", () => {
    const payload = {
      blast: true
    };
    store.dispatch({
      type: types.PAYLOAD_ASSIGN,
      payload
    });
    expect(store.getState()).toEqual(payload);
  });

  it("4. Payload assign identity test", () => {
    const payload = {
      blast: true
    };
    store.dispatch({
      type: types.PAYLOAD_ASSIGN,
      payload
    });
    expect(store.getState() !== payload).toEqual(true);
  });

  it("5. Payload assign from to value tests", () => {
    const payload = {
      blast: {
        assign: {
          two: 2
        }
      }
    };
    store.dispatch({
      type: types.ASSIGN_FROM_TO,
      payload
    });
    expect(store.getState().array[2]).toEqual(payload.blast.assign);
  });

  it("6. Payload assign from to identity tests", () => {
    const payload = {
      blast: {
        assign: {
          two: 2
        }
      }
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.ASSIGN_FROM_TO,
      payload
    });
    const newState = store.getState();
    const result = oldState.object === newState.object
      && oldState.array !== newState.array
      && oldState.array[0] === newState.array[0]
      && oldState.array[1] === newState.array[1]
      && oldState.array[2] !== payload;
    expect(result).toEqual(true);
  });

  it("7. Payload assign object from to value tests", () => {
    const payload = {
      blast: {
        assign: {
          two: 2
        }
      }
    };
    store.dispatch({
      type: types.ASSIGN_OBJECT_FROM_TO,
      payload
    });
    const newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    newState.object.level.level.assigned = payload.blast.assign;
    expect(store.getState()).toEqual(newState);
  });

  it("8. Payload assign object from to identity tests", () => {
    const payload = {
      blast: {
        assign: {
          two: 2
        }
      }
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.ASSIGN_OBJECT_FROM_TO,
      payload
    });
    const newState = store.getState();
    expect(
      oldState !== newState
      && oldState.array === newState.array
      && oldState.array[0] === newState.array[0]
      && oldState.array[1] === newState.array[1]
      && oldState.object !== newState.object
      && oldState.object.level !== newState.object.level
      && oldState.object.level.name === newState.object.level.name
      && oldState.object.level.level !== newState.object.level.level
      && oldState.object.level.level.name === newState.object.level.level.name
      && oldState.object.level.level.level === newState.object.level.level.level
      && oldState.object.level.level.assigned !== payload.blast.assign
    ).toEqual(true);
  });

  it("9. Payload assign array value tests", () => {
    const payload = {
      two: 5
    };
    store.dispatch({
      type: types.ASSIGN_ARRAY,
      payload
    });
    const newState = store.getState();
    const expectedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    expectedState.array = [{
      one: 1
    }, {
      two: 5
    }];
    expect(newState).toEqual(expectedState);
  });

  it("10. Payload assign array identity tests", () => {
    const payload = {
      two: 5
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.ASSIGN_ARRAY,
      payload
    });
    const newState = store.getState();
    expect(
      oldState !== newState
      && oldState.object === newState.object
      && oldState.array !== newState.array
      && oldState.array[0] === newState.array[0]
      && oldState.array[1] !== payload
    ).toEqual(true);
  });

  it("11. Payload assign array end value tests", () => {
    const payload = {
      two: 5
    };
    store.dispatch({
      type: types.ASSIGN_ARRAY_END,
      payload
    });
    const newState = store.getState();
    const expectedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    expectedState.array = [{
      one: 1
    }, {
      three: 1
    }, {
      two: 5
    }];
    expect(newState).toEqual(expectedState);
  });

  it("12. Payload assign array identity tests", () => {
    const payload = {
      two: 5
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.ASSIGN_ARRAY_END,
      payload
    });
    const newState = store.getState();
    expect(
      oldState !== newState
      && oldState.object === newState.object
      && oldState.array !== newState.array
      && oldState.array[0] === newState.array[0]
      && oldState.array[1] === newState.array[1]
      && oldState.array[2] !== payload
    ).toEqual(true);
  });

  it("13. Payload append object value tests", () => {
    const payload = {
      two: 5
    };
    store.dispatch({
      type: types.APPEND_OBJECT,
      payload
    });
    const newState = store.getState();
    const expectedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    expectedState.object.level.level.two = 5;
    expect(newState).toEqual(expectedState);
  });

  it("14. Payload append object identity tests", () => {
    const payload = {
      two: 5
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.APPEND_OBJECT,
      payload
    });
    const newState = store.getState();
    expect(
      oldState !== newState
      && oldState.array === newState.array
      && oldState.object !== newState.object
      && oldState.object.level !== newState.object.level
      && oldState.object.level.level !== newState.object.level.level
      && oldState.object.level.level.level === newState.object.level.level.level
    ).toEqual(true);

  });

  it("15. Payload append array value tests", () => {
    const payload = {
      blast: [{
        two: 5
      }]
    };
    store.dispatch({
      type: types.APPEND_ARRAY,
      payload
    });
    const newState = store.getState();
    const expectedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    expectedState.object.levels[3] = payload.blast[0];
    expect(newState).toEqual(expectedState);
  });

  it("16. Payload append array identity tests", () => {
    const payload = {
      blast: [{
        two: 5
      }]
    };
    const oldState = store.getState();
    store.dispatch({
      type: types.APPEND_ARRAY,
      payload
    });
    const newState = store.getState();
    expect(
      oldState !== newState
      && oldState.array === newState.array
      && oldState.object !== newState.object
      && oldState.object.level === newState.object.level
      && oldState.object.levels !== newState.object.levels
      && oldState.object.levels[3] !== payload.blast[0]
    ).toEqual(true);

  });
});
