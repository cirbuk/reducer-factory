import types from './types';
import { combineReducers } from "redux";
import ReducerFactory, { ops, macros } from "../../../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

export default combineReducers({
  ...factory.getReducers({
    connectedChannels: {
      defaultState: {},
      types: types.CHANNEL_CONNECTED,
      op: ops.APPEND
    },
    connectingChannels: {
      defaultState: {},
      types: types.CHANNEL_CONNECTING,
      op: ops.APPEND
    },
    failedChannels: {
      defaultState: {},
      types: types.CHANNEL_FAILED,
      op: ops.APPEND
    },
    usercolors: {
      defaultState: {},
      types: types.SET_USER_COLOR,
      op: ops.APPEND
    },
    paging: {
      defaultState: false,
      types: types.UPDATE_PAGING,
      transform(value) {
        return value - 1;
      }
    },
    loadingNext: {
      macro: macros.SWITCH,
      on: types.ON_LOADING_NEXT,
      off: types.OFF_LOADING_NEXT,
    },
    allLoaded: {
      macro: macros.SWITCH,
      on: types.ALL_CHATS_LOADED
    },
    uploadProgresses: {
      defaultState: {},
      ops: [{
        types: [types.UPLOAD_PROGRESSED],
        from: 'progress',
        to: '{{creative}}.{{asset}}.{{progressType}}'
      }, {
        types: [types.UPLOAD_COMPLETED],
        value: 100,
        to: '{{creative}}.{{asset}}.upload'
      }, {
        types: [types.UPLOAD_COMPLETED],
        value: 100,
        to: '{{creative}}.{{asset}}.process'
      }, {
        types: [types.UPLOAD_COMPLETED],
        from: 'url',
        defaultValue: "",
        to: '{{creative}}.{{asset}}.url'
      }, {
        types: [types.UPLOAD_COMPLETED],
        value: true,
        to: '{{creative}}.{{asset}}.completed'
      }, {
        types: [types.UPLOAD_ERRED],
        value: true,
        to: '{{creative}}.{{asset}}.erred'
      }]
    }
  }),
});