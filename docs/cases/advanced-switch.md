# Advanced switch reducer

Reducer factory is used here to define a reducer named `stats` that operates on an object. The object has multiple properties one of which is a nested property  `flags.completed`. The generated reducer is capable of doing the following

- Turning on `stats.flags.completed`
- Turning off `stats.flags.completed`

## Code

```JavaScript
import ReducerFactory, { ops } from "@kubric/reducer-factory";
import { combineReducers, createStore } from "redux";

const factory = new ReducerFactory();

/**
 * Returns an object
 * {
 *   stats: () => {
 *     //statsReducerFunction
 *   }
 * }
 */
const reducers = factory.getReducers({
  reducers: {
    stats: {
      //Default state
      defaultState: {
        progress: 1.5,
        done: 3,
        flags: {
          completed: false
        }
      },
      ops: [
        //Switch off flags.completed
        {
          types: ["FAILED"],
          op: {
            type: ops.OFF,
            to: "flags.completed"
          }
        },

        //Switch on flags.completed
        {
          types: ["COMPLETED"],
          op: {
            type: ops.ON,
            to: "flags.completed"
          }
        },
      ]
    }
  }
});

// Create a store with the default state configured for stats
const store = createStore(combineReducers(reducers));
// State:
// {
//   progress: 1.5,
//   done: 3,
//   flags: {
//     completed: false
//   }
// }

store.dispatch({
  type: "COMPLETED"
});
// State:
// {
//   progress: 1.5,
//   done: 3,
//   flags: {
//     completed: true
//   }
// }

store.dispatch({
  type: "FAILED"
});
// State:
// {
//   progress: 1.5,
//   done: 3,
//   flags: {
//     completed: false
//   }
// }
```
