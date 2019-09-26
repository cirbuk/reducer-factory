# `actions` config

There could be cases when the same action is supposed to trigger the same op in multiple reducers. In this case, the writing the same op in all the reducers can be cumbersome. In these situations, `actions` config can come in handy.

> `actions` config is just another way of organizing the reducer config. There is no particular advantage of using it, other than that when used along with [shorthands](shorthands.md), some code reduction might be achieved

## Code

There are 5 reducers - `name`, `format`, `type`, `array1` and `array2`. Each of these reducers respond to 2 action types

* `FETCHED` that changes values in every reducer
* `NAME_CHANGED`, `FORMAT_CHANGED`, `TYPE_CHANGED`, `INSERT_ARRAY1` and `INSERT_ARRAY1` that change the state of reducers `name`, `format`, `type`, `array1` and `array2` respectively.

The `reducers` definition for the above will be

```JavaScript
{
  reducers: {
    name: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "name",
        types: ["NAME_CHANGED"],
      }, {
        op: ops.ASSIGN,
        from: "name",
        types: ["FETCHED"],
      }]
    },
    type: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "typePayload",
        types: ["TYPE_CHANGED"],
      }, {
        op: ops.ASSIGN,
        from: "typePayload",
        types: ["FETCHED"],
      }]
    },
    format: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "format",
        types: ["FORMAT_CHANGED"],
      }, {
        op: ops.ASSIGN,
        from: "format",
        types: ["FETCHED"],
      }]
    },
    array1: {
      defaultState: [1, 2, 3, 4, 5],
      ops: [{
        op: ops.APPEND,
        from: "array1",
        types: ["INSERT_ARRAY1"]
      }, {
        op: ops.INSERT,
        from: "array1",
        at: 3,
        types: ["FETCHED"]
      }]
    },
    array2: {
      defaultState: [6, 7, 8, 9, 0],
      ops: [{
        op: ops.APPEND,
        from: "array2",
        types: ["INSERT_ARRAY2"]
      }, {
        op: ops.INSERT,
        from: "array2",
        at: 2,
        types: ["FETCHED"]
      }]
    },
  }
}
```

`actions` can be used to make the above definition more intuitive and to group together all reducer configs for `FETCHED` action

```Javascript
{
  reducers: {
    name: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "name",
        types: ["NAME_CHANGED"],
      }]
    },
    type: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "typePayload",
        types: ["TYPE_CHANGED"],
      }]
    },
    format: {
      defaultState: "",
      ops: [{
        op: ops.ASSIGN,
        from: "format",
        types: ["FORMAT_CHANGED"],
      }]
    },
    array1: {
      defaultState: [1, 2, 3, 4, 5],
      ops: [{
        op: ops.APPEND,
        from: "array1",
        types: ["INSERT_ARRAY1"]
      }]
    },
    array2: {
      defaultState: [6, 7, 8, 9, 0],
      ops: [{
        op: ops.APPEND,
        from: "array2",
        types: ["INSERT_ARRAY2"]
      }]
    }
  },
  actions: {
    FETCHED: [{
      op: ops.ASSIGN,
      reducers: {
        name: {
          from: "name"
        },
        type: {
          from: "typePayload"
        },
        format: {
          from: "format"
        }
      }
    }, {
      op: ops.INSERT,
      reducers: {
        array1: {
          from: "array1",
          at: 3
        },
        array2: {
          from: "array2",
          at: 2
        },
      }
    }]
  }
}
```
