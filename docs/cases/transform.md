# Transform

Functions can be defined at the reducer level and the op level to transform the extracted payload before it is applied to the state. For any incoming action to the reducer, the rules of transformation are as follows

- If there is a `transform` defined for the op for which the action is targeted, then that transform is applied to the extracted payload before its applied to the state
- If there is a `transform` defined for the reducer(outside the `ops` array), and there is no op level `transform` for the op that corresponds to the incoming action, then the reducer lever `transform` is applied to the extracted payload before its applied to the state
- If there is neither a reducer level `transform` nor an op level `transform` defined for the incoming action, then the extracted payload is applied as such to the state

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
 *   transform: () => {
 *     //transformReducerFunction
 *   }
 * }
 */
const reducers = reducerFactory({
  reducers: {
    transform: {
      defaultState: {},
      transform: val => `global_transform_${val}`,
      ops: [
        //assign global transformed value to [state].transform
        {
          types: [
            "ASSIGN_GLOBAL_TRANSFORM"
          ],
          op: ops.ASSIGN,
          to: 'gt',
        },
        //assign local transformed value to [state].transform
        {
          types: [
            "ASSIGN_LOCAL_TRANSFORM"
          ],
          op: ops.ASSIGN,
          to: 'lt1',
          transform: val => `local_transform1_${val}`
        },
        //assign local transformed value to [state].transform
        {
          types: [
            "ASSIGN_LOCAL_TRANSFORM"
          ],
          op: ops.ASSIGN,
          to: 'lt2',
          transform: val => `local_transform2_${val}`
        },
      ]
    },
  }
});

// Create a store with the default state configured
const store = createStore(combineReducers(reducers));
// State:
// {
//   transform: {}
// }

store.dispatch({
  type: types.ASSIGN_GLOBAL_TRANSFORM,
  payload: "payload"
});
// State:
// {
//   transform: {
//     gt: "global_transform_payload"
//   }
// }

store.dispatch({
  type: types.ASSIGN_LOCAL_TRANSFORM,
  payload: "payload"
});
// State:
// {
//   transform: {
//     gt: "global_transform_payload"
//     lt1: "local_transform1_payload",
//     lt2: "local_transform2_payload"
//   }
// }
```
