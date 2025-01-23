import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
  RefObject,
  MouseEvent,
  useRef,
  useCallback,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import get from 'lodash/get';

import TreeNode from '../_common/js/tree-v1/tree-node';
import { TreeOptionData, StyledProps, ComponentScrollToElementParams } from '../common';
import { TreeItemProps } from './interface';
import TreeItem from './TreeItem';
import log from '../_common/js/log';

import useControllable from './hooks/useControllable';
import { useStore } from './hooks/useStore';
import { useTreeConfig } from './hooks/useTreeConfig';
import { TreeDraggableContext } from './hooks/TreeDraggableContext';
import parseTNode from '../_util/parseTNode';
import { usePersistFn } from '../hooks/usePersistFn';
import useTreeVirtualScroll from './hooks/useTreeVirtualScroll';

import type { TreeNodeState, TreeNodeValue, TypeTreeNodeData, TypeTreeNodeModel } from '../_common/js/tree-v1/types';
import type { TreeInstanceFunctions, TdTreeProps } from './type';
import useDefaultProps from '../hooks/useDefaultProps';

export type TreeProps = TdTreeProps & StyledProps;

const Tree = forwardRef<TreeInstanceFunctions<TreeOptionData>, TreeProps>((originalProps, ref) => {
  const { treeClassNames, transitionNames, transitionClassNames, transitionDuration, locale } = useTreeConfig();
  const props = useDefaultProps<TreeProps>(originalProps, {
    data: [],
    expandLevel: 0,
    icon: true,
    line: false,
    transition: true,
    lazy: true,
    valueMode: 'onlyLeaf',
  });

  // 可见节点集合
  const [visibleNodes, setVisibleNodes] = useState([]);
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
    allowDrop,
    onScroll,
  } = props;

  const { value, onChange, expanded, onExpand, onActive, actived, setTreeIndeterminate, indeterminate } =
    useControllable(props);

  // 国际化文本初始化
  const emptyText = locale('empty');

  const store = useStore(
    {
      ...props,
      value,
      onChange,
      expanded,
      onExpand,
      onActive,
      actived,
      indeterminate,
      setTreeIndeterminate,
    },
    initial,
  );

  function initial() {
    const nodes = store?.getNodes();
    const newVisibleNodes = nodes?.filter((node) => node.visible);
    setVisibleNodes(newVisibleNodes);
  }
  // 因为是被 useImperativeHandle 依赖的方法，使用 usePersistFn 变成持久化的。或者也可以使用 useCallback
  const setExpanded = usePersistFn(
    (
      node: TreeNode,
      isExpanded: boolean,
      ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
    ) => {
      const { e, trigger } = ctx;
      const expanded = node.setExpanded(isExpanded);
      const treeNodeModel = node?.getModel();
      (e || trigger) && onExpand?.(expanded, { node: treeNodeModel, e, trigger });
      return expanded;
    },
  );

  // 因为是被 useImperativeHandle 依赖的方法，使用 usePersistFn 变成持久化的。或者也可以使用 useCallback
  const setIndeterminate = usePersistFn(
    (
      node: TreeNode,
      isIndeterminate: boolean,
      ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'icon-click' | 'setItem' },
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { e, trigger } = ctx;
      const indeterminate = node.setIndeterminate(isIndeterminate);
      return indeterminate;
    },
  );

  const treeRef = useRef(null);

  const {
    visibleData,
    isVirtual,
    treeNodeStyle: virtualTreeNodeStyle,
    cursorStyle,
    handleRowMounted,
    scrollToElement,
  } = useTreeVirtualScroll({
    treeRef,
    scroll,
    data: visibleNodes,
    onScroll,
  });

  const setActived = usePersistFn(
    (
      node: TreeNode,
      isActived: boolean,
      ctx: { e?: MouseEvent<HTMLDivElement>; trigger: 'node-click' | 'setItem' },
    ) => {
      const actived = node.setActived(isActived);
      const treeNodeModel = node?.getModel();
      onActive?.(actived, { node: treeNodeModel, ...ctx });
      return actived;
    },
  );

  const setChecked = usePersistFn(
    (node: TreeNode, isChecked: boolean, ctx: { e?: any; trigger: 'node-click' | 'setItem' }) => {
      const checked = node.setChecked(isChecked);
      const treeNodeModel = node?.getModel();
      onChange?.(checked, { node: treeNodeModel, ...ctx });
      return checked;
    },
  );

  const handleItemClick: TreeItemProps['onClick'] = (node, options) => {
    if (!node) {
      return;
    }
    const isDisabled = disabled || node.disabled;
    const { expand, active, e, trigger } = options;
    if (expand) setExpanded(node, !node.isExpanded(), { e, trigger });

    if (!isDisabled) {
      const treeNodeModel = node?.getModel();
      if (active) {
        setActived(node, !node.isActived(), { e, trigger: 'node-click' });
        onClick?.({ node: treeNodeModel, e });
      } else {
        onClick?.({ node: treeNodeModel, e });
      }
    }
  };

  const handleChange: TreeItemProps['onChange'] = (node, ctx) => {
    if (!node || disabled || node.disabled) {
      return;
    }
    setChecked(node, !node.isChecked(), { ...ctx, trigger: 'node-click' });
  };
  const handleScrollToElement = useCallback(
    (params: ComponentScrollToElementParams) => {
      let { index } = params;

      if (!index && index !== 0) {
        if (!params.key) {
          log.error('Tree', 'scrollToElement: one of `index` or `key` must exist.');
          return;
        }
        const data = visibleNodes;
        index = data?.findIndex((item) => [get(item.data, 'key'), get(item.data, 'value')].includes(params.key));
        if (index < 0) {
          log.error('Tree', `${params.key} does not exist in data, check \`key\` or \`data\` please.`);
        }
      }
      scrollToElement({ ...params, index });
    },
    [scrollToElement, visibleNodes],
  );
  /** 对外暴露的公共方法 * */
  useImperativeHandle<unknown, TreeInstanceFunctions>(
    ref,
    () => ({
      store,
      scrollTo: (p: ComponentScrollToElementParams) => handleScrollToElement(p),
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
            setExpanded(node, spec.expanded, { trigger: 'setItem' });
            delete spec.expanded;
          }
          if ('actived' in options) {
            setActived(node, spec.actived, { trigger: 'setItem' });
            delete spec.actived;
          }
          if ('checked' in options) {
            setChecked(node, spec.checked, { trigger: 'setItem' });
            delete spec.checked;
          }
          if ('indeterminate' in options) {
            // @ts-ignore
            setTreeIndeterminate((prevIndeterminate: TreeNodeValue[]) => [...prevIndeterminate, value]);
            setIndeterminate(node, spec.indeterminate, { trigger: 'setItem' });
            delete spec.indeterminate;
          }
          node.set(spec);
        }
      },
    }),
    [store, setExpanded, setActived, setTreeIndeterminate, setChecked, setIndeterminate, handleScrollToElement],
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
              keys={props.keys}
              empty={empty}
              icon={icon}
              label={label}
              line={line}
              allowDrop={allowDrop}
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
              keys={props.keys}
              empty={empty}
              icon={icon}
              label={label}
              line={line}
              allowDrop={allowDrop}
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
          [treeClassNames.treeVscroll]: props.scroll, // 开启虚拟滚动就要有overflow 否则低于 threshold 无法正常运行 scrollto
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

export default Tree;
