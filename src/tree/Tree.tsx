import React, { forwardRef, useState, useEffect, useRef } from 'react';
// import noop from '../_util/noop';
// import { Icon } from '../icon';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TreeNode } from '../../common/js/tree/TreeNode';
import { TreeStore } from '../../common/js/tree/TreeStore';
import { TreeProps } from './interface/TreeProps';
import TreeItem from './TreeItem';
import { EventState } from './EventState';
// import useRefresh from './hooks/useRefresh';
// import useInit from './hooks/useInit';

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
      onUpdate: handleUpdate,
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
            onClick={handleClick}
            onChange={handleChange}
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

  function handleLoad(info: any, props: TreeProps) {
    const { onLoad } = props;
    const event = new Event('load');
    const { node, data } = info;
    const state: EventState = {
      event,
      node,
      data,
    };
    onLoad && onLoad(state);
  }

  function handleUpdate(info: EventState) {
    const event = new Event('update');
    const { nodes, map } = info;
    const state: EventState = {
      event,
      nodes,
    };
    const { onUpdate } = props;
    // 触发开发者的 @update 事件监听，并回传 state
    onUpdate && onUpdate(state);
    refresh(map);
  }

  function setChecked(node: TreeNode, isChecked: boolean) {
    const checked = node.setChecked(isChecked);
    return checked;
  }

  function toggleChecked(node: TreeNode) {
    return setChecked(node, !node.isChecked());
  }

  function setExpanded(node: TreeNode, isExpanded: boolean) {
    const { onExpand } = props;
    const expanded = node.setExpanded(isExpanded);
    const event = new Event('expand');
    const state: EventState = {
      event,
      node,
    };
    onExpand && onExpand(expanded, state);
    return expanded;
  }

  function toggleExpanded(node: TreeNode) {
    return setExpanded(node, !node.isExpanded());
  }

  function handleChange(state: EventState) {
    const { onChange, disabled } = props;
    const store = initStore.current;
    const { node } = state;
    if (!node || disabled || node.disabled) {
      return;
    }
    const checkedArr = toggleChecked(node);
    store.replaceChecked(checkedArr);
    onChange && onChange(checkedArr, state);
  }

  function handleClick(state: EventState) {
    const { onClick, disabled } = props;
    const store = initStore.current;
    const { node } = state;
    if (!node || disabled || node.disabled) {
      return;
    }
    const expandArr = toggleExpanded(node);
    const activedArr = toggleActived(node);
    store.replaceExpanded(expandArr);
    store.replaceActived(activedArr);
    onClick && onClick(state);
  }

  function setActived(node: TreeNode, isActived: boolean) {
    const { onActive } = props;
    const actived = node.setActived(isActived);
    const event = new Event('active');
    const state: EventState = {
      event,
      node,
    };
    onActive && onActive(actived, state);
    return actived;
  }

  function toggleActived(node: TreeNode) {
    return setActived(node, !node.isActived());
  }

  return (
    <div ref={ref} className={classNames(`${classPrefix}-tree`, {})}>
      {treeItems}
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
