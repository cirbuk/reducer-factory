import { getTypes } from "@bit/kubric.redux.reducks.utils";

export default {
  ...getTypes([
    'MESSAGES_FETCHED',
    'INCOMING_MESSAGE',
    'SEND_MESSAGE',
    'CHANNEL_CONNECTING',
    'CHANNEL_CONNECTED',
    'CHANNEL_SELECTED',
    'SET_USER_COLOR',
    'CHANNEL_FAILED',
    'UPDATE_PAGING',
    'ON_LOADING_NEXT',
    'OFF_LOADING_NEXT',
    'ALL_CHATS_LOADED',
    'UPLOAD_PROGRESSED',
    'UPLOAD_COMPLETED',
    'UPLOAD_ERRED',
  ], 'kubric/chat'),
};