import { MouseEvent, ReactNode } from 'react';
import { TNode } from '../common';
import TreeNode from '../_common/js/tree/tree-node';
import { TypeTreeEventState, TypeTreeNodeModel } from '../_common/js/tree/types';

export interface TypeEventState extends TypeTreeEventState {
  mouseEvent?: MouseEvent;
  event?: Event;
  path?: TreeNode[];
}

export interface TreeItemProps {
  /**
   * 树节点数据对象
   */
  node?: TreeNode;

  /**
   * 数据为空时展示的文本
   * @default ''
   */
  empty?: string | Function | ReactNode;

  /**
   * 是否显示节点图标
   *  @default true
   */
  icon?: ((node: TypeTreeNodeModel) => ReactNode) | boolean | ReactNode;

  /**
   * 是否显示连接线
   */
  line?: boolean | TNode;

  /**
   * 节点标签文本
   */
  label?: Function | string | ReactNode;

  /**
   * 点击节点是否触发展开收缩，默认 false
   */
  expandOnClickNode?: boolean;

  /**
   * 节点是否可高亮
   * @default false
   */
  activable?: boolean;

  /**
   *  @default -
   */
  operations?: TNode<TypeTreeNodeModel>;

  /**
   * 节点是否有hover状态
   *  @default false
   */
  hover?: boolean;

  /**
   * 是否启用动画，默认 true
   */
  transition?: boolean;

  /**
   * 透传 checkbox 组件的属性（【待完成】类型改为引入 checkbox 组件的属性类型来限制）
   *  @default -
   */
  checkProps?: object;

  /**
   * 树节点点击回调事件
   */
  onClick?: (node: TreeNode, options: { event: MouseEvent<HTMLDivElement>; expand: boolean; active: boolean }) => void;

  /**
   * 树节点状态变更事件
   */
  onChange?: (node: TreeNode) => void;
}
