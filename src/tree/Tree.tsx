import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { TreeStore } from '../../common/js/tree/tree-store';
import { TreeNode } from '../../common/js/tree/tree-node';
import { TreeNodeValue, TypeTreeNodeModel, TreeNodeState } from '../../common/js/tree/types';
import { TreeOptionData } from '../_type';
import { TreeProps } from './interface/TreeProps';
import { CLASS_NAMES, transitionClassNames, transitionDuration } from './constants';

import TreeItem from './components/TreeItem';
import { handleLoad, handleChange, handleClick, setExpanded, setActived, setChecked } from './util';

/**
 * 树组件
 */
const Tree = forwardRef((props: TreeProps, ref: React.Ref<HTMLDivElement>) => {
  // 可见节点集合
  const [visibleNodes, setVisibleNodes] = useState([]);

  const {
    data,
    empty,
    keys,
    expandAll,
    expandParent,
    // defaultExpanded,
    expanded,
    expandLevel,
    expandMutex,
    activable,
    activeMultiple,
    actived,
    disabled,
    checkable,
    // defaultValue,
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
    filter,
  } = props;

  // 类名计算
  const className = classNames(CLASS_NAMES.tree, [
    transition ? CLASS_NAMES.treeFx : '',
    hover ? CLASS_NAMES.treeHoverable : '',
    disabled ? CLASS_NAMES.disabled : '',
  ]);

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
      onLoad: (info: any) => {
        handleLoad(info, props);
      },
      onUpdate: () => {
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
          if (expandParent) {
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
  }, []); // eslint-disable-line

  /**  监听开发者的各个 props 变化 **/
  useEffect(() => {
    if (data && Array.isArray(data)) {
      store.removeAll();
      store.append(data);
    }
  }, [data, store]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      store.replaceChecked(value);
    }
  }, [value, store]);

  useEffect(() => {
    if (expanded && Array.isArray(expanded)) {
      store.replaceExpanded(expanded);
    }
  }, [expanded, store]);

  useEffect(() => {
    if (actived && Array.isArray(actived)) {
      store.replaceActived(actived);
    }
  }, [actived, store]);

  useEffect(() => {
    if (filter) {
      store.setConfig({
        filter,
      });
      store.updateAll();
    }
  }, [filter, store]);

  /** 对外暴露的公共方法 **/
  useImperativeHandle(ref, (): any => ({
    store,
    // 【待确定】需要对齐，是否确认去掉这个方法
    // filterItems(fn: (node: TreeNode) => boolean): void {
    //   store.setConfig({
    //     filter: fn,
    //   });
    //   store.updateAll();
    // },
    scrollTo(): void {
      // TODO
    },
    setItem(value: TreeNodeValue, options: TreeNodeState): void {
      const node: TreeNode = this.store.getNode(value);
      const spec = options;
      if (node && spec) {
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
        node.set(spec);
      }
    },
    getItem(value: TreeNodeValue): TypeTreeNodeModel {
      const node = this.store.getNode(value);
      return node?.getModel();
    },
    // 【待确定】需要对齐，是否确认去掉这3个方法
    // getItems(value?: string | TreeNode, options?: TreeFilterOptions): TreeNode[] {
    //   return this.store.getNodes(value, options);
    // },
    // getActived(value?: string | TreeNode): TreeNode[] {
    //   return this.store.getActivedNodes(value);
    // },
    // getChecked(item?: string | TreeNode): TreeNode[] {
    //   return this.store.getCheckedNodes(item);
    // },
    // append(para?: any, item?: any): void {
    //   return this.store.appendNodes(para, item);
    // },
    appendTo(value: TreeNodeValue, newData: TreeOptionData): void {
      return this.store.appendNodes(value, newData);
    },
    insertBefore(value: TreeNodeValue, newData: TreeOptionData): void {
      return this.store.insertBefore(value, newData);
    },
    insertAfter(value: TreeNodeValue, newData: TreeOptionData): void {
      return this.store.insertAfter(value, newData);
    },
    getParent(value: TreeNodeValue): TypeTreeNodeModel {
      const node = this.store.getParent(value);
      return node?.getModel();
    },
    getParents(value: TreeNodeValue): TypeTreeNodeModel[] {
      const nodes = this.store.getParents(value);
      return nodes.map((node: TreeNode) => node.getModel());
    },
    remove(value: TreeNodeValue): void {
      this.store.remove(value);
    },
    getIndex(value: TreeNodeValue): number {
      return this.store.getNodeIndex(value);
    },
  }));

  const treeItems = visibleNodes.map((node) => {
    return (
      <CSSTransition key={node.value} timeout={transitionDuration} classNames={transitionClassNames}>
        <TreeItem
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
          onClick={(node: TreeNode, options: { expand: boolean; active: boolean }) => {
            handleClick(node, props, store, options);
          }}
          onChange={(node: TreeNode) => {
            handleChange(node, props, store);
          }}
        />
      </CSSTransition>
    );
  });

  return (
    <div ref={ref} className={className}>
      <TransitionGroup>{treeItems}</TransitionGroup>
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
