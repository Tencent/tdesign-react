import { isEmpty } from 'lodash-es';
import { PATH_SEPARATOR } from '@tdesign/common-js/tree-v1/tree-node-model';

import type {
  CascaderContextType,
  CascaderValue,
  FilterValue,
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
  const { multiple, showAllLevels, valueType } = cascaderContext;

  // 多选模式：
  // value 必须是数组
  if (multiple) {
    return !Array.isArray(value);
  }

  // 单选模式：
  // valueType === 'full' 时，使用完整路径数组
  if (valueType === 'full') {
    return !Array.isArray(value);
  }

  // 其它情况默认 value 为非数组
  // 若是数组，仅在 showAllLevels=true 时合法
  if (Array.isArray(value)) {
    return !showAllLevels;
  }

  return false;
}

/**
 * 面板过滤未激活时的标识值
 * 用于 FilterState.maxLevel 的初始/重置态，表示当前没有任何面板处于过滤生效状态
 */
export const FILTER_INACTIVE_LEVEL = -1;

/**
 * 判断节点 label 是否匹配关键词
 * 用于 columnHeader/columnFooter 通过字符串关键词过滤当前面板的选项时
 * @param option 待匹配的树节点
 * @param keyword 已 trim 并转小写的关键词
 * @returns 是否命中关键词
 */
export function checkOptionMatchKeyword(option: TreeNode, keyword: string): boolean {
  if (!option.label || !keyword) return false;
  return option.label.toLowerCase().includes(keyword);
}

/**
 * 判断给定的面板层级是否处于过滤激活状态
 * 与 FILTER_INACTIVE_LEVEL 对比，level 为 -1 时视为未激活
 * @param level 面板层级（FilterState.maxLevel）
 * @returns 当前层级是否处于激活的过滤状态
 */
export function isFilterLevelActive(level: number): boolean {
  return level !== FILTER_INACTIVE_LEVEL;
}

/**
 * 判断单个 filter 值是否生效
 * @param filter 单个面板的过滤值（关键词或自定义判定函数）
 * @returns filter 是否生效
 */
export function isFilterActive(filter: FilterValue | undefined): boolean {
  if (filter === undefined) return false;
  if (typeof filter === 'string') return Boolean(filter.trim());
  return true;
}

/**
 * 根据 filter 对指定面板的节点进行过滤
 * @param nodes 当前面板的全部节点
 * @param filter 当前面板生效的过滤值（关键词或自定义判定函数）
 * @param panelIndex 当前面板在多级面板中的索引（从 0 开始）
 * @returns 过滤后剩余的节点列表
 */
export function filterOptions(nodes: TreeNode[], filter: FilterValue, panelIndex: number): TreeNode[] {
  if (typeof filter === 'string') {
    const keyword = filter.trim().toLowerCase();
    if (!keyword) return nodes;
    return nodes.filter((node) => checkOptionMatchKeyword(node, keyword));
  }
  return nodes.filter((node) => filter(node.data, panelIndex));
}
