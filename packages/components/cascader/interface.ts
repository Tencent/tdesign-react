import { TdCascaderProps, CascaderValue, CascaderChangeSource } from './type';
import { TdSelectInputProps } from '../select-input/type';
import TreeStore from '../../common/js/tree-v1/tree-store';
import TreeNode from '../../common/js/tree-v1/tree-node';
import { TreeNodeModel, TreeNodeValue } from '../../common/js/tree-v1/types';

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
}

export { TreeNode } from '../../common/js/tree-v1/tree-node';
export type { TreeNodeValue } from '../../common/js/tree-v1/types';
export type { TreeOptionData } from '../../common/js/common';
export type { TreeNodeModel } from '../tree';
export type { TdSelectInputProps } from '../select-input/type';

export const EVENT_NAME_WITH_KEBAB = ['remove', 'blur', 'focus'];
