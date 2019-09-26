# Insert reducers

Reducer factory is used here to define a reducer named `rows` that operates on an object. The generated reducer is capable of doing the following

- Appending the action's array `payload` at a specified path in the state
- Prepending the action's array `payload` at a specified path in the state
- Inserting the elements from the action's array `payload` at a specified path and specified index in the state
- Appending the action's string `payload` with a string in the state
- Prepending the action's string `payload` with a string in the state
- Inserting the action's string `payload` with a string in the state at a specified index
- Merging the action's object `payload` with the state

> - `ops.APPEND`, `ops.PREPEND` and `ops.INSERT` requires that the payload being appended is a string, array or an object and that the destination to which it is being appended is also a string, array or an object respectively. If this condition is not met, the reducer will throw an error `Unsupported data types provided to patchByType`
> - In case of objects, all the 3 operations produce the same effect i.e. merging the source from the action with the target object.

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
 *   rows: () => {
 *     //rowsReducerFunction
 *   }
 * }
 */
const reducers = reducerFactory({
  reducers: {
    rows: {
      //Default state
      defaultState: {
        string: "string1",
        array: [{
          string1: "string1"
        }],
        object: {
          string1: "string1"
        }
      },
      ops: [
        //Append the array payload from payload.results with state.array
        {
          types: ["APPEND_ARRAY"],
          op: {
            type: ops.APPEND,
            from: 'results',
            to: 'array'
          }
        },

        //Prepend the array payload from payload.results with state.array
        {
          types: ["PREPEND_ARRAY"],
          op: {
            type: ops.PREPEND,
            from: 'results',
            to: 'array'
          }
        },

        //Merge the array payload from payload.results at state.array.2
        {
          types: ["INSERT_ARRAY"],
          op: {
            type: ops.INSERT,
            from: 'results',
            to: 'array',
            at: 2
          }
        },

        //Shallow merge the object payload with state.object
        {
          types: ["APPEND_OBJECT"],
          op: {
            type: ops.APPEND,
            to: 'object'
          }
        },

        //Suffix the string payload with state.string
        {
          types: ["APPEND_STRING"],
          op: {
            type: ops.APPEND,
            to: 'string'
          }
        },

        //Prefix the string payload with state.string
        {
          types: ["PREPEND_STRING"],
          op: {
            type: ops.PREPEND,
            to: 'string'
          }
        },

        //Insert the string at state.string.3
        {
          types: ["INSERT_STRING"],
          op: {
            type: ops.INSERT,
            to: 'string',
            at: 3
          }
        },

        //Insert array at state.string.[at]. "at" will be resolved against action.payload
        {
          types: ["INSERT_ARRAY_AT"],
          op: {
            type: ops.INSERT,
            to: "array",
            from: "list"
            at: "{{index}}"
          }
        },
      ]
    }
  }
});

// Create a store with the default state configured for campaign
const store = createStore(combineReducers(reducers));
// State:
// {
//   string: "string1",
//   array: [{
//     string1: "string1"
//   }],
//   object: {
//     string1: "string1"
//   }
// }

store.dispatch({
  type: "APPEND_ARRAY",
  payload: {
    results: [{
      append2: "append2"
    }, {
      append3: "append3"
    }]
  }
});
// State:
// {
//   string: "string1",
//   array: [{
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1"
//   }
// }

store.dispatch({
  type: "PREPEND_ARRAY",
  payload: {
    results: [{
      prepend2: "prepend2"
    }, {
      prepend3: "prepend3"
    }]
  }
});
// State:
// {
//   string: "string1",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1"
//   }
// }

// Merging an array with the array
store.dispatch({
  type: "INSERT_ARRAY",
  payload: {
    results: [{
      insert1: "insert1"
    }, {
      insert2: "insert2"
    }]
  }
});
// State:
// {
//   string: "string1",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1"
//   }
// }

// Inserting an object into the array
store.dispatch({
  type: "INSERT_ARRAY",
  payload: {
    results: {
      insert4: "insert4"
    }
  }
});
// State:
// {
//   string: "string1",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1"
//   }
// }

store.dispatch({
  type: "APPEND_OBJECT",
  payload: {
    string2: "string2",
    string3: "string3"
  }
});
// State:
// {
//   string: "string1",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }

store.dispatch({
  type: "APPEND_STRING",
  payload: "string2"
});
// State:
// {
//   string: "string1string2",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }

store.dispatch({
  type: "PREPEND_STRING",
  payload: "string3"
});
// State:
// {
//   string: "string3string1string2",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }

store.dispatch({
  type: "INSERT_STRING",
  payload: "insert"
});
// State:
// {
//   string: "strinserting1string2",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }

//Insert payload.list at state.array[5]
store.dispatch({
  type: "INSERT_ARRAY_AT",
  payload: {
    list: [{
      row: 10
    }],
    index: 5
  }
});
// State:
// {
//   string: "strinserting1string2",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     row: 10
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }

// Merge payload.list at state.array[11]. As the index is > array
// length of 9, indices 9 and 10 will be filled with undefined before 
// merging payload.list at 11
store.dispatch({
  type: "INSERT_ARRAY_AT",
  payload: {
    list: [{
      row: 12
    }],
    index: 11
  }
});
// State:
// {
//   string: "strinserting1string2",
//   array: [{
//     prepend2: "prepend2"
//   }, {
//     prepend3: "prepend3"
//   }, {
//     insert4: "insert4"
//   }, {
//     insert1: "insert1"
//   }, {
//     insert2: "insert2"
//   }, {
//     row: 10
//   }, {
//     string1: "string1"
//   }, {
//     append2: "append2"
//   }, {
//     append3: "append3"
//   },
//   undefined,
//   undefined, {
//     row: 12
//   }],
//   object: {
//     string1: "string1",
//     string2: "string2",
//     string3: "string3"
//   }
// }
```
