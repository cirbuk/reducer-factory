import { macros } from "../../../constants";
import ReducerFactory from "../../../index";

const factory = new ReducerFactory({
  payloadPath: "payload"
});

const reducer1 = factory.getReducer({
  macro: macros.COUNTER,
  defaultState: 1,
  next: "NEXT",
  previous: ["PREVIOUS", "BACK"],
  first: "FIRST",
  last: "LAST",
  min: -2,
  max() {
    return 34;
  }
});

const reducer2 = factory.getReducer({
  macro: macros.COUNTER,
  defaultState: 1,
  step: 2,
  next: "NEXT",
  previous: ["PREVIOUS", "BACK"],
  first: "FIRST",
  last: "LAST",
  min: -2,
  max() {
    return 34;
  }
});

const reducer3 = factory.getReducer({
  macro: macros.COUNTER,
  defaultState: {
    count: 1
  },
  step: 2,
  to: "count",
  next: "NEXT",
  previous: ["PREVIOUS", "BACK"],
  first: "FIRST",
  last: "LAST",
  min: -2,
  max() {
    return 34;
  }
});

describe("counter macro test", () => {
  it("returns default value", () => expect(reducer1()).toEqual(1));

  it("returns next value", () =>
    expect(reducer1(1, {
      type: "NEXT"
    })).toEqual(2));

  it("returns previous value 1", () =>
    expect(reducer1(1, {
      type: "PREVIOUS"
    })).toEqual(0));

  it("returns previous value 2", () =>
    expect(reducer1(0, {
      type: "BACK"
    })).toEqual(-1));

  it("returns first value", () =>
    expect(reducer1(0, {
      type: "FIRST"
    })).toEqual(-2));

  it("returns last value", () =>
    expect(reducer1(0, {
      type: "LAST"
    })).toEqual(34));

  it("does not increment after the last value", () =>
    expect(reducer1(34, {
      type: "NEXT"
    })).toEqual(34));

  it("does not decrement after the first value", () =>
    expect(reducer1(-2, {
      type: "PREVIOUS"
    })).toEqual(-2));
});

describe("counter macro incrementBy test", () => {
  it("returns default value", () => expect(reducer2()).toEqual(1));

  it("returns next value", () =>
    expect(reducer2(1, {
      type: "NEXT"
    })).toEqual(3));

  it("returns previous value", () =>
    expect(reducer2(1, {
      type: "PREVIOUS"
    })).toEqual(-1));

});

describe("counter macro to test", () => {
  it("returns default value", () => expect(reducer3()).toEqual({
    count: 1
  }));

  it("returns next value", () =>
    expect(reducer3({
      count: 1
    }, {
      type: "NEXT"
    })).toEqual({
      count: 3
    }));

  it("returns previous value", () =>
    expect(reducer3({
      count: 1
    }, {
      type: "PREVIOUS"
    })).toEqual({
      count: -1
    }));

  it("returns min value", () =>
    expect(reducer3({
      count: 1
    }, {
      type: "FIRST"
    })).toEqual({
      count: -2
    }));

  it("returns max value", () =>
    expect(reducer3({
      count: 1
    }, {
      type: "LAST"
    })).toEqual({
      count: 34
    }));
});