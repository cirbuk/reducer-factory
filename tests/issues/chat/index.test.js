import chatReducer from "./reducer";
import types from "./types";

describe("Chat reducer - Upload progress tests", () => {
  it("should return default state", () => expect(chatReducer()).toEqual({
    connectedChannels: {},
    connectingChannels: {},
    failedChannels: {},
    usercolors: {},
    paging: false,
    loadingNext: false,
    allLoaded: false,
    uploadProgresses: {}
  }));

  it("should update upload progress for asset", () => {
    const defaultState = chatReducer();
    const updatedState = chatReducer(defaultState, {
      type: types.UPLOAD_PROGRESSED,
      payload: {
        creative: "c1",
        asset: "a1",
        progressType: "upload",
        progress: 30
      }
    });
    expect(updatedState).toEqual({
      connectedChannels: {},
      connectingChannels: {},
      failedChannels: {},
      usercolors: {},
      paging: false,
      loadingNext: false,
      allLoaded: false,
      uploadProgresses: {
        c1: {
          a1: {
            upload: 30
          }
        }
      }
    });
  });

  it("should update process progress for asset", () => {
    const defaultState = chatReducer();
    const interimState = chatReducer(defaultState, {
      type: types.UPLOAD_PROGRESSED,
      payload: {
        creative: "c1",
        asset: "a1",
        progressType: "upload",
        progress: 30
      }
    });
    const updatedState = chatReducer(interimState, {
      type: types.UPLOAD_PROGRESSED,
      payload: {
        creative: "c1",
        asset: "a1",
        progressType: "process",
        progress: 30
      }
    });
    expect(updatedState).toEqual({
      connectedChannels: {},
      connectingChannels: {},
      failedChannels: {},
      usercolors: {},
      paging: false,
      loadingNext: false,
      allLoaded: false,
      uploadProgresses: {
        c1: {
          a1: {
            upload: 30,
            process: 30
          }
        }
      }
    });
  });

  it("should update progress as completed for asset", () => {
    const defaultState = chatReducer();
    const updatedState = chatReducer(defaultState, {
      type: types.UPLOAD_COMPLETED,
      payload: {
        creative: "c1",
        asset: "a1",
        url: "abc"
      }
    });
    expect(updatedState).toEqual({
      connectedChannels: {},
      connectingChannels: {},
      failedChannels: {},
      usercolors: {},
      paging: false,
      loadingNext: false,
      allLoaded: false,
      uploadProgresses: {
        c1: {
          a1: {
            completed: true,
            upload: 100,
            process: 100,
            url: "abc"
          }
        }
      }
    });
  });
});