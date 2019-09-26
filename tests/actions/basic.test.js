import { createStore, combineReducers } from "redux";
import ReducerFactory from "../../index";
import { isString } from "@bit/kubric.utils.common.lodash";

const typesReducers = {
  actions: {
    CREATIVE_FETCHED: [{
      reducers: {
        parameters: 'source.parameters',
        name: 'source.segment.name',
        source: 'source',
        id: 'uid',
        meta: {
          from: 'meta',
          transform(val) {
            return isString(val) ? JSON.parse(val) : val;
          }
        },
      }
    }]
  },
  reducers: {
    parameters: {
      defaultState: {}
    },
    name: '',
    source: {
      defaultState: {}
    },
    id: '',
    meta: {
      defaultState: {}
    },
    shot: {
      defaultState: 0,
      ops: [{
        types: "SHOT_SELECTED",
      }]
    },
  }
};

const factory = new ReducerFactory({
  payloadPath: "payload"
});

let store, newState;

const creative = {
  "uid": "70c4d249-7ad8-4361-8418-f12b162f984b",
  "source": {
    "segment": {
      "aud_id": "3",
      "fb_id": "",
      "name": "23926"
    },
    "parameters": [
      {
        "gradient_color": "#000000"
      }
    ]
  },
  "meta": "{\"creative\":{\"channelSid\": \"CH09a583ecbe8f4b478cbf04ba3ac1bb6b\"}}",
};

describe("Types config", () => {
  beforeEach(() => {
    store = createStore(combineReducers(factory.getReducers(typesReducers)));
    newState = {
      parameters: {},
      name: "",
      source: {},
      id: "",
      meta: {},
      shot: 0
    };
  });

  it("1. Checking default state", () => {
    return expect(store.getState()).toEqual(newState);
  });

  it("2. Checking with payload", () => {
    store.dispatch({
      type: "CREATIVE_FETCHED",
      payload: creative
    });
    return expect(store.getState()).toEqual({
      parameters: [
        {
          "gradient_color": "#000000"
        }
      ],
      name: "23926",
      source: {
        "segment": {
          "aud_id": "3",
          "fb_id": "",
          "name": "23926"
        },
        "parameters": [
          {
            "gradient_color": "#000000"
          }
        ]
      },
      id: "70c4d249-7ad8-4361-8418-f12b162f984b",
      meta: {
        "creative": {
          "channelSid": "CH09a583ecbe8f4b478cbf04ba3ac1bb6b"
        }
      },
      shot: 0
    });
  });
});