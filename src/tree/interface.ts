import TreeNode from '@common/js/tree/tree-node';
import { TypeTreeEventState } from '@common/js/tree/types';

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TreeNode[];
}
