# Default values

`defaultValue` can be defined at the reducer level and the op level. If the action payload results in an `undefined` value for the state of that reducer, the `defaultValue` will be picked up if defined. For any incoming action to the reducer, if its payload extraction results in `undefined`, the rules of `defaultValue` are as follows

- If there is a `defaultValue` defined for the op for which the action is targeted, then that `defaultValue` is taken
- If there is a `defaultValue` defined for the reducer(outside the `ops` array), and there is no op level `defaultValue` for the op that corresponds to the incoming action, then the reducer level `defaultValue`is taken
- If there is neither a reducer level `defaultValue` nor an op level `defaultValue` defined for the incoming action, then the extracted payload is applied as such to the state

> If `transform` function has been defined, the `defaultValue` will be passed through the `transform` function before applying to the state

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
 *   val: () => {
 *     //valReducerFunction
 *   }
 * }
 */
const reducers = reducerFactory({
  reducers: {
    val: {
      defaultState: "defaultState",
      defaultValue: "global_default_value",
      ops: [
        //assign global defaultValue to [state].val
        {
          types: [
            "GLOBAL_DEFAULTVALUE"
          ],
          op: ops.ASSIGN
        },
        //assign local defaultValue to [state].val
        {
          defaultValue: "local_default_value",
          types: [
            "LOCAL_DEFAULTVALUE"
          ],
          op: ops.ASSIGN
        },
        //assign local transformed defaultValue to [state].val
        {
          types: [
            "LOCAL_TRANSFORMED_DEFAULTVALUE"
          ],
          op: ops.ASSIGN,
          defaultValue: "local_default_value",
          transform: val => `transformed_${val}`
        },
      ]
    },
  }
});

// Create a store with the default state configured for val
const store = createStore(combineReducers(reducers));
// State:
// {
//   val: "defaultState"
// }

store.dispatch({
  type: types.GLOBAL_DEFAULTVALUE
});
// State:
// {
//   val: "global_default_value"
// }

store.dispatch({
  type: types.LOCAL_DEFAULTVALUE
});
// State:
// {
//   val: "local_default_value"
// }

store.dispatch({
  type: types.LOCAL_TRANSFORMED_DEFAULTVALUE
});
// State:
// {
//   val: "transformed_local_default_value"
// }
```
