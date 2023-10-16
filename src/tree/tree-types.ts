import { TreeStore } from '../_common/js/tree/tree-store';
import { TreeNode } from '../_common/js/tree/tree-node';
import { TreeNodeModel } from '../_common/js/tree/tree-node-model';

import type { TreeNodeValue, TreeNodeState } from './type';

// 在这个文件做统一的类型梳理
// 所有类型，接口，都用 Type 作为名称前缀

export * from './type';

export type TypeTNodeState = TreeNodeState;
export type TypeTNodeValue = TreeNodeValue;
export type TypeTreeStore = TreeStore;
export type TypeTimer = ReturnType<typeof setTimeout>;
export type TypeTreeNode = TreeNode;
export type TypeTreeNodeModel = TreeNodeModel;
export type TypeTargetNode = TreeNodeValue | TypeTreeNode | TypeTreeNodeModel;

export interface TypeMark {
  name: string;
  value: string;
  el?: HTMLElement;
}

export interface TypeLineModel {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}
