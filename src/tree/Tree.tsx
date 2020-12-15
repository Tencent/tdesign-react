import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import noop from '../_util/noop';
// import { Icon } from '../icon';
// import useConfig from '../_util/useConfig';
import classNames from 'classnames';
import TreeNode from '../../common/js/tree/TreeNode';
import { TreeStore, TreeFilterOptions } from '../../common/js/tree/TreeStore';
import { TreeProps } from './interface/TreeProps';
import { EventState } from './interface/EventState';

import { CLASS_NAMES, transitionClassNames, transitionDuration } from './constants';

import TreeItem from './components/TreeItem';
import { handleUpdate, handleLoad, handleChange, handleClick, setExpanded, setActived, setChecked } from './util';

/**
 * 树组件
 */
/* eslint-disable */
const Tree = forwardRef((props: TreeProps, ref: React.Ref<HTMLDivElement>) => {
  // const { classPrefix } = useConfig();
  // const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  // const [treeItems, setTreeItems] = useState([]);
  // const [isTransition, setIsTransition] = useState(false);

  // 可见节点集合
  const [visibleNodes, setVisibleNodes] = useState([]);

  const {
    data,
    empty,
    keys,
    expandAll,
    expandParent,
    defaultExpanded,
    expanded,
    expandLevel,
    expandMutex,
    activable,
    activeMultiple,
    actived,
    disabled,
    checkable,
    defaultValue,
    value,
    checkProps,
    checkStrictly,
    hover,
    icon,
    line,
    load,
    lazy,
    valueMode,
    label,
    operations,
    transition = true, // 动画默认开启
    expandOnClickNode,
    children,
    filter,
    scrollTo,
    setItem,
    getItems,
    getActived,
    getChecked,
    append,
    insertBefore,
    insertAfter,
    getParent,
    getParents,
    remove,
    getIndex,
  } = props;
  // 创建 store
  const store = useRef(
    new TreeStore({
      keys,
      activable,
      activeMultiple,
      checkable,
      checkStrictly,
      expandAll,
      expandLevel,
      expandMutex,
      expandParent,
      disabled,
      load,
      lazy,
      valueMode,
      filter,
      scopedSlots: children,
      onLoad: (info: any) => {
        handleLoad(info, props);
      },
      onUpdate: (info: EventState) => {
        handleUpdate(info, props);
        const nodes = store.getNodes();
        const newVisibleNodes = nodes.filter((node) => node.visible);
        setVisibleNodes(newVisibleNodes);
      },
    }),
  ).current;

  // 初始化 store 的节点排列 + 状态
  useEffect(() => {
    if (data && data.length > 0 && store.getNodes().length === 0) {
      store.append(data);
      // 选中态回显
      if (Array.isArray(value)) {
        store.setChecked(value);
      }
      // 展开态回显
      if (Array.isArray(expanded)) {
        const expandedMap = new Map();
        expanded.forEach((val) => {
          expandedMap.set(val, true);
          if (expandParent === 'auto') {
            const node = store.getNode(val);
            node.getParents().forEach((tn) => {
              expandedMap.set(tn.value, true);
            });
          }
        });
        const expandedArr = Array.from(expandedMap.keys());
        store.setExpanded(expandedArr);
      }
      // 高亮态回显
      if (Array.isArray(actived)) {
        store.setActived(actived);
      }
      // 树的数据初始化之后，需要立即进行一次视图刷新
      store.refreshNodes();
    }
  }, []);

  /**  监听开发者的各个 props 变化 **/
  useEffect(() => {
    if (data && Array.isArray(data)) {
      store.removeAll();
      store.append(data);
    }
  }, [data]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      store.replaceChecked(value);
    }
  }, [value]);

  useEffect(() => {
    if (expanded && Array.isArray(expanded)) {
      store.replaceExpanded(expanded);
    }
  }, [expanded]);

  useEffect(() => {
    if (actived && Array.isArray(actived)) {
      store.replaceActived(actived);
    }
  }, [actived]);

  useEffect(() => {
    if (filter) {
      store.setConfig({
        filter,
      });
      store.updateAll();
    }
  }, [filter]);

  /** 对外暴露的公共方法 **/
  useImperativeHandle(ref, (): any => ({
    filterItems(fn: Function): void {
      store.setConfig({
        filter: fn,
      });
      store.updateAll();
    },
    scrollTo(): void {
      // todo
    },
    setItem(value: string | TreeNode, options: TreeNodeProps): void {
      const node = this.getItem(value);
      const spec = options;
      if (node) {
        if (spec) {
          if ('expanded' in options) {
            setExpanded(node, spec.expanded, props);
            delete spec.expanded;
          }
          if ('actived' in options) {
            setActived(node, spec.actived, props);
            delete spec.actived;
          }
          if ('checked' in options) {
            setChecked(node, spec.checked, props);
            delete spec.checked;
          }
        }
        node.set(spec);
      }
    },
    getItem(value: string | TreeNode): TreeNode {
      return store.getNode(value);
    },
    getItems(value?: string | TreeNode, options?: TreeFilterOptions): TreeNode[] {
      return this.store.getNodes(value, options);
    },
    getActived(value?: string | TreeNode): TreeNode[] {
      return this.store.getActivedNodes(value);
    },
    getChecked(item?: string | TreeNode): TreeNode[] {
      return this.store.getCheckedNodes(item);
    },
    append(para?: any, item?: any): void {
      return this.store.appendNodes(para, item);
    },
    insertBefore(value: string | TreeNode, item: any): void {
      return this.store.insertBefore(value, item);
    },
    insertAfter(value: string | TreeNode, item: any): void {
      return this.store.insertAfter(value, item);
    },
    getParent(value: string | TreeNode): TreeNode {
      return this.store.getParent(value);
    },
    getParents(value: string | TreeNode): TreeNode {
      return this.store.getParents(value);
    },
    remove(value?: string | TreeNode): void {
      return this.store.remove(value);
    },
    getIndex(value: string | TreeNode): number {
      return this.store.getNodeIndex(value);
    },
  }));

  return (
    // 【暂勿删】
    // <div ref={ref} className={classNames(CLASS_NAMES.tree, [transition ? CLASS_NAMES.treeFx : ''])}>
    //   {treeItems}
    // </div>
    <div ref={ref} className={classNames(CLASS_NAMES.tree, [transition ? CLASS_NAMES.treeFx : ''])}>
      <TransitionGroup>
        {visibleNodes.map((node) => (
          <CSSTransition key={node.value} timeout={transitionDuration} classNames={transitionClassNames}>
            <TreeItem
              node={node}
              empty={empty}
              icon={icon}
              label={label}
              line={line}
              hover={hover}
              transition={transition}
              expandOnClickNode={expandOnClickNode}
              operations={operations}
              onClick={(node: TreeNode) => {
                handleClick(node, props, store);
              }}
              onChange={(node: TreeNode) => {
                handleChange(node, props, store);
              }}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
