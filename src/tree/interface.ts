import TreeNode from '../_common/js/tree/tree-node';
import { TypeTreeEventState } from '../_common/js/tree/types';

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TreeNode[];
}
