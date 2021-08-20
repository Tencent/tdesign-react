import React, { forwardRef, MouseEvent, ReactNode } from 'react';
import classNames from 'classnames';
import TreeNode from '../_common/js/tree/tree-node';
import CaretRightSmallIcon from '../icon/icons/CaretRightSmallIcon';
import LoadingIcon from '../icon/icons/LoadingIcon';
import Checkbox from '../checkbox';
import { TreeItemProps } from './interface/TreeItemProps';
import { CLASS_NAMES } from './constants';

/**
 * 树节点组件
 */
const TreeItem = forwardRef((props: TreeItemProps, ref: React.Ref<HTMLDivElement>) => {
  const { node, icon, label, line, expandOnClickNode, activable, checkProps, operations, onClick, onChange } = props;
  const { level } = node;

  const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
    onClick?.(node, {
      event: evt,
      expand: expandOnClickNode,
      active: activable,
    });
  };

  const handleItemClick = (evt: MouseEvent) => {
    if (node.loading) {
      return;
    }
    onClick?.(node, {
      event: evt,
      expand: true,
      active: false,
    });
  };

  const handleIconClick = (evt: MouseEvent) => {
    evt.stopPropagation();
    handleItemClick(evt);
  };

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  /* ======== render ======= */
  const renderIcon = () => {
    const renderIconNode = () => {
      if (icon === false) {
        return null;
      }
      if (icon instanceof Function) {
        return icon(node.getModel());
      }
      if (React.isValidElement(icon)) {
        return icon;
      }
      if (icon && icon !== true) {
        // 非 ReactNode、Function、Boolean 类型，抛出错误提示
        throw new Error('invalid type of icon');
      }

      if (!node.isLeaf()) {
        if (node.loading && node.expanded) {
          return <LoadingIcon className={CLASS_NAMES.loading} />;
        }

        return <CaretRightSmallIcon className={CLASS_NAMES.treeIconRight} />;
      }
      return null;
    };

    const iconNode = renderIconNode();
    return (
      <span className={classNames(CLASS_NAMES.treeIcon, CLASS_NAMES.folderIcon)} onClick={handleIconClick}>
        {iconNode}
      </span>
    );
  };

  const renderLine = () => {
    const iconVisible = icon !== false;

    if (line === false) {
      return null;
    }

    if (line instanceof Function) {
      return line(node.getModel());
    }

    if (React.isValidElement(line)) {
      return line;
    }

    if (node.parent && node.tree) {
      // 如果节点的父节点，不是最后的节点
      // 则需要绘制节点延长线
      const shadowStyles: string[] = [];
      const parents = node.getParents();
      parents.pop();
      parents.forEach((pnode: TreeNode, index: number) => {
        if (!pnode.vmIsLast) {
          shadowStyles.push(`calc(-${index + 1} * var(--space)) 0 var(--color)`);
        }
      });

      const styles = {
        '--level': level,
        boxShadow: shadowStyles.join(','),
      };

      return (
        <span
          className={classNames(
            // 每个节点绘制抵达上一层级的折线
            CLASS_NAMES.line,
            {
              // 叶子节点，折线宽度延长，因为没有 icon 呈现
              // 任意节点，icon 不呈现时也是要延长折线宽度
              [CLASS_NAMES.lineIsLeaf]: node.vmIsLeaf || !iconVisible,
              // 分支首节点，到上一节点的折线高度要缩短，让位给 icon 呈现
              // 如果 icon 隐藏了，则不必缩短折线高度
              [CLASS_NAMES.lineIsFirst]: node.vmIsFirst && iconVisible,
            },
          )}
          style={styles as unknown}
          onClick={stopPropagation}
        />
      );
    }
    return null;
  };

  const renderLabel = () => {
    const emptyView = '暂无数据';
    let labelText: string | ReactNode = '';
    if (label instanceof Function) {
      labelText = label(node.getModel()) || emptyView;
    } else {
      labelText = node.label || emptyView;
    }

    const labelClasses = classNames(CLASS_NAMES.treeLabel, CLASS_NAMES.treeLabelStrictly, {
      [CLASS_NAMES.actived]: node.isActivable() ? node.actived : false,
    });

    if (node.isCheckable()) {
      return (
        <Checkbox
          // value={node.value}
          checked={node.checked}
          indeterminate={node.indeterminate}
          disabled={node.isDisabled()}
          name={String(node.value)}
          onChange={() => onChange(node)}
          className={labelClasses}
          {...checkProps}
        >
          <span date-target="label">{labelText}</span>
        </Checkbox>
      );
    }
    return (
      <span date-target="label" className={labelClasses}>
        <span style={{ position: 'relative' }}>{labelText}</span>
      </span>
    );
  };

  const renderOperations = () => {
    let operationsView = null;
    if (operations) {
      // ReactNode 类型处理
      if (React.isValidElement(operations)) {
        operationsView = operations;
      } else if (operations instanceof Function) {
        // Function 类型处理
        const treeNodeModel = node?.getModel();
        operationsView = operations(treeNodeModel);
      } else {
        // 非 ReactNode、Function 类型，抛出错误提示
        throw new Error('invalid type of operations');
      }
    }

    if (operationsView) {
      return (
        <span className={CLASS_NAMES.treeOperations} date-target="operations">
          {operationsView}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      ref={ref}
      data-value={node.value}
      data-level={level}
      className={classNames(CLASS_NAMES.treeNode, {
        [CLASS_NAMES.treeNodeOpen]: node.expanded,
        [CLASS_NAMES.actived]: node.isActivable() ? node.actived : false,
        [CLASS_NAMES.disabled]: node.isDisabled(),
      })}
      style={{ '--level': level } as any}
      onClick={handleClick}
    >
      {renderLine()}
      {renderIcon()}
      {renderLabel()}
      {renderOperations()}
    </div>
  );
});

TreeItem.displayName = 'TreeItem';

export default TreeItem;
