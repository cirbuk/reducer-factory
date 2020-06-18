import ReducerFactory, { macros, ops } from "../../index";
import { combineReducers } from "redux";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

const factoryReducer = combineReducers(factory.getReducers({
  name: {
    defaultState: '',
    defaultValue: '',
    ops: [{
      types: ["PROFILE_FETCHED", "CLEAR_FORM"],
      from: "name"
    }, {
      types: "NAME_CHANGED"
    }]
  },
  email: {
    defaultState: '',
    defaultValue: '',
    ops: [{
      types: ["PROFILE_FETCHED", "CLEAR_FORM"],
      from: "email"
    }, {
      types: "EMAIL_CHANGED"
    }]
  },
  gender: {
    defaultState: 'f',
    defaultValue: '',
    ops: [{
      types: ["PROFILE_FETCHED", "CLEAR_FORM"],
      from: "gender",
      transform: value => value.length > 0 ? (value === "Female" ? "f" : "m") : value
    }, {
      types: "GENDER_CHANGED",
      transformer: value => value.toLowerCase()
    }]
  },
  enabled: {
    macro: macros.SWITCH,
    on: "ENABLED",
    off: ["DISABLED", "CLEAR_FORM"],
    ops: [{
      types: "PROFILE_FETCHED",
      from: "enabled",
      transform: value => value === "true"
    }]
  },
  options: {
    defaultState: [],
    ops: [{
      op: ops.APPEND,
      types: "OPTION_SELECTED",
      from: "option"
    }, {
      types: "CLEAR_FORM",
      value: [],
    }, {
      types: "PROFILE_FETCHED",
      transformer: options => typeof options === "string" ? JSON.parse(options) : options,
      from: "options"
    }]
  },
  dialogOpen: {
    defaultState: false,
    macro: macros.SWITCH,
    toggle: "TOGGLE_CONFIRMATION"
  }
}));

const defaultState = {
  name: "",
  gender: "f",
  email: "",
  dialogOpen: false,
  enabled: false,
  options: []
};

describe("Blog native reducer tests", () => {
  it("should return default state", () => expect(factoryReducer()).toEqual(defaultState));

  it("should fill all fields from profile", () => expect(factoryReducer(defaultState, {
    type: "PROFILE_FETCHED",
    payload: {
      name: "Jophin",
      gender: "Male",
      enabled: "true",
      options: [1, 2, 3],
      email: "jophin@kubric.io"
    }
  })).toEqual({
    name: 'Jophin',
    gender: "m",
    enabled: true,
    options: [1, 2, 3],
    dialogOpen: false,
    email: "jophin@kubric.io"
  }));

  it("should enable", () => expect(factoryReducer(defaultState, {
    type: "ENABLED",
  })).toEqual({
    name: '',
    gender: "f",
    email: "",
    dialogOpen: false,
    enabled: true,
    options: []
  }));

  it("should disable", () => expect(factoryReducer(defaultState, {
    type: "DISABLED",
  })).toEqual({
    name: '',
    gender: "f",
    email: "",
    dialogOpen: false,
    enabled: false,
    options: []
  }));

  it("should add option", () => expect(factoryReducer({
    ...defaultState,
    options: [1, 2, 3]
  }, {
    type: "OPTION_SELECTED",
    payload: {
      option: 4
    }
  })).toEqual({
    name: '',
    gender: "f",
    email: "",
    dialogOpen: false,
    enabled: false,
    options: [1, 2, 3, 4]
  }));

  it("should change name", () => expect(factoryReducer({
    ...defaultState,
    name: "Jophin"
  }, {
    type: "NAME_CHANGED",
    payload: "Joseph"
  })).toEqual({
    name: 'Joseph',
    gender: "f",
    email: "",
    dialogOpen: false,
    enabled: false,
    options: []
  }));

  it("should clear form", () => expect(factoryReducer({
    name: "Jophin",
    enabled: true,
    options: [1, 2, 3]
  }, {
    type: "CLEAR_FORM"
  })).toEqual({
    name: '',
    gender: "",
    email: "",
    dialogOpen: false,
    enabled: false,
    options: []
  }));

});