import React, { forwardRef } from 'react';
// import noop from '../_util/noop';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TreeItemProps } from './interface/TreeItemProps';
import { CLASS_NAMES } from './constants';
import TreeItemIcon from './components/TreeItemIcon';
import TreeItemContent from './components/TreeItemContent';

/**
 * 树节点组件
 */
const TreeItem = forwardRef((props: TreeItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { node, expandOnClickNode } = props;
  const { level, expanded, actived, visible, disabled } = node;

  const { classPrefix } = useConfig();

  /** *** methods **** **/
  const handleItemClick = () => {
    props.onClick(node);
  };

  const handleCheckboxChange = () => {
    props.onChange(node);
  };

  const treeNode = (
    <div
      ref={ref}
      className={classNames(CLASS_NAMES.treeNode, {
        [CLASS_NAMES.treeNodeOpen]: expanded,
        [CLASS_NAMES.actived]: actived,
        [CLASS_NAMES.treeNodeHidden]: !visible,
        [CLASS_NAMES.disabled]: disabled,
      })}
      /* eslint-disable */
      // @ts-ignore
      style={{ '--level': level }}
      onClick={expandOnClickNode ? handleItemClick : () => null}
    >
      { expandOnClickNode ?  <TreeItemIcon node={node} /> : <TreeItemIcon node={node} onClick={handleItemClick}/> }
      <TreeItemContent classNames={`${classPrefix}-tree__label`} node={node} onCheckboxChange={handleCheckboxChange} />
    </div>
  );

  return <>{treeNode}</>;
});

TreeItem.displayName = 'TreeItem';

export default TreeItem;
