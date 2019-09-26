# Macros

Macros provide a way to abstract frequently used state operations involving multiple types into a compact, reusable config. There are some library supported macros and further [custom macros](custommacros) can be written to suit the needs of the developer.

## `macros.SWITCH`

More often than not, there is a case where 2 types will have to be defined, one for turning on a boolean and one for turning it off. At times, there can also be cases where there will be a type for toggle. The reducer factory definition for this case can be seen [here](basic-switch). The set of operations defined there can be defined as a switch macro as shown below

```JavaScript
import ReducerFactory, { macros } from "@bit/kubric.redux.reducers.factory";

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
      //type of the macro
      macro: macros.SWITCH,

      //types that turn on the boolean
      on: ["LOADING_ON", "CREATION_INITIATED"],

      //types that turn off the boolean
      off: ["LOADING_OFF", "CREATION_FAILED", "CREATION_COMPLETED"],

      //types that toggle the boolean
      toggle: "TOGGLE_LOADING"

      //delegation reducer
      //reducer: extraReducer

      //extra ops that the loading reducer has to handle
      //ops: []

      //defaultState of the reducer. Defaults to false
      //defaultState: { {response: { flag: true } }

      //path to the switch in the state
      //to: "response.flag"
    }
  }
});
```

## `macros.COUNTER`

```JavaScript
import ReducerFactory, { macros } from "@bit/kubric.redux.reducers.factory";

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
    counter: {
      //type of the macro
      macro: macros.COUNTER,

      //default state
      defaultState: 1,

      //Types that increment the counter
      next: "NEXT",

      //Types that decrement the counter
      previous: ["PREVIOUS", "BACK"],

      //Reset the counter to the value specified by "min"
      first: "FIRST",

      //Reset the counter to the value specified by "max"
      last: "LAST",

      //Minimum allowed value of the of the counter. String or function
      min: -2,

      //Maximum allowed value of the of the counter. String or function
      max(currentState) {
        return 34;
      }

      //Defines by how much the count should increment/decrement. Default 1
      //step: 2

      //delegation reducer
      //reducer: extraReducer

      //extra ops that the loading reducer has to handle
      //ops: []

      //defaultState of the reducer. Defaults to false
      //defaultState: { {response: { count: true } }

      //path to the switch in the state
      //to: "response.count"
    }
  }
});
```
