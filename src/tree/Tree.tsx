import React, { forwardRef, useState, useEffect, useRef } from 'react';
// import noop from '../_util/noop';
// import { Icon } from '../icon';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TreeNode } from '../../common/js/tree/TreeNode';
import { TreeStore } from '../../common/js/tree/TreeStore';
import { TreeProps } from './interface/TreeProps';
import TreeItem from './TreeItem';
import { EventState } from './interface/EventState';
import { handleUpdate, handleLoad, handleChange, handleClick } from './util';

/**
 * 树组件
 */
const Tree = forwardRef((props: TreeProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const [treeItems, setTreeItems] = useState([]);
  // const store = useInit(props, handleLoad, handleUpdate);
  // 使用自定义 hook，获取最新 treeItems
  // const treeItems = useRefresh(props, initStore.current);
  const {
    keys,
    value,
    data,
    actived,
    activable,
    activeMultiple,
    checkable,
    checkStrictly,
    expanded,
    expandParent,
    expandAll,
    expandLevel,
    expandMutex,
    disabled,
    load,
    lazy,
    valueMode,
    filter,
    children,
  } = props;

  const initStore = useRef(
    new TreeStore({
      keys,
      activable,
      activeMultiple,
      checkable,
      checkStrictly,
      expandAll,
      expandLevel,
      expandMutex,
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
        handleUpdate(info, props, refresh);
      },
    }),
  );

  // 初始化 build
  useEffect(() => {
    const store = initStore.current;

    if (data && data.length > 0) {
      store.append(data);

      if (Array.isArray(value)) {
        store.setChecked(value);
      }

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

      if (Array.isArray(actived)) {
        store.setActived(actived);
      }
      // 树的数据初始化之后，需要立即进行一次视图刷新
      refresh();
    }
  }, []); // eslint-disable-line

  function refresh(updatedMap?: Map<string, boolean>) {
    const { empty, icon, label, line, operations, expandOnClickNode, children } = props;
    const store = initStore.current;

    // 存放所有可见节点
    const map = {};
    store.scopedSlots = children;

    // 移除不能呈现的节点
    let index = 0;
    while (index < treeItems.length) {
      const treeItem = treeItems[index];
      const nodeItem = treeItem.props.node;
      if (!nodeItem.visible) {
        treeItems.splice(index, 1);
      } else {
        map[nodeItem.value] = true;
        index += 1;
      }
    }

    // 插入需要呈现的节点
    index = 0;
    const nodes = store.getNodes();
    nodes.forEach((node: TreeNode) => {
      if (node.visible) {
        const treeItem = treeItems[index];
        let nodeItem = null;
        let shouldInsert = false;
        let shouldUpdate = false;
        const treeItemView = (
          <TreeItem
            key={node.value}
            node={node}
            empty={empty}
            icon={icon}
            label={label}
            line={line}
            expandOnClickNode={expandOnClickNode}
            operations={operations}
            onClick={(node: TreeNode) => handleClick(node, props, store)}
            onChange={(node: TreeNode) => handleChange(node, props, store)}
          />
        );
        if (treeItem) {
          nodeItem = treeItem.props.node;
          if (nodeItem.value !== node.value) {
            shouldInsert = true;
          } else if (updatedMap && updatedMap.get(node.value)) {
            shouldUpdate = true;
          }
        } else {
          shouldInsert = true;
        }
        if (shouldInsert) {
          const insertNode = treeItemView;
          if (!map[node.value]) {
            map[node.value] = true;
            treeItems.splice(index, 0, insertNode);
          }
        } else if (shouldUpdate) {
          const updateNode = treeItemView;
          treeItems.splice(index, 1, updateNode);
        }
        index += 1;
      }
    });
    // 注意改变引用地址。否则不会触发 re-render
    setTreeItems([...treeItems]);
  }

  return (
    <div ref={ref} className={classNames(`${classPrefix}-tree`, {})}>
      {treeItems}
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
