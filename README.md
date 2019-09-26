# Reducer factory

Bulk of the state operations performed redux reducers involve

- Extracting values from payload and assigning it to state
- Appending/prepending/inserting into the state objects/arrays/strings from action payload
- Turning on, turning off or toggling boolean values

Reducer factory enables developers to configure all these operations via JSON and so that code needs to be written only for complex state operations.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#Examples)
- [ReducerFactory class](#reducerfactory-class)
  - [getReducers()](#getReducers())
  - [getReducer()](#getReducer())
- [Reducer definition](#reducer-definition)
  - [ops](#ops)
  - [from,to](#from-to)
  - [at](#at)
  - [transform](#transform)
  - [defaultValue](#defaultValue)

## Installation

```yarn
yarn add @bit/kubric.redux.reducers.factory
```

or

```npm
npm i @bit/kubric.redux.reducers.factory
```

## Usage

```JavaScript
import ReducerFactory from "@bit/kubric.redux.reducers.factory";
import { combineReducers } from "redux";

const factory = new ReducerFactory();

const reducersConfig = {
  //config for reducer1
  reducer1: { ... },
  //config for reducer2
  reducer2: { ... }
};

/**
 * Returns the following object
 * {
 *    reducer1: () => {
 *      //reducer for reducer1 config
 *    },
 *    reducer2: () => {
 *      //reducer for reducer2 config
 *    }
 */
const reducersObject = factory.getReducers(reducersConfig);

const reducer = combineReducers(reducersObject);

const singleReducerConfig = { ... };
const singleReducer = factory.getReducer(singleReducerConfig);
```

## Examples

1. [Basic switch reducer](./docs/cases/basic-switch)
2. [Advanced switch reducer](./docs/cases/advanced-switch)
3. [Assign reducer](./docs/cases/assign)
4. [Insert reducers](./docs/cases/insert)
5. [Transforms](./docs/cases/transform)
6. [Default values](./docs/cases/defaultvalue)
7. [Reducer delegation](./docs/cases/delegation)
8. [`from`,`to` cases](./docs/cases/fromto)
9. [`actions` config](./docs/cases/actions)
10. [Shorthands](./docs/cases/shorthands)
11. [Macros](./docs/cases/macros)
12. [Custom macros](./docs/cases/custommacros)
13. [Custom ops](./docs/cases/customops)

## ReducerFactory class

```JavaScript
import ReducerFactory from "@bit/kubric.redux.reducers.factory";

const factory = new ReducerFactory(options);
```

`options` can be a JSON with the following properties

- `ops`: Handlers for custom ops
- `macros`: Handlers for custom macros
- `payloadPath`: Defines the base path w.r.t the dispatched action object from where `from` property for ops will be resolved.

### getReducers()

The factory instance's `getReducers` method takes in a JSON object in the format given below as its argument and returns an object that can be passed directly to `combineReducers` to get the final reducer

```JavaScript
/**
 * Returns an object that can be passed directly to redux combineReducers function
 */
const reducers = reducerFactory({
  reducers: {
      //Used when multiple actions are supposed to make changes to the same piece of state
  },
  types: {
      //Used when a single action should trigger the same operation in multiple reducers
  }
});
```

### getReducer()

The factory instance's `getReducer` method takes in a JSON config for a single reducer and returns the reducer function for that config

## Reducer definition

The definition for a reducer is provided as a JSON in the following with the following properties

Property | Description | Remarks
---------|----------|---------
 `defaultState` | Default state to be assigned to the reducer when the store is initialized for the first time | Required
 `ops` | If the reducer needs to handle more than one operation responding to multiple action types, then `ops` array should be defined. Refer [ops](#ops). | Optional<br><br> If `op` and `ops` are both defined, `ops` take precedence and `op` is ignored.
 `transform` | Function used to transform the extracted value from the payload before it is applied to the state. Refer [transform](#transform). | Optional.<br><br>If there is an op specific `transform` defined, then that function will take precedence.
 `defaultValue` | If provided, this value will get applied to the state in case the value extracted from the payload happens to be `undefined`. Refer [defaultValue](#defaultValue). | Optional<br><br>If there is an op specific `defaultValue` defined, then that value will take precedence.
 `reducer` | Reducer function or array of reducer functions to which the incoming action is delegated if it's type does not match any registered in `types` | Optional<br><br>If an array of reducers is provided, it is [composed](https://redux.js.org/api/compose) together into one reducer function.

### ops

State operations supported by the library are defined in the `ops` object exported by the library.

```JavaScript
import { ops } from "@bit/kubric.redux.reducers.factory"
```

Operation | Description | Remarks
---------|----------|---------
 `ops.ASSIGN` | Extracts a value from `action.payload` and assigns it to the state | This is the default op if no op has been defined explicitly in the config
 `ops.APPEND` | Extracts a value from `action.payload` and appends it to the state | The extracted value should be either string, array or object and the target to where it is to be appended should also be a string, array or object respectively.
 `ops.PREPEND` | Extracts a value from `action.payload` and prepends it to the state | The extracted value should be either string or array and the target to where it is to be prepended should also be a string or array. If this operation is performed with objects, the effect will be same as `ops.APPEND`.
 `ops.INSERT` | Extracts a value from `action.payload` and inserts it at a specific index in the state | The extracted value should be either string or array and the target to where it is to be inserted should also be a string or array. If this operation is performed with objects, the effect will be same as `ops.APPEND`.
 `ops.ON` | Sets a value to `true` | Irrespective of what the current value of the target is, it will be set to `true`
 `ops.OFF` | Sets a value to `false` | Irrespective of what the current value of the target is, it will be set to `false`
 `ops.TOGGLE` | Toggles a value | All the [6 falsy values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) in JS will be toggled to boolean `true`. All other values will be toggled to boolean `false`

A reducer can be configured to perform any number of state operations via its `ops` array. Every entry of the `ops` array is an object that defines a mapping between actions that are dispatched to the state and the operation that should be performed for that action. An entry of the array can have the following properties

 Property | Description | Remarks
 ---------|----------|---------
 `types` | String or an array of string denoting the action types for which the reducer should perform the configured `op` | Required
 `op` | Denotes the operation that should be performed by the reducer. Should be a constant from the `ops` object exported by the library. | Optional <br>Defaults to `ops.ASSIGN`<br><br>Should be a valid constant from the `ops` object exported by the library.
 `from` | String or array of strings denoting the JSON path(s) of the value(s) that needs to be extracted from the action payload.  Refer [from,to](#from-to).|Optional<br><br>The paths provided should be relative to `action.payload`.
 `to` | String or array of strings denoting the JSON path(s) relative to the state of the reducer where the value(s) extracted as per `from` should be assigned to. Refer [from,to](#from-to). | Optional<br><br>The paths provided should be relative to the reducers state
 `at` | Denotes the index at which the extracted value should be inserted. Refer [at](#at). | Optional<br><br>Valid only for `ops.INSERT`
 `transform` | Function used to transform the extracted value from the payload before it is applied to the state. Refer [transform](#transform). | Optional
 `defaultValue` | If provided, this value will get applied to the state in case the value extracted from the payload happens to be `undefined`. Refer [defaultValue](#defaultValue). | Optional

Eg.

```JavaScript
{
  reducers: {
    //Defines a reducer named loaded
    loaded: {

      //with default state 0
      defaultState: 0,

      //Defines array of operations that need to be performed
      ops: [

        //If the incoming action type is 'LOADING', the state of the reducer is made false
        {
          types: ['LOADING'],
          op: types.OFF
        },

        //If the incoming action is 'LOADED', "action.payload" is assigned to the state
        {
          types: ['LOADED'],
          op: types.ASSIGN
        }
      ]
    }
  }
}
```

### from, to

The combination of `from`, `transform`, `op` and `to` determines what is extracted from `action.payload`, what transformation is applied to it, how it is applied to the state of the reducer and where in the state it gets applied. The value is extracted from `action.payload` as defined by `from`, will go through the `transform` function if defined and will then be applied to the state as defined by the `op` and the `to` parameter. The different combinations of `from` and `to` are listed below

`from` | `to` | Results
---------|----------|---------
 `undefined` | `undefined` | `action.payload` is applied to `state`
 `undefined` | JSON path | `action.payload` is applied to `state.to.path`
 `undefined` | Array of JSON paths | `action.payload` is applied to `state.to[1...n]` where n is the length of the `to` array
 JSON path | `undefined` | `action.payload.from.json.path` is applied to `state`
 JSON path | JSON path | `action.payload.from.json.path` is applied to `state.to.json.path`
 JSON path | Array of JSON paths | `action.payload.from.json.path` is applied to `state.to[1...n]` where n is the length of the `to` array
 Array of JSON paths | `undefined` | **Invalid**
 Array of JSON paths | JSON path | **Invalid**
 Array of _n_ JSON paths | Array of _m_(_m_ != _n_) JSON paths | **Invalid**
 Array of _n_ JSON paths | Array of _n_ JSON paths | `action.payload.from.json.path[1...n]` is applied to `state.to[1...n]` where n is the length of the `to` array

 > `from` will not be taken into consideration for any of the boolean ops - `ops.OFF`, `ops.ON` and `ops.TOGGLE`

### at

`at` is used along with `ops.INSERT` to specify the index at which the extracted value from the payload should be inserted.

> If the index provided exceeds the length of the array, the indices from `array.length` to `at - 1` will be filled with `undefined`

### transform

`transform` is a function used to transform the extracted value from the payload before it is applied to the state. The function should return the final value that needs to be applied to the state. The function is invoked with the following arguments

- `extractedValue`: value extracted from the action payload
- `currentState`: state of the reducer before applying the action
- `action`: action that was dispatched to the state

There are 2 types of `transform` functions depending on where they are defined in the config

1. Operation level `transform`: Defined inside an entry of the `ops` array. If the incoming action triggers an `op` entry, it's `tranform` function will be called if defined.
2. Reducer level `transform`: Defined outside the `ops` array. If the `op` triggered for an incoming action does not have a `transform`  defined, then it's reducer level transform function will be invoked if defined.

 > Multiple tranform functions may be called for an incoming action if the action has been registered to perform multiple ops in the same reducer

 Eg.

 ```JavaScript
{
  reducers: {
    //Defines a reducer named loaded
    name: {

      //with default state ""
      defaultState: "",

      //Reducer level transform. Will be called if any of the ops in the ops array matches an incoming action and it does not have a transform defined
      transform: extractedValue => `${extractedValue}_reducer_tranform`,

      //Defines array of operations that need to be performed
      ops: [

        //If the incoming action type is 'LOADING', the state of the reducer is made false
        {
          types: ['WITH_OP_TRANSFORM'],
          op: types.ASSIGN,
          transform: extractedValue => `${extractedValue}_op_tranform`
        },

        //If the incoming action is 'LOADED', "action.payload" is assigned to the state
        {
          types: ['WITH_REDUCER_TRANSFORM'],
          op: types.ASSIGN
        }
      ]
    }
  }
}
```

### defaultValue

If the value that is extracted from `action.payload` happens to be `undefined`, the value provided in `defaultValue` will be applied.

> If there is a `transform` function defined for the reducer and the `defaultValue` gets picked up for some action type, this default value will undergo the transformation before it is applied to the state

There are 2 places where `defaultValue` may be picked up from

1. Operation level `defaultValue`: Defined inside an entry of the `ops` array. If the incoming action triggers an `op` entry, and the extracted value turns out to be `undefined`, then this value is picked as the default value.
2. Reducer level `defaultValue`: Defined outside the `ops` array. If the `op` triggered for an incoming action does not have a `defaultValue`  defined, and the extracted value turns out to be `undefined`, then this value is picked as the default value.
