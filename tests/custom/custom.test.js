import { createStore, combineReducers } from "redux";
import ReducerFactory, { macros, ops } from "../../index";
import { toArray } from "../../utils";

const factory = new ReducerFactory({
  ops: {
    //Rewriting the ASSIGN op
    //Returns the stringified version of the state always
    [ops.ASSIGN]: state => {
      return JSON.stringify(state)
    }
  },
  macros: {
    //Rewriting the SWITCH macro
    //on actions will off the switch
    //off actions with off the switch
    //toggle actions will off the switch
    "WEIRD_SWITCH": ({ defaultState = false, to = '', on = [], off = [], toggle = [], ops: extraOps = [] }) => {
      const result = {
        defaultState,
        ops: [{
          type: ops.OFF,
          to,
          types: toArray(on)
        }, {
          type: ops.ON,
          to,
          types: toArray(off)
        }, {
          type: ops.OFF,
          to,
          types: toArray(toggle)
        }]
      };
      result.ops = [
        ...result.ops.filter(({ types = [] }) => types.length > 0),
        ...extraOps
      ];
      return result;
    }
  },
  payloadPath: "payload"
});

const reducer = combineReducers(factory.getReducers({
  case: {
    defaultState: {
      test: 1
    },
    types: "ASSIGN",
  },
  flag: {
    defaultState: {
      flag: true
    },
    macro: "WEIRD_SWITCH",
    on: "ON",
    off: "OFF",
    toggle: "TOGGLE",
    to: 'flag'
  }

}));

describe("custom ops/macros test", () => {
  let store;
  beforeEach(() => {
    store = createStore(reducer);
  });

  it("should return default state", () => {
    return expect(store.getState()).toEqual({
      case: {
        test: 1
      },
      flag: {
        flag: true
      }
    });
  });

  it("should go to custom ASSIGN", () => {
    store.dispatch({
      type: "ASSIGN",
      payload: {
        blast: 1
      }
    });
    return expect(store.getState()).toEqual({
      case: '{"test":1}',
      flag: {
        flag: true
      }
    });
  });

  it("should go to custom SWITCH macro ON", () => {
    store.dispatch({
      type: "ON",
    });
    return expect(store.getState()).toEqual({
      case: {
        test: 1,
      },
      flag: {
        flag: false
      }
    });
  });

  it("should go to custom SWITCH macro OFF", () => {
    store.dispatch({
      type: "OFF",
    });
    return expect(store.getState()).toEqual({
      case: {
        test: 1,
      },
      flag: {
        flag: true
      }
    });
  });

  it("should go to custom SWITCH macro TOGGLE", () => {
    store.dispatch({
      type: "TOGGLE",
    });
    return expect(store.getState()).toEqual({
      case: {
        test: 1,
      },
      flag: {
        flag: false
      }
    });
  });
});