import { PATH_SEPARATOR } from '@tdesign/common-js/tree-v1/tree-node-model';
import { isEmpty } from 'lodash-es';

import type {
  CascaderContextType,
  CascaderValue,
  TdCascaderProps,
  TreeNode,
  TreeNodeValue,
  TreeOptionData,
} from '../interface';

/**
 * 单选状态下内容
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getSingleContent(cascaderContext: CascaderContextType): string {
  const { value, multiple, treeStore, showAllLevels, valueType } = cascaderContext;

  const isEmpty = (!value && value !== 0) || (Array.isArray(value) && value.length === 0);
  const isInvalidFullPathValue = valueType === 'full' && !Array.isArray(value);
  if (multiple || isEmpty || isInvalidFullPathValue) return '';

  const formatContent = (path: TreeNode[]) => {
    if (!path?.length) return '';
    return showAllLevels ? path.map((node) => node.label).join(` ${PATH_SEPARATOR} `) : path[path.length - 1].label;
  };

  const getDefaultDisplay = (val: any) => (Array.isArray(val) ? val.join(` ${PATH_SEPARATOR} `) : String(val));

  // valueType = 'full'
  if (valueType === 'full' && Array.isArray(value) && value.length > 0) {
    const node = treeStore?.getNode(value as string[]);
    const path = node?.getPath();
    return path?.length ? formatContent(path) : getDefaultDisplay(value);
  }

  // valueType = 'single'
  const nodes = treeStore?.getNodes(value as TreeNodeValue | TreeNode);
  if (!nodes?.length) {
    return getDefaultDisplay(value);
  }

  const path = nodes[0].getPath();
  return path?.length ? formatContent(path) : getDefaultDisplay(value);
}

/**
 * 多选状态下选中内容
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getMultipleContent(cascaderContext: CascaderContextType) {
  const { value, multiple, treeStore, showAllLevels, valueType } = cascaderContext;

  if (!multiple) return [];
  if (multiple && !Array.isArray(value)) return [];

  return (value as TreeNodeValue[])
    .map((item: TreeNodeValue) => {
      let node: TreeNode | undefined;
      // valueType='full' 时，item 是路径数组，使用 getNode 获取节点
      if (valueType === 'full' && Array.isArray(item)) {
        node = treeStore?.getNode(item as string[]);
      } else {
        const nodes = treeStore?.getNodes(item);
        node = nodes?.[0];
      }
      if (!node) return undefined;
      return showAllLevels ? getFullPathLabel(node) : node?.label;
    })
    .filter((item) => !!item);
}

/**
 * 面板数据计算方法
 * @param treeNodes
 * @returns
 */
export function getPanels(treeNodes: CascaderContextType['treeNodes']) {
  const panels: TreeNode[][] = [];
  treeNodes.forEach((node: TreeNode) => {
    if (panels[node.level]) {
      panels[node.level].push(node);
    } else {
      panels[node.level] = [node];
    }
  });
  return panels;
}

/**
 * 获取node的全部路径
 * @param node
 * @returns
 */
export function getFullPathLabel(node: TreeNode, separator = '/') {
  return node
    ?.getPath()
    .map((node: TreeNode) => node.label)
    .join(separator);
}

/**
 * treeValue计算方法
 * @param value
 * @returns
 */
export const getTreeValue = (value: CascaderContextType['value']) => {
  let treeValue: TreeNodeValue[] = [];
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object') {
      treeValue = (value as TreeOptionData[]).map((val) => val.value);
    } else if (value.length) {
      treeValue = value as TreeNodeValue[];
    }
  } else if (value) {
    if (typeof value === 'object') {
      treeValue = [(value as TreeOptionData).value];
    } else {
      treeValue = [value];
    }
  }
  return treeValue;
};

/**
 * 获取用于展开的节点值
 */
export const getExpandValue = (value: CascaderContextType['value'], valueType?: TdCascaderProps['valueType']) => {
  if (valueType === 'full' && Array.isArray(value) && value.length > 0) {
    // valueType='full' 时，value 是完整路径数组
    // 返回最后一个值用于展开
    return value[value.length - 1] as TreeNodeValue;
  }
  const treeValue = getTreeValue(value);
  return treeValue[0];
};

/**
 * 空值校验
 * 补充value为Number时的空值校验逻辑，排除NaN
 * @param value
 * @returns
 */
export function isEmptyValues(value: unknown): boolean {
  if (typeof value === 'number' && !isNaN(value)) return false;
  return isEmpty(value);
}

/**
 * 初始化数据校验
 * @param value
 * @param cascaderContext
 * @returns boolean
 */
export function isValueInvalid(value: CascaderValue, cascaderContext: CascaderContextType) {
  const { multiple, showAllLevels } = cascaderContext;
  return (multiple && !Array.isArray(value)) || (!multiple && Array.isArray(value) && !showAllLevels);
}
