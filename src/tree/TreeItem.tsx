import React, { forwardRef } from 'react';
// import noop from '../_util/noop';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import Checkbox from '../checkbox';
import { ArrowRightIcon, LoadingIcon } from '../icon';
import { TreeNode } from '../../common/js/tree/TreeNode';
import { TreeItemProps } from './TreeItemProps';

function renderItemIcon(node: TreeNode) {
  let icon = null;
  // 当前节点是叶子节点，不渲染 icon
  if (node.children && Array.isArray(node.children) && node.children.length === 0) {
    // 当前展开且需要加载状态
    if (node.loading && node.expanded) {
      icon = (
        <span className="t-tree__icon">
          <LoadingIcon />
        </span>
      );
    } else {
      icon = (
        <span className="t-tree__icon">
          <ArrowRightIcon />
        </span>
      );
    }
  } else {
    icon = <i className="t-icon"></i>;
  }
  return icon;
}

/**
 * 树节点组件
 */
const TreeItem = forwardRef((props: TreeItemProps, ref: React.Ref<HTMLDivElement>) => {
  /* eslint-disable */
  const {
    node,
    onClick,
    onChange,
  } = props;

  const { classPrefix } = useConfig();

  // value: 1, 1-1, 1-1-1
  const level = node.value.split('-').length - 1;

  const onItemClick = () => {
    onClick && onClick(node);
  }

  const onCheckboxChange = () => {
    onchange && onChange(node);
  }

  const renderItemContent = (classNames: string, node: TreeNode) => {
    if (node.checkable) {
      return (
        <Checkbox value={node.checked} indeterminate={node.indeterminate} disabled={node.disabled} name={node.value} onChange={onCheckboxChange}>
          {node.label}
        </Checkbox>
      );
    }
    return <span className={classNames}> {node.label}</span>;
  }

  const treeNode = (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-tree__item`, { [`${classPrefix}-tree__item--open`]: node.expand })}
      // @ts-ignore
      style={{ '--level': level }}
      onClick={onItemClick}
    >
      {renderItemIcon(node)}
      {renderItemContent(`${classPrefix}-tree__label`, node)}
    </div>
  );

  return <>{treeNode}</>;
});

TreeItem.displayName = 'TreeItem';

export default TreeItem;
