import MacroExpander from "../../../handlers/macros";
import { ops, macros } from "../../../constants";

const expander = new MacroExpander();

describe("Switch test", () => {
  it("1. Invalid macro error", () => expect(() => expander.expand({
    macro: "switcher",
    on: "SWITCH_ON",
    off: ["SWITCH_OFF", "TURN_OFF"]
  })).toThrowError(new Error(`Invalid macro "switcher" provided!`)));

  it("2. Expand switch macro", () => expect(expander.expand({
    macro: macros.SWITCH,
    on: "SWITCH_ON",
    off: ["SWITCH_OFF", "TURN_OFF"]
  })).toEqual({
    defaultState: false,
    ops: [{
      types: ["SWITCH_ON"],
      op: ops.ON
    }, {
      types: ["SWITCH_OFF", "TURN_OFF"],
      op: ops.OFF
    }]
  }));

  it("3. Expand switch macro with default state", () => expect(expander.expand({
    macro: macros.SWITCH,
    defaultState: true,
    on: "SWITCH_ON",
    off: ["SWITCH_OFF", "TURN_OFF"]
  })).toEqual({
    defaultState: true,
    ops: [{
      types: ["SWITCH_ON"],
      op: ops.ON
    }, {
      types: ["SWITCH_OFF", "TURN_OFF"],
      op: ops.OFF
    }]
  }));

  it("4. Expand switch macro with toggle", () => expect(expander.expand({
    macro: macros.SWITCH,
    defaultState: true,
    on: "SWITCH_ON",
    toggle: "SWITCH_TOGGLE",
    off: ["SWITCH_OFF", "TURN_OFF"]
  })).toEqual({
    defaultState: true,
    ops: [{
      types: ["SWITCH_ON"],
      op: ops.ON
    }, {
      types: ["SWITCH_OFF", "TURN_OFF"],
      op: ops.OFF
    }, {
      types: ["SWITCH_TOGGLE"],
      op: ops.TOGGLE
    }]
  }));

  it("5. Expand switch macro + config", () => expect(expander.expand({
    macro: macros.SWITCH,
    defaultState: true,
    on: "SWITCH_ON",
    toggle: "SWITCH_TOGGLE",
    off: ["SWITCH_OFF", "TURN_OFF"],
    ops: [{
      types: ["ASSIGN"],
      action: {
        type: ops.ASSIGN,
        from: "assign.path"
      }
    }]
  })).toEqual({
    defaultState: true,
    ops: [{
      types: ["SWITCH_ON"],
      op: ops.ON
    }, {
      types: ["SWITCH_OFF", "TURN_OFF"],
      op: ops.OFF
    }, {
      types: ["SWITCH_TOGGLE"],
      op: ops.TOGGLE
    }, {
      types: ["ASSIGN"],
      action: {
        type: ops.ASSIGN,
        from: "assign.path"
      }
    }]
  }));

});