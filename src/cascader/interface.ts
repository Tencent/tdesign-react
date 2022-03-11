import { TdCascaderProps, CascaderValue, CascaderChangeSource } from './type';
import { StyledProps } from '../common';
import TreeStore from '../_common/js/tree/tree-store';
import TreeNode from '../_common/js/tree/tree-node';
import { TreeNodeModel, TreeNodeValue } from '../_common/js/tree/types';

export interface CascaderProps extends TdCascaderProps, StyledProps {}

export interface CascaderContextType
  extends Pick<
    TdCascaderProps,
    | 'size'
    | 'disabled'
    | 'checkStrictly'
    | 'lazy'
    | 'multiple'
    | 'filterable'
    | 'clearable'
    | 'checkProps'
    | 'showAllLevels'
    | 'max'
    | 'value'
    | 'minCollapsedNum'
    | 'loading'
    | 'loadingText'
  > {
  treeStore: TreeStore;
  inputWidth: number;
  setInputWidth: (val: number) => void;
  setValue: (val: CascaderValue, source: CascaderChangeSource, node?: TreeNodeModel) => void;
  visible: boolean;
  setVisible: (val: boolean) => void;
  treeNodes: TreeNode[];
  setTreeNodes: (val: CascaderValue) => void;
  filterActive: boolean;
  setFilterActive: (val: boolean) => void;
  inputVal: string;
  setInputVal: (val: string) => void;
  setExpend: (val: TreeNodeValue[]) => void;
}
export interface CascaderPanelProps extends Pick<TdCascaderProps, 'trigger' | 'empty' | 'onChange'> {
  cascaderContext: CascaderContextType;
}

export interface ListenersType {
  onRemove?: TdCascaderProps['onRemove'];
  onBlur?: TdCascaderProps['onBlur'];
  onFocus?: TdCascaderProps['onFocus'];
  onChange?: TdCascaderProps['onChange'];
}

// InputContent component interfaces
export interface InputContentProps extends StyledProps {
  cascaderContext: CascaderContextType;
  placeholder: TdCascaderProps['placeholder'];
  listeners: ListenersType;
  collapsedItems: TdCascaderProps['collapsedItems'];
}

export interface ContentProps {
  cascaderContext: CascaderContextType;
  placeholder: TdCascaderProps['placeholder'];
  listeners: InputContentProps['listeners'];
  collapsedItems: TdCascaderProps['collapsedItems'];
  isHover: boolean;
}

export interface InnerContentProps {
  cascaderContext: CascaderContextType;
  isHover: boolean;
  listeners: InputContentProps['listeners'];
  placeholder: TdCascaderProps['placeholder'];
  collapsedItems: TdCascaderProps['collapsedItems'];
}

export interface SuffixIconProps {
  closeShow: boolean;
  closeIconClass: string;
  fakeArrowIconClass: string;
  cascaderContext: CascaderContextType;
  listeners: InputContentProps['listeners'];
}

export interface CascaderItemProps {
  node: TreeNode;
  cascaderContext: CascaderContextType;
  onClick: (ctx: ContextType) => void;
  onChange: (ctx: ContextType | { e: boolean; node: TreeNode }) => void;
  onMouseEnter: (ctx: ContextType) => void;
}

export type ContextType = { e?: React.MouseEvent; node?: TreeNode };
export { TreeNode } from '../_common/js/tree/tree-node';
export type { TreeNodeValue } from '../_common/js/tree/types';
export type { TreeOptionData } from '../_common/js/common';
export type { TreeNodeModel } from '../tree';
