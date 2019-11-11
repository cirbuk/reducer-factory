# Custom `macros`

Custom macros definitions can be provided to the reducer factory to create new types of macros. The custom macro should define a expander function, that takes in the macro definition and returns a reducer definition.

## Code

The below example defines a macro WEIRD_SWITCH that does the following

* on actions will off the switch
* off actions with off the switch
* toggle actions will off the switch

```JavaScript
import ReducerFactory, { ops } from "@kubric/reducer-factory";
import { createStore } from 'redux';

const factory = new ReducerFactory({
  macros: {
    "WEIRD_SWITCH": ({ defaultState = false, to = '', on = [], off = [], toggle = [] }) => ({
      defaultState,
      ops: [{
        type: ops.OFF,
        to,
        types: on
      }, {
        type: ops.ON,
        to,
        types: off
      }, {
        type: ops.OFF,
        to,
        types: toggle
      }]
    })
  },
  payloadPath: "payload"
});

const reducer = factory.getReducer({
  defaultState: {
    flag: true
  },
  macro: "WEIRD_SWITCH",
  on: ["ON"],
  off: ["OFF"],
  toggle: ["TOGGLE"],
  to: 'flag'
});

const store = createStore(reducer);
// State: "{ flag: true }"

store.dispatch({
  type: "ON"
});
//Taken from default value
// State: "{ flag: false }"

store.dispatch({
  type: "OFF"
});
//Taken from default value
// State: "{ flag: true }"

store.dispatch({
  type: "TOGGLE"
});
//Taken from default value
// State: "{ flag: false }"
```
