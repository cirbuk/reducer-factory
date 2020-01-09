export enum Op {
  ON = "ON",
  OFF = "OFF",
  TOGGLE = "TOGGLE",
  ASSIGN = "ASSIGN",
  APPEND = "APPEND",
  INSERT = "INSERT",
  PREPEND = "PREPEND",
}

export interface ParsedOpDef {
  type: string,
  to?: string,
  from?: string,
  at?: number,
  payload?: any,
  value?: any
}

export interface ReducerOpDef {
  op?: Op,
  types: string | Array<string>,
  from?: string,
  to?: string,
  at?: number,
  transform?: Function,
  defaultValue?: any,
  reducer?: Function,
  payload?: any
}

export interface ParsedReducerOpDef {
  op: ParsedOpDef,
  type: string,
  from?: string,
  to?: string,
  at?: number,
  transform?: Function,
  defaultValue?: any,
  reducer?: Function,
  payload?: any,
  basePath?: string
}

export interface ReducerDef {
  ops?: Array<ReducerOpDef>
  defaultState: any,
  op?: Op,
  type?: string,
  from?: string,
  to?: string,
  at?: number,
  transform?: Function,
  defaultValue?: any,
  reducer?: Function
}

export interface ParsedTypeOperation {
  op: ParsedOpDef,
  transform?: Function,
  defaultValue?: any
}

export interface ParsedTypeOperations {
  [index: string]: Array<ParsedTypeOperation>
}

export interface ReducersConfig {
  [index: string]: ReducerDef | MacroDef,
}

export interface ParsedReducers {
  [index: string]: Function
}

export interface OpHandlers {
  [index: string]: Function
}

//Actions object types
export interface ActionReducerDef {
  from?: string,
  to?: string,
  at?: number,
  transform?: Function,
  defaultValue?: any,
  reducer?: Function
}

export interface ActionReducersConfig {
  [index: string]: string | ActionReducerDef
}

export interface ActionOpConfig {
  op?: Op,
  reducers: ActionReducersConfig
}

export type ActionOps = Array<ActionOpConfig>;

export interface ActionsConfig {
  [index: string]: ActionOps
}

export interface FullConfig {
  reducers?: ReducersConfig,
  actions?: ActionsConfig
}

export interface ReduxAction {
  type: string,
}

export interface CounterMacroDef {
  defaultState?: number,
  to?: string,
  step?: number,
  next?: string | Array<string>,
  previous?: string | Array<string>,
  first?: string | Array<string>,
  last?: string | Array<string>,
  max?: number | Function,
  min?: number | Function,
  ops?: Array<ReducerOpDef>
}

export interface SwitchMacroDef {
  defaultState?: boolean,
  to?: string,
  on?: string | Array<string>,
  off?: string | Array<string>,
  toggle?: string | Array<string>,
  ops?: Array<ReducerOpDef>
}

export interface MacroDef {
  macro: string
}