# Reducer delegation

The reducer factory will not be able to deal with all dispatched actions. There might be complex state operations that need to be performed. For such cases, the incoming action can be delegated to an external reducer function using the `reducer` property

> If the reducer property is an array of functions, they will be composed together and the resultant function will be used as value for the `reducer` property

## Code

```JavaScript
const nameReducer = (state = '', action) => {
    //complex actions can be dealt with here
};

//The action "ASSIGN" will be dealt with by the factory. All other actions will be delegated to nameReducer
const reducerDefinition = {
  reducers: {
    name: {
      defaultState: [],
      reducer: nameReducer,
      ops: [{
        types: ["ASSIGN"],
        op: ops.ASSIGN
      }]
    }
  }
}
```
