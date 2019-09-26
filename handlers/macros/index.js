import { macros } from "../../constants";
import { isFunction, isUndefined } from "@bit/kubric.utils.common.lodash";
import switchExpander from './switch';
import counterExpander from './counter';

const expanders = {
  [macros.SWITCH]: switchExpander,
  [macros.COUNTER]: counterExpander
};

export default class MacroExpander {
  constructor({ expanders: customExpanders = {} } = {}) {
    this.expanders = {
      ...expanders,
      ...customExpanders
    };
  }

  expand(config) {
    const { macro: type, ...object } = config;
    if (isUndefined(type)) {
      return config;
    }
    const expander = this.expanders[type];
    if (!isFunction(expander)) {
      throw new Error(`Invalid macro "${type}" provided!`);
    } else {
      return expander(object);
    }
  }
}