import React, {
  CSSProperties,
  DragEventHandler,
  forwardRef,
  MouseEvent,
  ReactNode,
  useRef,
  DragEvent,
  isValidElement,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';
import { CaretRightSmallIcon as TdCaretRightSmallIcon } from 'tdesign-icons-react';
import TreeNode from '@tdesign/common-js/tree-v1/tree-node';
import type { TypeTreeNodeData } from '@tdesign/common-js/tree-v1/types';
import Loading from '../loading';
import useRipple from '../hooks/useRipple';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useGlobalIcon from '../hooks/useGlobalIcon';
import Checkbox from '../checkbox';
import { useTreeConfig } from './hooks/useTreeConfig';
import useDraggable from './hooks/useDraggable';
import composeRefs from '../_util/composeRefs';
import useConfig from '../hooks/useConfig';

import type { CheckboxProps } from '../checkbox'
import type { TdTreeProps } from './type';
import type { TreeItemProps } from './interface';

/**
 * 树节点组件
 */
const TreeItem = forwardRef(
  (
    props: TreeItemProps & {
      onTreeItemMounted?: (rowData: { ref: HTMLElement; data: TreeNode }) => void;
      isVirtual?: boolean;
      keys: TdTreeProps['keys'];
      allowDrop?: TdTreeProps['allowDrop'];
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const {
      node,
      icon,
      label,
      line,
      expandOnClickNode,
      activable,
      checkProps,
      disableCheck,
      operations,
      onClick,
      onChange,
      isVirtual,
      onTreeItemMounted,
      allowDrop,
    } = props;

    const { CaretRightSmallIcon } = useGlobalIcon({
      CaretRightSmallIcon: TdCaretRightSmallIcon,
    });
    const { level } = node;
    const nodeRef = useRef<HTMLDivElement>(null);

    const { treeClassNames, locale } = useTreeConfig();
    const { classPrefix } = useConfig();

    useEffect(() => {
      onTreeItemMounted?.({ ref: nodeRef.current, data: node });
    }, [isVirtual, nodeRef, node, onTreeItemMounted]);

    const handleClick = (evt: MouseEvent<HTMLDivElement>) => {
      const srcTarget = evt.target as HTMLElement;
      const isBranchTrigger =
        node.children &&
        expandOnClickNode &&
        (srcTarget.className === `${classPrefix}-checkbox__input` || srcTarget.tagName.toLowerCase() === 'input');

      if (isBranchTrigger) return;

      // 处理expandOnClickNode时与checkbox的选中的逻辑冲突
      if (expandOnClickNode && node.children && srcTarget.className?.indexOf?.(`${classPrefix}-tree__label`) !== -1)
        evt.preventDefault();

      onClick?.(node, {
        e: evt,
        expand: expandOnClickNode,
        active: activable,
        trigger: 'node-click',
      });
    };

    const handleItemClick = (evt: MouseEvent<HTMLDivElement>) => {
      if (node.loading) {
        return;
      }
      onClick?.(node, {
        e: evt,
        expand: true,
        active: false,
        trigger: 'icon-click',
      });
    };

    const handleIconClick = (evt: MouseEvent<HTMLDivElement>) => {
      if (!icon) return;
      evt.stopPropagation();
      handleItemClick(evt);
    };

    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation();
    };

    /* ======== render ======= */
    const renderIcon = () => {
      // 这里按 vue 的逻辑定义
      let isDefaultIcon = false;
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
          isDefaultIcon = true;
          if (node.loading && node.expanded) {
            return <Loading loading={true} />;
          }

          return <CaretRightSmallIcon className={treeClassNames.treeIconRight} />;
        }
        return null;
      };

      const iconNode = renderIconNode();
      return (
        <span
          className={classNames(treeClassNames.treeIcon, treeClassNames.folderIcon, {
            [treeClassNames.treeIconDefault]: isDefaultIcon,
          })}
          onClick={handleIconClick}
        >
          {iconNode}
        </span>
      );
    };

    const renderLine = () => {
      const iconVisible = icon !== false;

      if (line === false) {
        return null;
      }

      if (isFunction(line)) {
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
              treeClassNames.line,
              {
                // 叶子节点，折线宽度延长，因为没有 icon 呈现
                // 任意节点，icon 不呈现时也是要延长折线宽度
                [treeClassNames.lineIsLeaf]: node.vmIsLeaf || !iconVisible,
                // 分支首节点，到上一节点的折线高度要缩短，让位给 icon 呈现
                // 如果 icon 隐藏了，则不必缩短折线高度
                [treeClassNames.lineIsFirst]: node.vmIsFirst && iconVisible,
              },
            )}
            style={styles}
            onClick={stopPropagation}
          />
        );
      }
      return null;
    };

    // 使用 斜八角动画
    const [labelDom, setRefCurrent] = useDomRefCallback();
    useRipple(labelDom);

    // setData需要强制刷新组件来更新数据
    const [, updateRender] = useState({});

    const renderLabel = () => {
      const emptyView = locale('empty');
      let labelText: string | ReactNode = '';
      if (label instanceof Function) {
        const { setData: nodeSetData, ...rest } = node.getModel();
        labelText =
          label({
            ...rest,
            // 拦截setData render tree-item
            setData: (value: TypeTreeNodeData) => {
              nodeSetData(value);
              updateRender({});
            },
          }) || emptyView;
      } else {
        labelText = node.label || emptyView;
      }

      const labelClasses = classNames(treeClassNames.treeLabel, treeClassNames.treeLabelStrictly, {
        [treeClassNames.actived]: node.isActivable() ? node.actived : false,
      });

      if (node.isCheckable()) {
        let checkboxDisabled: boolean;
        if (typeof disableCheck === 'function') {
          checkboxDisabled = disableCheck(node.getModel());
        } else {
          checkboxDisabled = !!disableCheck;
        }

        if (node.isDisabled()) {
          checkboxDisabled = true;
        }

        let checkboxProps: CheckboxProps;
        if (typeof checkProps === 'function') {
          checkboxProps = checkProps(node.getModel());
        } else {
          checkboxProps = checkProps;
        }

        return (
          <Checkbox
            ref={setRefCurrent}
            checked={node.checked}
            indeterminate={node.indeterminate}
            disabled={checkboxDisabled}
            name={String(node.value)}
            onChange={(checked, ctx) => onChange(node, ctx)}
            className={labelClasses}
            stopLabelTrigger={expandOnClickNode && !!node.children}
            {...checkboxProps}
          >
            <span date-target="label">{labelText}</span>
          </Checkbox>
        );
      }
      return (
        <span
          ref={setRefCurrent}
          date-target="label"
          className={labelClasses}
          // label 可以传入 ReactNode， 如果直接取里面的 children 值，当多层级的时候会有问题
          // 所以这里判断如果 label是 ReactNode， 并且 text没有值 就不展示 title
          title={isValidElement(node.label) && !node.data?.text ? '' : String(node.data?.text || node.label)}
        >
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
          <span className={treeClassNames.treeOperations} date-target="operations">
            {operationsView}
          </span>
        );
      }
      return null;
    };

    const { setDragStatus, isDragging, dropPosition, isDragOver } = useDraggable({
      node,
      nodeRef,
      allowDrop,
    });

    const handleDragStart: DragEventHandler<HTMLDivElement> = (evt: DragEvent<HTMLDivElement>) => {
      const { node } = props;
      if (!node.isDraggable()) return;
      evt.stopPropagation();
      setDragStatus('dragStart', evt);

      try {
        // ie throw error firefox-need-it
        evt.dataTransfer?.setData('text/plain', '');
      } catch (e) {
        // empty
      }
    };
    const handleDragEnd: DragEventHandler<HTMLDivElement> = (evt: DragEvent<HTMLDivElement>) => {
      const { node } = props;
      if (!node.isDraggable()) return;
      evt.stopPropagation();
      setDragStatus('dragEnd', evt);
    };
    const handleDragOver: DragEventHandler<HTMLDivElement> = (evt: DragEvent<HTMLDivElement>) => {
      const { node } = props;
      if (!node.isDraggable()) return;
      evt.stopPropagation();
      evt.preventDefault();
      setDragStatus('dragOver', evt);
    };
    const handleDragLeave: DragEventHandler<HTMLDivElement> = (evt: DragEvent<HTMLDivElement>) => {
      const { node } = props;
      if (!node.isDraggable()) return;
      evt.stopPropagation();
      setDragStatus('dragLeave', evt);
    };
    const handleDrop: DragEventHandler<HTMLDivElement> = (evt: DragEvent<HTMLDivElement>) => {
      const { node } = props;

      if (!node.isDraggable()) return;
      evt.stopPropagation();
      evt.preventDefault();
      setDragStatus('drop', evt);
    };
    const childrenKey = props.keys?.children || 'children';

    return (
      <div
        ref={composeRefs(ref, nodeRef)}
        data-value={node.value}
        data-level={level}
        className={classNames(treeClassNames.treeNode, {
          [treeClassNames.treeNodeOpen]:
            node.expanded &&
            (typeof node.data[childrenKey] === 'boolean'
              ? node.data[childrenKey]
              : node.data[childrenKey] !== undefined),
          [treeClassNames.actived]: node.isActivable() ? node.actived : false,
          [treeClassNames.disabled]: node.isDisabled(),
          [treeClassNames.treeNodeDraggable]: node.isDraggable(),
          [treeClassNames.treeNodeDragging]: isDragging,
          [treeClassNames.treeNodeDragTipTop]: isDragOver && dropPosition < 0,
          [treeClassNames.treeNodeDragTipBottom]: isDragOver && dropPosition > 0,
          [treeClassNames.treeNodeDragTipHighlight]: !isDragging && isDragOver && dropPosition === 0,
        })}
        style={
          {
            '--level': level,
            boxShadow: '',
          } as CSSProperties
        }
        onClick={handleClick}
        draggable={node.isDraggable()}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {renderLine()}
        {renderIcon()}
        {renderLabel()}
        {renderOperations()}
      </div>
    );
  },
);

TreeItem.displayName = 'TreeItem';

export default TreeItem;
