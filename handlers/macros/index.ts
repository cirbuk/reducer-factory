import { macros } from "../../constants";
import { isFunction, isUndefined } from "@kubric/litedash";
import switchExpander from './switch';
import counterExpander from './counter';
import { MacroDef } from "../../interfaces";

const expanders = {
  [macros.SWITCH]: switchExpander,
  [macros.COUNTER]: counterExpander
};

export default class MacroExpander {
  expanders: {
    [index: string]: Function
  };

  constructor({ expanders: customExpanders = {} } = {}) {
    this.expanders = {
      ...expanders,
      ...customExpanders
    };
  }

  expand(config: MacroDef) {
    const { macro: type, ...object } = config;
    if(isUndefined(type)) {
      return config;
    }
    const expander = this.expanders[type];
    if(!isFunction(expander)) {
      throw new Error(`Invalid macro "${type}" provided!`);
    } else {
      return expander(object);
    }
  }
}