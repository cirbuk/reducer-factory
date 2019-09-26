import assignHandler from '../../handlers/assign';
import { ops } from "../../constants";

describe("Assign tests", () => {
  it("1. assign from payload", () => expect(assignHandler("state", {
    op: {
      type: ops.ASSIGN,
    },
    basePath: "payload",
  }, {
    payload: "newState"
  })).toEqual("newState"));

  it("2. assign from defaultValue", () => expect(assignHandler("state", {
    op: {
      type: ops.ASSIGN,
    },
    basePath: "payload",
    defaultValue: "newState"
  }, {
    payload: undefined
  })).toEqual("newState"));

  it("3. assign with transform", () => expect(assignHandler("state", {
    op: {
      type: ops.ASSIGN,
    },
    basePath: "payload",
    transform: value => `${value}.1`
  }, {
    payload: "newState"
  })).toEqual("newState.1"));

  it("4. assign to path", () => expect(assignHandler({
    field1: "field1",
    field2: "field2",
    field3: {
      field: "field"
    }
  }, {
    op: {
      type: ops.ASSIGN,
      to: "field3.field"
    },
    basePath: "payload",
  }, {
    payload: "field3"
  })).toEqual({
    field1: "field1",
    field2: "field2",
    field3: {
      field: "field3"
    }
  }));

  it("5. assign from/to path", () => expect(assignHandler({
    field1: "field1",
    field2: "field2",
    field3: {
      field: "field"
    }
  }, {
    op: {
      type: ops.ASSIGN,
      from: "fieldValue",
      to: "field3.field"
    },
    basePath: "payload",
  }, {
    payload: {
      fieldValue: "field3"
    }
  })).toEqual({
    field1: "field1",
    field2: "field2",
    field3: {
      field: "field3"
    }
  }));
});

describe("Append tests", () => {
  it("1. append string", () => expect(assignHandler("state1", {
    op: {
      type: ops.APPEND
    },
    basePath: "payload",
  }, {
    payload: "state2"
  })).toEqual("state1state2"));

  it("2. append object", () => expect(assignHandler({
    field1: "field1"
  }, {
    op: {
      type: ops.APPEND
    },
    basePath: "payload",
  }, {
    payload: {
      field2: {
        field: "state"
      }
    }
  })).toEqual({
    field1: "field1",
    field2: {
      field: "state"
    }
  }));

  it("3. append array", () => expect(assignHandler([{
    field1: "field1"
  }], {
    op: {
      type: ops.APPEND
    },
    basePath: "payload",
  }, {
    payload: [{
      field2: {
        field: "state"
      }
    }]
  })).toEqual([{
    field1: "field1"
  }, {
    field2: {
      field: "state"
    }
  }]));
});

describe("Prepend tests", () => {
  it("1. Prepend string", () => expect(assignHandler("state1", {
    op: {
      type: ops.PREPEND
    },
    basePath: "payload",
  }, {
    payload: "state2"
  })).toEqual("state2state1"));

  it("2. Prepend object", () => expect(assignHandler({
    field1: "field1"
  }, {
    op: {
      type: ops.PREPEND
    },
    basePath: "payload",
  }, {
    payload: {
      field2: {
        field: "state"
      }
    }
  })).toEqual({
    field1: "field1",
    field2: {
      field: "state"
    }
  }));

  it("3. Prepend array", () => expect(assignHandler([{
    field1: "field1"
  }], {
    op: {
      type: ops.PREPEND
    },
    basePath: "payload",
  }, {
    payload: [{
      field2: {
        field: "state"
      }
    }]
  })).toEqual([{
    field2: {
      field: "state"
    }
  }, {
    field1: "field1"
  }]));
});

describe("Insert tests", () => {
  it("1. Insert string", () => expect(assignHandler("state1", {
    op: {
      type: ops.INSERT,
      at: "4"
    },
    basePath: "payload",
  }, {
    payload: "state2"
  })).toEqual("statstate2e1"));

  it("2. Insert object", () => expect(assignHandler({
    field1: "field1",
  }, {
    op: {
      type: ops.INSERT,
      at: 4
    },
    basePath: "payload",
  }, {
    payload: {
      field2: {
        field: "state"
      }
    }
  })).toEqual({
    field1: "field1",
    field2: {
      field: "state"
    }
  }));

  it("3. Insert array", () => expect(assignHandler([{
    field1: "field1"
  }, {
    field1: "field3"
  }], {
    op: {
      type: ops.INSERT,
      at: 1
    },
    basePath: "payload",
  }, {
    payload: {
      field2: {
        field: "state"
      }
    }
  })).toEqual([{
    field1: "field1"
  }, {
    field2: {
      field: "state"
    }
  }, {
    field1: "field3"
  }]));

  it("3. Insert array over length", () => expect(assignHandler([{
    field1: "field1"
  }, {
    field1: "field3"
  }], {
    op: {
      type: ops.INSERT,
      at: 4
    },
    basePath: "payload",
  }, {
    payload: {
      field2: {
        field: "state"
      }
    }
  })).toEqual([{
    field1: "field1"
  }, {
    field1: "field3"
  }, undefined, undefined, {
    field2: {
      field: "state"
    }
  }]));
});