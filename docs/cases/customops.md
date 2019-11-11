# Custom `ops`

If your store has operations that are being performed frequently by a lot of reducers, a custom op can be registered with the reducer factory

## Code

The below example defines a JSON_STRING_ASSIGN `op` that converts incoming action payload to a JSON string before assigning it

```JavaScript
import ReducerFactory from "@kubric/reducer-factory";
import _ from 'lodash';
import { createStore } from 'redux';

const factory = new ReducerFactory({
  ops: {
    //Returns the stringified version of the state always
    JSON_STRING_ASSIGN: (state, {
      op, //Name of the op - JSON_STRING_ASSIGN
      basePath = '', //payloadPath defined with the reducer factory. In this case it will be "payload"
      ...rest //all other properties that are defined in the reducer definition
    } = {}, dispatchedAction) => {
      const { defaultValue, transform } = rest;
      const payload = _.get(dispatchedAction, basePath, defaultValue);
      const transformed = _.isFunction(transform) ? transform(payload) : payload;
      return JSON.stringify(transformed);
    }
  },
  payloadPath: "payload"
});

const reducer = factory.getReducer({
  defaultState: "[]",
  types: "FETCHED",
  op: "JSON_STRING_ASSIGN",
  defaultValue: {}
});

const store = createStore(reducer);
// State: "[]"

store.dispatch({
  type: "FETCHED"
});
//Taken from default value
// State: "{}"

store.dispatch({
  type: "FETCHED",
  payload: {
    map1: "test",
    map2: "blast"
  }
});
//Taken from default value
// State: '{ map1: "test", map2: "blast" }'
```
