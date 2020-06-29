import deleteHandler from '../../handlers/delete';
import { ops } from "../../constants";

describe("Delete tests", () => {
  it("1. delete from string", () => expect(deleteHandler("state", {
    op: {
      type: ops.DELETE,
      at: 2
    },
    basePath: "payload",
  }, {})).toEqual("stte"));

  it("1. delete from string with path", () => expect(deleteHandler({
    state: {
      value: "state"
    }
  }, {
    op: {
      type: ops.DELETE,
      to: "state.value",
      at: 2
    },
    basePath: "payload",
  }, {})).toEqual({
    state: {
      value: "stte"
    }
  }));

  it("2. delete from string with defaultValue", () => expect(deleteHandler("state", {
    op: {
      type: ops.DELETE,
    },
    basePath: "payload",
    defaultValue: "newState"
  }, {})).toEqual("state"));

  it("3. delete with transform", () => expect(deleteHandler("state", {
    op: {
      type: ops.DELETE,
      at: 5
    },
    basePath: "payload",
    transform: value => `${value}.1`
  }, {})).toEqual("state"));

  it("4. delete from array by index", () => expect(deleteHandler([1, 2, 3, 4], {
    op: {
      type: ops.DELETE,
      at: 2
    },
    basePath: "payload",
  }, {})).toEqual([1, 2, 4]));

  it("5. delete from path", () => expect(deleteHandler({
    field1: "field1",
    field2: "field2",
    field3: [1, 2, 3, 4, 5]
  }, {
    op: {
      type: ops.DELETE,
      from: "delete.value",
      to: "field3"
    },
    basePath: "payload",
  }, {
    payload: {
      delete: {
        value: 4
      }
    }
  })).toEqual({
    field1: "field1",
    field2: "field2",
    field3: [1, 2, 3, 5]
  }));
});