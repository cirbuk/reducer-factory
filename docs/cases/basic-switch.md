# Basic switch reducer

Reducer factory is used here to define a reducer named `loading` that operates on a single boolean value. The generated reducer is capable of doing the following

- Turning on `loading` flag
- Turning off `loading` flag
- Toggling the `loading` flag

## Code

```JavaScript
import ReducerFactory, { ops } from "@bit/kubric.redux.reducers.factory";
import { combineReducers, createStore } from "redux";

const factory = new ReducerFactory();

/**
 * Returns an object in the following format
 * {
 *   loading: () => {
 *     //loadingReducerFunction
 *   }
 * }
 */
const reducers = factory.getReducers({
  reducers: {
    loading: {
      //Default state
      defaultState: false,
      ops: [
        //Switch on loading
        {
          types: ["LOADING_ON", "CREATION_INITIATED"],
          op: ops.ON
        },

        //Switch off loading
        {
          types: ["LOADING_OFF", "CREATION_FAILED", "CREATION_COMPLETED"],
          op: ops.OFF
        },

        //Toggle loading
        {
          types: ["TOGGLE_LOADING"],
          op: ops.TOGGLE
        }
      ]
    }
  }
});

// Create a store with the default state configured for loading
const store = createStore(combineReducers(reducers));
// State: { loading: false }

store.dispatch({
  type: "LOADING_ON"
});
// State: { loading: true }

store.dispatch({
  type: "LOADING_OFF"
});
// State: { loading: false }

store.dispatch({
  type: "TOGGLE_LOADING"
});
// State: { loading: true }

store.dispatch({
  type: "CREATION_INITIATED"
});
// State: { loading: true }

store.dispatch({
  type: "CREATION_COMPLETED"
});
// State: { loading: false }
```
