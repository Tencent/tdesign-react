import { MouseEvent } from 'react';
import TreeNode from '@tdesign/common-js/tree-v1/tree-node';
import { TypeTreeEventState } from '@tdesign/common-js/tree-v1/types';
import { TreeProps } from './Tree';

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TreeNode[];
}

export interface TreeItemProps
  extends Pick<
    TreeProps,
    | 'empty'
    | 'activable'
    | 'icon'
    | 'label'
    | 'line'
    | 'transition'
    | 'expandOnClickNode'
    | 'activable'
    | 'operations'
    | 'checkProps'
    | 'disableCheck'
  > {
  /**
   * 树节点数据对象
   */
  node?: TreeNode;

  /**
   * 树节点点击回调事件
   */
  onClick?: (
    node: TreeNode,
    options: { e: MouseEvent<HTMLDivElement>; expand: boolean; active: boolean; trigger: 'node-click' | 'icon-click' },
  ) => void;

  /**
   * 树节点状态变更事件
   */
  onChange?: (node: TreeNode, ctx: { e: any }) => void;
}

export type DropPosition = -1 | 0 | 1;
