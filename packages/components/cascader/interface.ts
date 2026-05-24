import type TreeNode from '@tdesign/common-js/tree-v1/tree-node';
import type TreeStore from '@tdesign/common-js/tree-v1/tree-store';
import type { TreeNodeModel, TreeNodeValue, TypeTreeNodeData } from '@tdesign/common-js/tree-v1/types';
import type { TdSelectInputProps } from '../select-input/type';
import type { TreeOptionData } from './interface';
import type { CascaderChangeSource, CascaderValue, TdCascaderProps } from './type';

export * from './type';
export interface CascaderContextType
  extends Pick<
    TdCascaderProps,
    | 'size'
    | 'disabled'
    | 'checkStrictly'
    | 'lazy'
    | 'multiple'
    | 'filterable'
    | 'filter'
    | 'clearable'
    | 'checkProps'
    | 'showAllLevels'
    | 'max'
    | 'value'
    | 'minCollapsedNum'
    | 'valueType'
  > {
  treeStore: TreeStore;
  setValue: (val: CascaderValue, source: CascaderChangeSource, node?: TreeNodeModel) => void;
  visible: boolean;
  setVisible: TdSelectInputProps['onPopupVisibleChange'];
  treeNodes: TreeNode[];
  setTreeNodes: (val: CascaderValue) => void;
  inputVal: TdSelectInputProps['inputValue'];
  setInputVal: (val: TdSelectInputProps['inputValue']) => void;
  setExpend: (val: TreeNodeValue[]) => void;
  // 支持 filterable 与 checkStrictly 及valueMode = parentFirst 或 all 配合使用，展示非叶子节点的效果
  isParentFilterable: boolean;
}

export type { TdSelectInputProps } from '../select-input/type';
export type { TreeNodeModel } from '../tree';
export type { TreeOptionData } from '@tdesign/common-js/common';
export { TreeNode } from '@tdesign/common-js/tree-v1/tree-node';
export type { TreeNodeValue } from '@tdesign/common-js/tree-v1/types';

export const EVENT_NAME_WITH_KEBAB = ['remove', 'blur', 'focus'];

export type CascaderOption = TreeOptionData | TypeTreeNodeData;

export interface FilterState {
  filters: Record<number, string | ((node: CascaderOption, panelIndex: number) => boolean)>;
  maxLevel: number;
}

export type FilterValue = string | ((node: CascaderOption, panelIndex: number) => boolean);
