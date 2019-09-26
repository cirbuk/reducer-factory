import { createStore, combineReducers } from "redux";
import ReducerFactory, { ops, macros } from "../../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

const stringifyJson = (str, defaultValue) => {
  try {
    return JSON.parse(str);
  } catch (ex) {
    return defaultValue;
  }
};

const CREATED_CAMPAIGN_ROUTE = "createdCampaign";
const CAMPAIGN_SB_ROUTE = "campaignStoryboards";

const assetTypes = {
  SHOW_TASKS: "SHOW_TASKS"
};

const types = {
  STORYBOARDS_FETCHED: "STORYBOARDS_FETCHED",
  NEW_CAMPAIGN: "NEW_CAMPAIGN",
  HIDE_MODAL: "HIDE_MODAL",
  NAME_CHANGED: "NAME_CHANGED",
  CAMPAIGN_FETCHED: "CAMPAIGN_FETCHED",
  PAGE_CHANGED: "PAGE_CHANGED",
  TYPE_CHANGED: "TYPE_CHANGED",
  ON_GENERATE_CONFIRMATION: "ON_GENERATE_CONFIRMATION",
  ON_CANCEL_CONFIRMATION: "ON_CANCEL_CONFIRMATION",
  ADS_WITH_MISSING_ASSETS_FETCHED: "ADS_WITH_MISSING_ASSETS_FETCHED",
};

const routeTypes = {
  ROUTE_LOADED: "ROUTE_LOADED"
};

const fetchNewCampaignStoryboards = {
  INITIATED: "fetchNewCampaignStoryboards/INITIATED",
  FAILED: "fetchNewCampaignStoryboards/FAILED",
  COMPLETED: "fetchNewCampaignStoryboards/COMPLETED"
};

const approveCopyQC = {
  COMPLETED: "approveCopyQC/COMPLETED"
};
const rejectCopyQC = {
  COMPLETED: "rejectCopyQC/COMPLETED"
};
const approveVisualQC = {
  COMPLETED: "approveVisualQC/COMPLETED"
};
const rejectVisualQC = {
  COMPLETED: "rejectVisualQC/COMPLETED"
};

const createCampaign = {
  COMPLETED: "createCampaign/COMPLETED"
};

const reducers = factory.getReducers({
  reducers: {
    stats: {
      defaultState: {
        loading: false
      },
      ops: [{
        types: fetchNewCampaignStoryboards.INITIATED,
        op: ops.ON,
        to: "loading"
      }, {
        types: fetchNewCampaignStoryboards.FAILED,
        op: ops.OFF,
        to: "loading"
      }, {
        types: types.STORYBOARDS_FETCHED,
        transform: payload => ({
          completed: !payload.next,
          next: payload.next,
        })
      }]
    },
    isModalOpen: {
      macro: macros.SWITCH,
      on: types.NEW_CAMPAIGN,
      off: types.HIDE_MODAL
    },
    name: {
      defaultState: '',
      ops: [{
        types: types.NAME_CHANGED,
      }, {
        types: types.CAMPAIGN_FETCHED,
        from: "name"
      }]
    },
    page: {
      defaultState: -1,
      ops: [{
        types: types.PAGE_CHANGED,
      }, {
        types: routeTypes.ROUTE_LOADED,
        from: "routeId",
        transform: (routeId, currentPage) => routeId !== CREATED_CAMPAIGN_ROUTE ? (routeId === CAMPAIGN_SB_ROUTE ? 0 : -1) : currentPage
      }]
    },
    mediaFormat: {
      defaultState: "video",
      types: types.TYPE_CHANGED
    },
    modalStatus: {
      defaultState: false,
      types: assetTypes.SHOW_TASKS,
      op: ops.TOGGLE
    },
    confirmationDialog: {
      defaultState: false,
      ops: [{
        types: types.ON_GENERATE_CONFIRMATION,
        op: ops.ON
      }, {
        types: types.ON_CANCEL_CONFIRMATION,
        op: ops.OFF
      }]
    },
    missingAssetsCount: {
      defaultState: "",
      types: types.ADS_WITH_MISSING_ASSETS_FETCHED,
      from: "totalHits",
    },
    id: {
      defaultState: "",
      types: createCampaign.COMPLETED,
      from: "response.uid",
    },
    tasks: {
      defaultState: {},
      types: [
        approveCopyQC.COMPLETED,
        rejectCopyQC.COMPLETED,
        approveVisualQC.COMPLETED,
        rejectVisualQC.COMPLETED,
      ],
      from: "response.tasks",
      transform: val => stringifyJson(val, {})
    },
    exported_creative_folder: '',
    feed: {
      defaultState: '',
      transform: val => !val ? '' : val
    },
    status: '',
    uid: ''
  },
  actions: {
    [types.CAMPAIGN_FETCHED]:
      [{
        reducers: {
          exported_creative_folder: "exported_creative_folder",
          feed: "feed_url",
          status: "status",
          uid: "uid",
          tasks: "tasks",
          id: "uid"
        }
      }],
    [fetchNewCampaignStoryboards.COMPLETED]:
      [{
        reducers: {
          stats: {
            transform({ response }) {
              return {
                completed: !response.next,
                next: response.next,
                loading: false
              }
            }
          },
        }
      }]
  }
});

const finalReducer = combineReducers(reducers);

let store;
const defaultState = {
  stats: {
    loading: false
  },
  isModalOpen: false,
  name: '',
  page: -1,
  mediaFormat: "video",
  confirmationDialog: false,
  missingAssetsCount: "",
  modalStatus: false,
  id: "",
  tasks: {},
  exported_creative_folder: "",
  feed: "",
  status: "",
  uid: ""
};

describe("Campaign reducer", () => {
  beforeEach(() => {
    store = createStore(finalReducer, {});
  });

  it("1. Default state check", () => {
    expect(store.getState()).toEqual(defaultState);
  });

  it("2. Stats loading on check", () => {
    store.dispatch({
      type: fetchNewCampaignStoryboards.INITIATED,
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      stats: {
        loading: true
      },
    });
  });

  it("3. Stats loading off check", () => {
    store.dispatch({
      type: fetchNewCampaignStoryboards.FAILED,
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      stats: {
        loading: false
      }
    });
  });

  it("3. Stats fetchNewCampaignStoryboards.COMPLETED", () => {
    store.dispatch({
      type: fetchNewCampaignStoryboards.COMPLETED,
      payload: {
        response: {
          next: false
        }
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      stats: {
        loading: false,
        completed: true,
        next: false
      },
    });
  });

  it("4. Stats actions.CAMPAIGN_FETCHED", () => {
    store.dispatch({
      type: types.CAMPAIGN_FETCHED,
      payload: {
        exported_creative_folder: "exported_creative_folder",
        feed_url: "feed_url",
        status: "status",
        uid: "uid",
        tasks: `{"name": "tasks"}`,
        name: "name",
        id: "uid",
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      tasks: {
        name: "tasks"
      },
      exported_creative_folder: "exported_creative_folder",
      feed: "feed_url",
      status: "status",
      uid: "uid",
      id: "uid",
      name: "name"
    });
  });

  it("5. Tasks approveCopyQC.COMPLETED", () => {
    store.dispatch({
      type: approveCopyQC.COMPLETED,
      payload: {
        response: {
          exported_creative_folder: "exported_creative_folder",
          feed_url: "feed_url",
          status: "status",
          uid: "uid",
          tasks: `{"name": "tasks"}`,
          name: "name"
        }
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      tasks: {
        name: "tasks"
      }
    });
  });

  it("5. Page actions.PAGE_CHANGED", () => {
    store.dispatch({
      type: types.PAGE_CHANGED,
      payload: 2
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      page: 2,
    });
  });

  it("6. Page routeTypes.ROUTE_LOADED 1", () => {
    store.dispatch({
      type: routeTypes.ROUTE_LOADED,
      payload: {
        routeId: CREATED_CAMPAIGN_ROUTE
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      page: -1,
    });
  });

  it("7. Page routeTypes.ROUTE_LOADED 2", () => {
    store.dispatch({
      type: routeTypes.ROUTE_LOADED,
      payload: {
        routeId: CAMPAIGN_SB_ROUTE
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      page: 0,
    });
  });

  it("8. Page routeTypes.ROUTE_LOADED 3", () => {
    store.dispatch({
      type: routeTypes.ROUTE_LOADED,
      payload: {
        routeId: "Wrong route"
      }
    });
    expect(store.getState()).toEqual({
      ...defaultState,
      page: -1,
    });
  });

});
