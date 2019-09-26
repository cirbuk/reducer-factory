import assignHandler from './assign';
import flagHandler from './flag';
import { ops } from "../constants";

export default {
  [ops.ON]: flagHandler,
  [ops.OFF]: flagHandler,
  [ops.TOGGLE]: flagHandler,
  [ops.APPEND]: assignHandler,
  [ops.PREPEND]: assignHandler,
  [ops.INSERT]: assignHandler,
  [ops.ASSIGN]: assignHandler
}