import React, { forwardRef, useImperativeHandle, useMemo, RefObject, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';

import TreeNode from '../_common/js/tree/tree-node';
import { TreeOptionData, StyledProps, ComponentScrollToElementParams } from '../common';
import { TreeItemProps } from './interface';
import TreeItem from './TreeItem';

import useTreeState from './hooks/useTreeState';
import useTreeStore from './hooks/useTreeStore';
import { useTreeConfig } from './hooks/useTreeConfig';
import { TreeDraggableContext } from './hooks/TreeDraggableContext';
import parseTNode from '../_util/parseTNode';
import useTreeVirtualScroll from './hooks/useTreeVirtualScroll';

import type { TreeNodeState, TreeNodeValue, TypeTreeNodeData, TypeTreeNodeModel } from '../_common/js/tree/types';
import type { TreeInstanceFunctions, TdTreeProps } from './type';

export type TreeProps = TdTreeProps & StyledProps;

const Tree = forwardRef((props: TreeProps, ref: React.Ref<TreeInstanceFunctions>) => {
  const { treeClassNames, transitionNames, transitionClassNames, transitionDuration, locale } = useTreeConfig();

  const {
    empty,
    activable,
    disabled,
    checkable,
    checkProps,
    disableCheck,
    hover,
    icon,
    line,
    label,
    operations,
    transition, // 动画默认开启
    expandOnClickNode,
    onClick,
    scroll,
    className,
    style,
  } = props;

  // 国际化文本初始化
  const emptyText = locale('empty');

  const treeRef = useRef(null);

  const {
    value,
    setChecked,
    toggleChecked,
    expanded,
    setExpanded,
    toggleExpanded,
    setActived,
    actived,
    toggleActived,
    updateState,
    visibleNodes,
    allNodes,
  } = useTreeState(props);

  const { store } = useTreeStore(props, { value, expanded, actived, updateState });

  const {
    visibleData,
    isVirtual,
    treeNodeStyle: virtualTreeNodeStyle,
    cursorStyle,
    handleRowMounted,
    handleScrollToElement,
  } = useTreeVirtualScroll({
    treeRef,
    scroll,
    data: allNodes,
  });

  const handleItemClick: TreeItemProps['onClick'] = (node, options) => {
    if (!node) {
      return;
    }
    const isDisabled = disabled || node.disabled;
    const { expand, active, e, trigger } = options;
    if (expand) toggleExpanded(node, { e, trigger });

    if (active && !isDisabled) {
      toggleActived(node, { e, trigger: 'node-click' });
      const treeNodeModel = node?.getModel();
      onClick?.({ node: treeNodeModel, e });
    }
  };

  const handleChange: TreeItemProps['onChange'] = (node, ctx) => {
    if (!node || disabled || node.disabled) {
      return;
    }
    toggleChecked(node, { ...ctx, trigger: 'node-click' });
  };

  // treeRef expose methods
  useImperativeHandle<unknown, TreeInstanceFunctions>(
    ref,
    () => ({
      store,
      scrollTo: (p: ComponentScrollToElementParams) => handleScrollToElement(p), // 指定滚动到具体节点
      appendTo(value, newData) {
        let list = [];
        if (Array.isArray(newData)) {
          list = newData;
        } else {
          list = [newData];
        }
        list.forEach((item) => {
          store.appendNodes(value, item);
        });
      },
      getIndex(value: TreeNodeValue): number {
        return store.getNodeIndex(value);
      },
      getItem(value: TreeNodeValue): TypeTreeNodeModel {
        const node: TreeNode = store.getNode(value);
        return node?.getModel();
      },
      getItems(value?: TreeNodeValue): TypeTreeNodeModel[] {
        const nodes = store.getNodes(value);
        return nodes.map((node: TreeNode) => node.getModel());
      },
      getParent(value: TreeNodeValue): TypeTreeNodeModel {
        const node = store.getParent(value);
        return node?.getModel();
      },
      getParents(value: TreeNodeValue): TypeTreeNodeModel[] {
        const nodes = store.getParents(value);
        return nodes.map((node: TreeNode) => node.getModel());
      },
      getPath(value: TreeNodeValue): TypeTreeNodeModel[] {
        const node = store.getNode(value);
        let pathNodes = [];
        if (node) {
          pathNodes = node.getPath().map((node: TreeNode) => node.getModel());
        }
        return pathNodes;
      },
      insertAfter(value: TreeNodeValue, newData: TreeOptionData): void {
        return store.insertAfter(value, newData as TypeTreeNodeData);
      },
      insertBefore(value: TreeNodeValue, newData: TreeOptionData): void {
        return store.insertBefore(value, newData as TypeTreeNodeData);
      },
      remove(value: TreeNodeValue): void {
        return store.remove(value);
      },
      setItem(value: TreeNodeValue, options: TreeNodeState): void {
        const node: TreeNode = this.store.getNode(value);
        const spec = options;
        if (node && spec) {
          if ('expanded' in options) {
            toggleExpanded(node, { trigger: 'setItem' });
            delete spec.expanded;
          }
          if ('actived' in options) {
            toggleActived(node, { trigger: 'setItem' });
            delete spec.actived;
          }
          if ('checked' in options) {
            toggleChecked(node, { trigger: 'setItem' });
            delete spec.checked;
          }
          node.set(spec);
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, setExpanded, setActived, setChecked, handleScrollToElement],
  );

  /* ======== render ======= */
  // https://github.com/reactjs/react-transition-group/issues/668
  // CSSTransition 不指定 nodeRef 的时候会使用 findDOMNode 获取 dom
  // 因为 CSSTransition 是个数组，与 visibleNodes 对应，所以这里根据 visibleNodes 的长度创建 ref 用来保存 dom
  // visibleNodes 改变的时候，释放上一个 nodeList，防止内存泄漏
  const nodeList = useMemo<RefObject<HTMLDivElement>[]>(
    () => visibleNodes.map(() => React.createRef()),
    [visibleNodes],
  );

  const renderEmpty = () => parseTNode(empty, null, emptyText);

  const renderItems = (renderNode: TreeNode[]) => {
    if (renderNode.length <= 0) {
      return renderEmpty();
    }
    if (isVirtual)
      return (
        <div className={treeClassNames.treeList} style={virtualTreeNodeStyle}>
          {renderNode.map((node, index) => (
            <TreeItem
              ref={nodeList[index]}
              key={node.value}
              node={node}
              empty={empty}
              icon={icon}
              label={label}
              line={line}
              transition={transition}
              expandOnClickNode={expandOnClickNode}
              activable={activable}
              operations={operations}
              checkProps={checkProps}
              disableCheck={disableCheck}
              onClick={handleItemClick}
              onChange={handleChange}
              onTreeItemMounted={handleRowMounted}
              isVirtual={isVirtual}
            />
          ))}
        </div>
      );

    return (
      <TransitionGroup name={transitionNames.treeNode} className={treeClassNames.treeList}>
        {renderNode.map((node, index) => (
          // https://github.com/reactjs/react-transition-group/issues/668
          <CSSTransition
            nodeRef={nodeList[index]}
            key={node.value}
            timeout={transitionDuration}
            classNames={transitionClassNames}
          >
            <TreeItem
              ref={nodeList[index]}
              node={node}
              empty={empty}
              icon={icon}
              label={label}
              line={line}
              transition={transition}
              expandOnClickNode={expandOnClickNode}
              activable={activable}
              operations={operations}
              checkProps={checkProps}
              disableCheck={disableCheck}
              onClick={handleItemClick}
              onChange={handleChange}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  };

  const draggable = useMemo(
    () => ({
      props,
      store,
    }),
    [props, store],
  );

  return (
    <TreeDraggableContext.Provider value={draggable}>
      <div
        className={classNames(treeClassNames.tree, className, {
          [treeClassNames.disabled]: disabled,
          [treeClassNames.treeHoverable]: hover,
          [treeClassNames.treeCheckable]: checkable,
          [treeClassNames.treeFx]: transition,
          [treeClassNames.treeBlockNode]: expandOnClickNode,
          [treeClassNames.treeVscroll]: props.scroll, // 开启虚拟滚动就要有 overflow, 否则低于 threshold 无法正常运行 scrollTo
        })}
        style={style}
        ref={treeRef}
      >
        {isVirtual ? (
          <>
            <div className={treeClassNames.treeVscrollCursor} style={cursorStyle} />
            {renderItems(visibleData)}
          </>
        ) : (
          renderItems(visibleNodes)
        )}
      </div>
    </TreeDraggableContext.Provider>
  );
});

Tree.displayName = 'Tree';

Tree.defaultProps = {
  data: [],
  expandLevel: 0,
  icon: true,
  line: false,
  transition: true,
  lazy: true,
  valueMode: 'onlyLeaf',
};

export default Tree;
