# from,to cases

`from` and `to` can be used in a bunch of different ways as listed [here](../../README.md#from-to).

## Code

```JavaScript
import ReducerFactory, { ops } from "@bit/kubric.redux.reducers.factory";
import { combineReducers, createStore } from "redux";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

/**
 * Returns an object
 * {
 *   fromto: () => {
 *     //fromtoReducerFunction
 *   }
 * }
 */
const reducers = reducerFactory({
  reducers: {
    fromto: {
      defaultState: {},
      ops: [
        //assign entire payload to state
        {
          types: [
            "FULL_PAYLOAD"
          ],
          op: ops.ASSIGN
        },
        //assign from a path in payload to state
        {
          types: [
            "ASSIGN_FROM"
          ],
          from: "response.data",
          op: ops.ASSIGN
        },
        //assign from a path in payload to a path in state
        {
          types: [
            "ASSIGN_FROM_TO"
          ],
          op: ops.ASSIGN,
          from: "response",
          to: "response.append"
        },
        //insert from a path in payload to a path in state after resolving "to"
        {
          types: [
            "INSERT_FROM_TO_RESOLVE"
          ],
          op: ops.INSERT,
          from: "response",
          to: "response.append.{{index}}"
        },
        //assign payload to multiple paths in state
        {
          types: [
            "ASSIGN_TOMULTIPLE"
          ],
          op: ops.ASSIGN,
          to: ["path1", "response.append", "newPath"]
        },
        //assign from a path in payload to multiple paths in state after resolving "to"
        {
          types: [
            "ASSIGN_FROM_TOTOMULTIPLE"
          ],
          op: ops.ASSIGN,
          from: "response",
          to: ["path1", "response.append.{{index}}", "newPath"]
        },
        //assign from multiple paths in payload to multiple paths in state after resolving "to"
        {
          types: [
            "ASSIGN_FROMMULTIPLE_TOMULTIPLE"
          ],
          op: ops.ASSIGN,
          from: ["response1", "response2.data", "response3"],
          to: ["path1", "response.append.{{index}}", "newPath"]
        },
      ]
    },
  }
});

// Create a store with the default state configured for val
const store = createStore(combineReducers(reducers));
// State:
// {
//   fromto: {}
// }

store.dispatch({
  type: types.FULL_PAYLOAD,
  payload: {
    string: "123"
  }
});
// State:
// {
//   fromto: {
//     string: "123"
//   }
// }

store.dispatch({
  type: types.ASSIGN_FROM,
  payload: {
    response: {
      data: {
        string: "456",
        response: {}
      }
    }
  }
});
// {
//   fromto: {
//     string: "456",
//     response: {}
//   }
// }

store.dispatch({
  type: types.ASSIGN_FROM_TO,
  payload: {
    response: [1, 2, 3]
  }
});
// {
//   fromto: {
//     string: "456",
//     response: {
//       append: [1, 2, 3]
//     }
//   }
// }

store.dispatch({
  type: types.INSERT_FROM_TO_RESOLVE,
  payload: {
    response: [4, 5, 6],
    index: 4
  }
});
// {
//   fromto: {
//     string: "456",
//     response: {
//       append: [1, 2, 3, undefined, 4, 5, 6]
//     }
//   }
// }

store.dispatch({
  type: types.APPEND_TOMULTIPLE,
  payload: 7,
});
// {
//   fromto: {
//     path1: 7,
//     newPath: 7,
//     string: "456",
//     response: {
//       append: [1, 2, 3, undefined, 4, 5, 6, 7]
//     }
//   }
// }

store.dispatch({
  type: types.APPEND_FROM_TOTOMULTIPLE,
  payload: {
    response: 8,
    index: 3
  },
});
// {
//   fromto: {
//     path1: 8,
//     newPath: 8,
//     string: "456",
//     response: {
//       append: [1, 2, 3, 8, 4, 5, 6, 7]
//     }
//   }
// }

store.dispatch({
  type: types.ASSIGN_FROMMULTIPLE_TOMULTIPLE,
  payload: {
    response1: "First response",
    response2: {
      data: "Second response"
    },
    response3: "Third response",
    index: 8
  },
});
// {
//   fromto: {
//     path1: "First response",
//     newPath: "Thrid response",
//     string: "456",
//     response: {
//       append: [1, 2, 3, 8, 4, 5, 6, 7, "Second response"]
//     }
//   }
// }
```
