# Shorthands

There are a number of shorthands that can be used to write concise reducer definitions

## `reducers` shorthands

1. The default `op` is `ops.ASSIGN`. So whereever `ops.ASSIGN` is used, it can be omitted
2. If an op has only one single type in its `types` array, `types` need not be an array, it can be directly assigned with the type
3. If a reducer has only one op in its `ops` array, the array can be avoided altogether. The contents of the op in the array can be written outside `ops` and `ops` can be removed altogether
4. If the reducer definition does not have an `actions` config, it can be written directly instead of putting it inside the `reducers` object

### Code

```JavaScript
{
  reducers: {
    name: {
      defaultState: [],
      ops: [{
        types: ["ASSIGN"],
        op: ops.ASSIGN
      }]
    }
  }
}
```

can be reduced to

```JavaScript
{
  name: {
    defaultState: [],
    types: "ASSIGN"
  }
}
```

## `actions` shorthands

1. If `types.{{typeName}}.reducers.{{reducerName}}` only has `from` to define, it can be written directly as a string
2. If `reducers.{{reducerName}}` only a single `op` and that `op` is defined in `types`, then inside `reducers.{{reducerName}}`, the `defaultState` can be provided directly in `reducers.{{reducerName}}` instead of `reducers.{{reducerName}}.defaultState`

### Code

```JavaScript
{
  reducers: {
    name: {
      defaultState: [],
      ops: [{
        types: ["ASSIGN"],
        op: ops.ASSIGN
      }]
    },
    format: {
      defaultState: [],
    },
    type: {
      defaultState: {},
    }
  },
  actions: {
    FETCHED: {
      op: ops.ASSIGN,
      reducers: {
        name: {
          from: "response.name"
        },
        type: {
          from: "response.type"
        },
        format: {
          from: "response.format"
        }
      }
    }
  }
}
```

can be reduced to

```JavaScript
{
  reducers: {
    name: {
      defaultState: [],
      types: "ASSIGN"
    },
    format: [],
    type: {
      //If the default state is an object, it should still be defined under defaultState
      defaultState: {},
    }
  },
  actions: {
    FETCHED: {
      reducers: {
        name: "response.name",
        type: "response.type",
        format: "response.format"
      }
    }
  }
}```
