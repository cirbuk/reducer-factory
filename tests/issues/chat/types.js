/**
 * Accepts an array of types and a prefix and returns the types object
 * @param types
 * @param prefix
 */
export const getTypes = (types = [], prefix = '') => types.reduce((acc, type) => {
  acc[type] = `${prefix}/${type}`;
  return acc;
}, {});

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