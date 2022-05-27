import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import { TreeNode, CascaderContextType, TreeNodeValue, CascaderProps } from '../interface';
import { isInPage } from './helper';

/**
 * icon Class
 * @param prefix
 * @param CLASSNAMES
 * @param cascaderContext
 * @returns
 */
export function getCloseIconClass(prefix: string, CLASSNAMES: any, cascaderContext: CascaderContextType) {
  const { visible, disabled } = cascaderContext;
  return [
    `${prefix}-cascader__icon`,
    {
      [CLASSNAMES.STATUS.visible]: visible,
      [CLASSNAMES.STATUS.disabled]: disabled,
    },
  ];
}

/**
 * icon Class
 * @param prefix
 * @param CLASSNAMES
 * @param cascaderContext
 * @returns
 */
export function getFakeArrowIconClass(prefix: string, CLASSNAMES: any, cascaderContext: CascaderContextType) {
  const { disabled } = cascaderContext;
  return [
    `${prefix}-cascader__icon`,
    {
      [CLASSNAMES.STATUS.disabled]: disabled,
    },
  ];
}

/**
 * Cascader外显div class
 * @param prefix
 * @param CLASSNAMES
 * @param cascaderContext
 * @returns
 */
export function getCascaderInnerClasses(prefix: string, CLASSNAMES: any, cascaderContext: CascaderContextType) {
  const { disabled, visible, size, multiple } = cascaderContext;
  return [
    `${prefix}-cascader`,
    {
      [CLASSNAMES.STATUS.disabled]: disabled,
      [CLASSNAMES.STATUS.active]: visible,
      [CLASSNAMES.SIZE[size]]: size,
      [`${prefix}-cascader--multiple`]: multiple,
    },
  ];
}

/**
 * closeIcon 是否显示
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getCloseShow(isHover: boolean, cascaderContext: CascaderContextType) {
  const { value, disabled, clearable, visible } = cascaderContext;
  return !!(!visible && clearable && isHover && !disabled && !isEmpty(value));
}

/**
 * Placeholder 是否显示
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getPlaceholderShow(
  cascaderContext: CascaderContextType,
  singleContent: string,
  multipleContent: TreeNode[],
) {
  const { filterable, visible, multiple } = cascaderContext;
  const valEmpty = !(multiple ? multipleContent.length : singleContent);
  if (filterable) {
    return valEmpty && !visible;
  }
  return valEmpty;
}

/**
 * 单选状态下内容
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getSingleContent(cascaderContext: CascaderContextType) {
  const { value, multiple, treeStore, showAllLevels } = cascaderContext;
  if (multiple || !value) return '';
  if (Array.isArray(value)) return '';
  const node = treeStore && treeStore.getNodes(value as TreeNodeValue | TreeNode);
  if (!(node && node.length)) {
    // 无匹配数据直接输出
    return value as string;
  }
  const path = node && node[0].getPath();
  if (path && path.length) {
    return showAllLevels ? path.map((node: TreeNode) => node.label).join(' / ') : path[path.length - 1].label;
  }
  return value as string;
}

/**
 * 多选状态下选中内容
 * @param isHover
 * @param cascaderContext
 * @returns
 */
export function getMultipleContent(cascaderContext: CascaderContextType) {
  const { value, multiple, treeStore } = cascaderContext;

  if (!multiple) return [];
  if (multiple && !Array.isArray(value)) return [];

  const node = treeStore && treeStore.getNodes(value as TreeNodeValue | TreeNode);
  if (!node) return [];

  const path = (value as TreeNodeValue[]).map((item: TreeNodeValue) => {
    const node = treeStore.getNodes(item);
    return node[0];
  });
  if (value && (value as TreeNodeValue[]).length) {
    return path && path.length ? path : (value as TreeNode[]);
  }
  return [];
}

/**
 * 点击popup outside副作用
 * @param ref
 * @param cascaderContext
 * @param event
 * @returns
 */
export function outerClickListenerEffect(
  ref: HTMLElement,
  cascaderContext: CascaderContextType,
  event: MouseEvent | TouchEvent,
) {
  const { visible, setVisible } = cascaderContext;
  const target = event.target as Node;
  // 可能点击的dom在判断的时候已经被移除了
  if (!visible || !ref || ref.contains(target) || !isInPage(target)) return;
  setVisible(false);
}

/**
 * closeIcon点击副作用
 * @param cascaderContext
 */
export function closeIconClickEffect(cascaderContext: CascaderContextType) {
  const { setVisible, multiple, setExpend, setValue } = cascaderContext;

  setVisible(false);

  // 手动设置的展开需要去除
  if (multiple) {
    setExpend([]);
  }

  setValue(multiple ? [] : '', 'clear');
}

/**
 * tag 关闭按钮点击副作用
 * @param cascaderContext
 */
export function handleRemoveTagEffect(
  cascaderContext: CascaderContextType,
  node: TreeNode,
  onRemove: CascaderProps['onRemove'],
) {
  const { disabled, setValue } = cascaderContext;

  if (disabled) return;
  const checked = node.setChecked(!node.isChecked());
  setValue(checked, 'uncheck', node.getModel());
  if (isFunction(onRemove)) {
    onRemove({ value: checked, node: node as any });
  }
}

/**
 * 外显content点击副作用
 * @param cascaderContext
 */
export function innerContentClickEffect(cascaderContext: CascaderContextType) {
  const { setVisible, visible, filterActive, disabled } = cascaderContext;

  if (!disabled) {
    if (visible && filterActive) return; // input filter is active
    setVisible(!visible);
  }
}
