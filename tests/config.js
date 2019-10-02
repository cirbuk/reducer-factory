import { ops } from "../constants";

export const types = {
  ON: "ON",
  OFF: "OFF",
  TOGGLE: "TOGGLE",
  TOGGLE_AT: "TOGGLE_AT",
  ON_AT: "ON_AT",
  OFF_AT: "OFF_AT",
  ASSIGN: "ASSIGN",
  ASSIGN_TO: "ASSIGN_TO",
  ASSIGN_MULTIPLE: "ASSIGN_MULTIPLE",
  ASSIGN_GLOBAL_DEFAULT: "ASSIGN_GLOBAL_DEFAULT",
  ASSIGN_LOCAL_DEFAULT: "ASSIGN_LOCAL_DEFAULT",
  ASSIGN_GLOBAL_TRANSFORM: "ASSIGN_GLOBAL_TRANSFORM",
  ASSIGN_LOCAL_TRANSFORM: "ASSIGN_LOCAL_TRANSFORM",
  ASSIGN_FROM_TO: "ASSIGN_FROM_TO",
  RESOLVE_TO_ASSIGN: "RESOLVE_TO_ASSIGN",
  EXTRA_TYPE: 'EXTRA_TYPE',
  APPEND_STRING: 'APPEND_STRING',
  APPEND_ARRAY: 'APPEND_ARRAY',
  APPEND_OBJECT: 'APPEND_OBJECT',
  RESOLVE_TO_APPEND: "RESOLVE_TO_APPEND",
  COMPOSE: "COMPOSE",
  COMPOSE1: "COMPOSE1",
  COMPOSE2: "COMPOSE2",
  PREPEND_STRING: "PREPEND_STRING",
  PREPEND_ARRAY: "PREPEND_ARRAY",
  PREPEND_OBJECT: "PREPEND_OBJECT",
  INSERT_ARRAY: "INSERT_ARRAY",
  INSERT_STRING: "INSERT_STRING",
  INSERT_OBJECT: "INSERT_OBJECT",
};


const extraReducer = (state, action) => {
  switch (action.type) {
    case types.EXTRA_TYPE:
      return "extra";
    default:
      return state;
  }
};

const compose1 = (state = "", action) => {
  if (action.type === types.COMPOSE1) {
    return `${state}_compose1`;
  }
  return state;
};

const compose2 = (state = "", action) => {
  if (action.type === types.COMPOSE2) {
    return `${state}_compose2`;
  }
  return state;
};

export default {
  flag: {
    //Default state of [state].flag
    defaultState: false,
    ops: [
      {
        //Switch on [state].flag
        types: [
          types.ON
        ],
        op: ops.ON
      },

      //Switch off [state].flag
      {
        types: [
          types.OFF
        ],
        op: ops.OFF
      },

      //Toggle [state].flag
      {
        types: [
          types.TOGGLE
        ],
        op: ops.TOGGLE
      }
    ]
  },
  flagObject: {
    //Default state of [state].flagObject
    defaultState: {
      toggled: false
    },
    ops: [
      //Toggle at [state].flagObject.toggled
      {
        types: [
          types.TOGGLE_AT
        ],
        op: ops.TOGGLE,
        to: "toggled"
      },

      //Switch on at [state].flagObject.toggled
      {
        types: [
          types.ON_AT
        ],
        op: ops.ON,
        to: "toggled"
      },

      //Switch off at [state].flagObject.toggled
      {
        types: [
          types.OFF_AT
        ],
        op: ops.OFF,
        to: "toggled"
      }
    ]
  },
  assignDefault: {
    defaultState: {},
    defaultValue: {
      global: "global"
    },
    ops: [
      //assign global default value to [state]
      {
        types: [
          types.ASSIGN_GLOBAL_DEFAULT
        ],
      },
      //assign local default value to [state].local1
      {
        types: [
          types.ASSIGN_LOCAL_DEFAULT
        ],
        to: 'local1',
        defaultValue: {
          local: "local1"
        }
      },
      //assign local default value to [state].local2
      {
        types: [
          types.ASSIGN_LOCAL_DEFAULT
        ],
        to: 'local2',
        defaultValue: {
          local: "local2"
        }
      },
    ]
  },
  assignTransform: {
    defaultState: {},
    transform: val => `global_transform_${val}`,
    ops: [
      //assign global transformed value to [state].assignTransform
      {
        types: [
          types.ASSIGN_GLOBAL_TRANSFORM
        ],
      },
      //assign local transformed value to [state].assignTransform
      {
        types: [
          types.ASSIGN_LOCAL_TRANSFORM
        ],
        to: 'lt1',
        transform: val => `local_transform1_${val}`
      },
      //assign local transformed value to [state].assignTransform
      {
        types: [
          types.ASSIGN_LOCAL_TRANSFORM
        ],
        to: 'lt2',
        transform: val => `local_transform2_${val}`
      },
    ]
  },
  multipleFromTo: {
    defaultState: {
      flagObject: {
        flag: false
      },
      name: "",
      value: 1,
    },
    types: types.ASSIGN_MULTIPLE,
    from: ["name", "value.0", "loading.isLoading"],
    to: ["name", "value", "flagObject.flag"]
  },
  assigned: {
    //Default state of [state].assigned
    defaultState: {
      path: {}
    },

    //Global transformer of [state].assigned. Will be called for all the actions defined in the config, other than the ones
    //that have a local transformer defined

    //If there are more actions to be handled that need complex parsing
    //extra reducer can be provided
    reducer: extraReducer,

    ops: [
      //assign payload to [state].assigned
      {
        types: [
          types.ASSIGN
        ],
      },
      //assign [payload] to [state].assigned.path.value. Path will be created in state if it does not exist
      {
        types: [
          types.ASSIGN_TO
        ],
        to: "path.value"
      },

      //assign [payload].response.value to [state].assigned.path.value. Path will be created in state if it does not exist
      {
        types: [
          types.ASSIGN_FROM_TO
        ],
        from: "response.value",
        to: "path.value",
        defaultValue: ""  //If undefined is found at "response.value"
      }
    ]
  },
  appended: {
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
      //append string
      {
        types: [
          types.APPEND_STRING,
        ],
        op: ops.APPEND,
        to: "string"
      },
      //append array
      {
        types: [
          types.APPEND_ARRAY,
        ],
        op: ops.APPEND,
        to: "array"
      },
      //append string
      {
        types: [
          types.APPEND_OBJECT,
        ],
        op: ops.APPEND,
        to: "object"
      }
    ]
  },
  prepended: {
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
      //prepend string
      {
        types: [
          types.PREPEND_STRING,
        ],
        op: ops.PREPEND,
        to: "string"
      },
      //prepend array
      {
        types: [
          types.PREPEND_ARRAY,
        ],
        op: ops.PREPEND,
        to: "array"
      },
      //prepend string
      {
        types: [
          types.PREPEND_OBJECT,
        ],
        op: ops.PREPEND,
        to: "object"
      }
    ]
  },
  inserted: {
    defaultState: {
      string: "string1",
      array: [{
        string1: "string1"
      }, {
        string2: "string2"
      }, {
        string3: "string3"
      }],
      object: {
        string1: "string1"
      }
    },
    ops: [
      //insert string
      {
        types: [
          types.INSERT_STRING,
        ],
        op: ops.INSERT,
        from: "data",
        at: "{{index}}",
        to: "string"
      },
      //insert array
      {
        types: [
          types.INSERT_ARRAY,
        ],
        op: ops.INSERT,
        from: "data",
        at: "{{index}}",
        to: "array"
      },
      //insert string
      {
        types: [
          types.INSERT_OBJECT,
        ],
        op: ops.INSERT,
        from: "data",
        at: "{{index}}",
        to: "object"
      }
    ]
  },
  composed: {
    defaultState: "default",
    reducer: [compose1, compose2],
    op: ops.APPEND,
    types: types.COMPOSE
  },
  resolveAppend: {
    defaultState: [
      {
        flag: false,
        name: "rest",
        list: [{
          id: "1",
          api: "rtest"
        }, {
          id: "2",
          api: "rtest"
        }]
      }
    ],
    ops: [{
      types: types.RESOLVE_TO_ASSIGN,
      from: "data",
      to: "{{index}}.list.{{apiIndex}}.api"
    }, {
      types: types.RESOLVE_TO_APPEND,
      op: ops.APPEND,
      from: "data",
      to: "{{index}}.list"
    }]
  }
};