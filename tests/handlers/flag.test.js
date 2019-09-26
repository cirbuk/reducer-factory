import flagHandler from '../../handlers/flag';
import { ops } from "../../constants";

describe("Flag tests", () => {
  it("1. on", () => expect(flagHandler("", {
    op: {
      type: ops.ON
    },
  }, {})).toEqual(true));

  it("2. off", () => expect(flagHandler("", {
    op: {
      type: ops.OFF
    },
  }, {})).toEqual(false));

  it("3. toggle", () => expect(flagHandler(false, {
    op: {
      type: ops.TOGGLE
    },
  }, {})).toEqual(true));

  it("4. toggle at path", () => expect(flagHandler({
    flag: false
  }, {
    op: {
      type: ops.ON,
      to: "flag"
    },
  }, {})).toEqual({
    flag: true
  }));

  it("5. toggle undefined", () => expect(flagHandler(undefined, {
    op: {
      type: ops.TOGGLE,
    },
  }, {})).toEqual(true));

  it("6. toggle empty string", () => expect(flagHandler("", {
    op: {
      type: ops.TOGGLE,
    },
  }, {})).toEqual(true));

});