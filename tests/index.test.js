import { createStore, combineReducers } from "redux";
import ReducerFactory from "../index";
import reducerConfig, { types } from './config';

const factory = new ReducerFactory({
  payloadPath: "payload"
});

describe("Factory tests", () => {
  let store, newState;

  beforeEach(() => {
    store = createStore(combineReducers(factory.getReducers(reducerConfig)));
    newState = {
      flag: false,
      flagObject: {
        toggled: false
      },
      multipleFromTo: {
        flagObject: {
          flag: false
        },
        name: "",
        value: 1,
      },
      assignDefault: {},
      assignTransform: {},
      assigned: {
        path: {}
      },
      appended: {
        string: "string1",
        array: [{
          string1: "string1"
        }],
        object: {
          string1: "string1"
        }
      },
      prepended: {
        string: "string1",
        array: [{
          string1: "string1"
        }],
        object: {
          string1: "string1"
        }
      },
      inserted: {
        string: "string1",
        array: [{
          string1: "string1"
        }, {
          string2: "string2"
        }, {
          string3: "string3"
        }],
        object: {
          string1: "string1"
        }
      },
      composed: "default",
      resolveAppend: [
        {
          flag: false,
          name: "rest",
          list: [{
            id: "1",
            api: "rtest"
          }, {
            id: "2",
            api: "rtest"
          }]
        }
      ]
    };
  });

  it("1. Checking default state", () => {
    return expect(store.getState()).toEqual(newState);
  });

  it("2. Flag on", () => {
    store.dispatch({
      type: types.ON
    });
    newState.flag = true;
    return expect(store.getState()).toEqual(newState);
  });

  it("3. Flag off", () => {
    store.dispatch({
      type: types.ON
    });
    store.dispatch({
      type: types.OFF
    });
    newState.flag = false;
    return expect(store.getState()).toEqual(newState);
  });

  it("4. Flag toggle", () => {
    store.dispatch({
      type: types.TOGGLE
    });
    newState.flag = true;
    return expect(store.getState()).toEqual(newState);
  });

  it("5. Flag toggle at", () => {
    store.dispatch({
      type: types.TOGGLE_AT
    });
    newState.flagObject.toggled = true;
    return expect(store.getState()).toEqual(newState);
  });

  it("6. Flag on at", () => {
    store.dispatch({
      type: types.ON_AT
    });
    newState.flagObject.toggled = true;
    return expect(store.getState()).toEqual(newState);
  });

  it("7. Flag off at", () => {
    store.dispatch({
      type: types.OFF_AT
    });
    newState.flagObject.toggled = false;
    return expect(store.getState()).toEqual(newState);
  });

  it("8. Assign global default", () => {
    store.dispatch({
      type: types.ASSIGN_GLOBAL_DEFAULT
    });
    newState.assignDefault.global = "global";
    return expect(store.getState()).toEqual(newState);
  });

  it("9. Assign local default", () => {
    store.dispatch({
      type: types.ASSIGN_LOCAL_DEFAULT
    });
    newState.assignDefault.local1 = {
      local: "local1"
    };
    newState.assignDefault.local2 = {
      local: "local2"
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("10. Assign global transform", () => {
    store.dispatch({
      type: types.ASSIGN_GLOBAL_TRANSFORM,
      payload: "payload"
    });
    newState.assignTransform = "global_transform_payload";
    return expect(store.getState()).toEqual(newState);
  });

  it("11. Assign local transform", () => {
    store.dispatch({
      type: types.ASSIGN_LOCAL_TRANSFORM,
      payload: "payload"
    });
    newState.assignTransform = {
      lt1: "local_transform1_payload",
      lt2: "local_transform2_payload",
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("12. Assign", () => {
    store.dispatch({
      type: types.ASSIGN,
      payload: "payload"
    });
    newState.assigned = "payload";
    return expect(store.getState()).toEqual(newState);
  });

  it("13. Assign to", () => {
    store.dispatch({
      type: types.ASSIGN_TO,
      payload: "payload"
    });
    newState.assigned.path.value = "payload";
    return expect(store.getState()).toEqual(newState);
  });

  it("14. Assign from to", () => {
    store.dispatch({
      type: types.ASSIGN_FROM_TO,
      payload: {
        response: {
          value: {
            field: "payload"
          }
        }
      }
    });
    newState.assigned.path.value = {
      field: "payload"
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("15. Append string", () => {
    store.dispatch({
      type: types.APPEND_STRING,
      payload: "string2"
    });
    newState.appended.string = "string1string2";
    return expect(store.getState()).toEqual(newState);
  });

  it("16. Append array", () => {
    store.dispatch({
      type: types.APPEND_ARRAY,
      payload: [{
        string2: "string2"
      }]
    });
    newState.appended.array = [{
      string1: "string1"
    }, {
      string2: "string2"
    }];
    return expect(store.getState()).toEqual(newState);
  });

  it("17. Append object", () => {
    store.dispatch({
      type: types.APPEND_OBJECT,
      payload: {
        string2: "string2"
      }
    });
    newState.appended.object = {
      string1: "string1",
      string2: "string2"
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("18. Assign multiple from -> to", () => {
    store.dispatch({
      type: types.ASSIGN_MULTIPLE,
      payload: {
        name: "string",
        value: [2],
        loading: {
          isLoading: true
        }
      }
    });
    newState.multipleFromTo = {
      flagObject: {
        flag: true
      },
      name: "string",
      value: 2,
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("19. Composed reducer", () => {
    store.dispatch({
      type: types.COMPOSE,
      payload: "_compose"
    });
    store.dispatch({
      type: types.COMPOSE1,
    });
    store.dispatch({
      type: types.COMPOSE2,
    });
    newState.composed = "default_compose_compose1_compose2";
    return expect(store.getState()).toEqual(newState);
  });

  it("20. Resolve to assign reducer", () => {
    store.dispatch({
      type: types.RESOLVE_TO_ASSIGN,
      payload: {
        data: "newName",
        index: 0,
        apiIndex: 1
      }
    });
    newState.resolveAppend[0].list[1].api = "newName";
    return expect(store.getState()).toEqual(newState);
  });

  it("21. Resolve to append reducer", () => {
    store.dispatch({
      type: types.RESOLVE_TO_APPEND,
      payload: {
        data: [{
          id: "3",
          api: "rtest"
        }],
        index: 0
      }
    });
    newState.resolveAppend[0].list.push({
      id: "3",
      api: "rtest"
    });
    return expect(store.getState()).toEqual(newState);
  });

  it("22. Insert at reducer", () => {
    store.dispatch({
      type: types.RESOLVE_TO_APPEND,
      payload: {
        data: [{
          id: "3",
          api: "rtest"
        }],
        index: 0
      }
    });
    newState.resolveAppend[0].list.push({
      id: "3",
      api: "rtest"
    });
    return expect(store.getState()).toEqual(newState);
  });

  it("23. Prepend string", () => {
    store.dispatch({
      type: types.PREPEND_STRING,
      payload: "string2"
    });
    newState.prepended.string = "string2string1";
    return expect(store.getState()).toEqual(newState);
  });

  it("24. Prepend array", () => {
    store.dispatch({
      type: types.PREPEND_ARRAY,
      payload: [{
        string2: "string2"
      }]
    });
    newState.prepended.array = [{
      string2: "string2"
    }, {
      string1: "string1"
    }];
    return expect(store.getState()).toEqual(newState);
  });

  it("25. Prepend object", () => {
    store.dispatch({
      type: types.PREPEND_OBJECT,
      payload: {
        string2: "string2"
      }
    });
    newState.prepended.object = {
      string1: "string1",
      string2: "string2"
    };
    return expect(store.getState()).toEqual(newState);
  });

  it("26. Insert string", () => {
    store.dispatch({
      type: types.INSERT_STRING,
      payload: {
        data: "string2",
        index: "2"
      }
    });
    newState.inserted.string = "ststring2ring1";
    return expect(store.getState()).toEqual(newState);
  });

  it("27. Insert array", () => {
    store.dispatch({
      type: types.INSERT_ARRAY,
      payload: {
        data: {
          string4: "string4"
        },
        index: 2
      }
    });
    newState.inserted.array = [{
      string1: "string1"
    }, {
      string2: "string2"
    }, {
      string4: "string4"
    }, {
      string3: "string3"
    }];
    return expect(store.getState()).toEqual(newState);
  });

  it("28. Insert object", () => {
    store.dispatch({
      type: types.INSERT_OBJECT,
      payload: {
        data: {
          string2: "string2"
        },
        index: "4"
      }
    });
    newState.inserted.object = {
      string1: "string1",
      string2: "string2"
    };
    return expect(store.getState()).toEqual(newState);
  });
});

describe("getReducer tests", () => {
  let reducer;
  beforeEach(() => {
    reducer = factory.getReducer(reducerConfig.flag);
  });

  it("1. default value test", () => {
    const state = reducer();
    return expect(state).toEqual(false);
  });

  it("2. on test", () => {
    const state = reducer(false, {
      type: types.ON
    });
    return expect(state).toEqual(true);
  });

  it("3. off test", () => {
    const state = reducer(true, {
      type: types.OFF
    });
    return expect(state).toEqual(false);
  });

  it("4. toggle test", () => {
    const state = reducer(false, {
      type: types.TOGGLE
    });
    return expect(state).toEqual(true);
  });
});