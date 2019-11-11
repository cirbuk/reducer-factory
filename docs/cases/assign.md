# Assign reducer

Reducer factory is used here to define a reducer named `campaign` that operates on an object. The generated reducer is capable of doing the following

- Assigning the action's `payload` as the state of `campaign`
- Extract values from the `payload` and assign it to different parts of campaign

## Code

```JavaScript
import ReducerFactory, { ops } from "@kubric/reducer-factory";
import { combineReducers, createStore } from "redux";

const factory = new ReducerFactory({
  //All the "from" paths will be resolved against action.payload
  payloadPath: "payload"
});

/**
 * Returns an object
 * {
 *   campaign: () => {
 *     //campaignReducerFunction
 *   }
 * }
 */
const reducers = factory.getReducers({
  reducers: {
    campaign: {
      //Default state
      defaultState: {
        uid: '',
        adsCount: 0,
        source: {
          templates: [],
          parameters: {}
        }
      },
      ops: [
        //Assign entire payload as state of campaign
        {
          types: ["CAMPAIGN_FETCHED"],
          op: ops.ASSIGN
        },

        //Extract payload.response.campaign and assign it as state
        {
          types: ["SERVICE_RESPONSE"],
          op: {
            type: ops.ASSIGN,

            //refers to payload.response.campaign
            from: 'response.campaign'
          }
        },

        //Extract payload.parameters and assign it to source.parameters
        {
          types: ["UPDATE_PARAMETERS"],
          op: {
            type: ops.ASSIGN,
            from: 'parameters',
            to: 'source.parameters'
          }
        },

        //Extract payload.index and assign it to source.index
        {
          types: ["UPDATE_PARAMETERS"],
          op: {
            type: ops.ASSIGN,
            from: 'index',
            to: 'source.index'
          }
        }
      ]
    }
  }
});

// Create a store with the default state configured for campaign
const store = createStore(combineReducers(reducers));
// State:
// {
//   uid: '',
//   adsCount: 0,
//   source: {
//     templates: [],
//     parameters: {}
//   }
// }

store.dispatch({
  type: "CAMPAIGN_FETCHED",
  payload: {
    uid: '123',
    adsCount: 12,
    source: {
      templates: ["1", "2", "3"],
      parameters: {
        param1: "first parameter"
      }
    }
  }
});
// State:
// {
//   uid: '123',
//   adsCount: 12,
//   source: {
//     templates: ["1", "2", "3"],
//     parameters: {
//       param1: "first parameter"
//     }
//   }
// }

store.dispatch({
  type: "SERVICE_RESPONSE",
  payload: {
    response: {
      campaign: {
        uid: '456',
        adsCount: 16,
        source: {
          templates: ["3", "4", "5"],
          parameters: {
            param2: "second parameter"
          }
        }
      }
    }
  }
});
// State:
// {
//   uid: '456',
//   adsCount: 16,
//   source: {
//     templates: ["3", "4", "5"],
//     parameters: {
//       param2: "second parameter"
//     }
//   }
// }

store.dispatch({
  type: "UPDATE_PARAMETERS",
  payload: {
    index: 5,
    parameters: {
      param3: "third parameter",
      param4: "fourth parameter"
    }
  }
});
// State:
// {
//   uid: '456',
//   adsCount: 16,
//   source: {
//     templates: ["3", "4", "5"],
//     index: 5,
//     parameters: {
//       param3: "third parameter",
//       param4: "fourth parameter"
//     }
//   }
// }```
