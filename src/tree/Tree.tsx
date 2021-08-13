import TreeNode from '@common/js/tree/tree-node';
import { TreeNodeState, TreeNodeValue, TypeTreeNodeModel } from '@common/js/tree/types';
import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { TreeOptionData } from '../_type';
import { TreeInstanceFunctions } from './interface/TreeInstanceFunctions';
import { TreeItemProps } from './interface/TreeItemProps';
import { TreeProps } from './interface/TreeProps';
import { CLASS_NAMES, FX, transitionClassNames, transitionDuration } from './constants';

import TreeItem from './TreeItem';
import { usePersistFn } from './usePersistFn';
import { useStore } from './useStore';

/**
 * 树组件
 */
const Tree = forwardRef((props: TreeProps, ref: React.Ref<TreeInstanceFunctions>) => {
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
    transition, // 动画默认开启
    expandOnClickNode,
    filter,
    onExpand,
    onActive,
    onChange,
    onClick,
  } = props;

  const store = useStore(props, () => {
    const nodes = store.getNodes();

    const newVisibleNodes = nodes.filter((node) => node.visible);
    setVisibleNodes(newVisibleNodes);
  });

  // 因为是被 useImperativeHandle 依赖的方法，使用 usePersistFn 变成持久化的。或者也可以使用 useCallback
  const setExpanded = usePersistFn((node: TreeNode, isExpanded: boolean) => {
    const expanded = node.setExpanded(isExpanded);
    const treeNodeModel = node?.getModel();
    const event = new MouseEvent('expand');
    onExpand?.(expanded, {
      node: treeNodeModel,
      e: event,
    });
    return expanded;
  });

  const setActived = usePersistFn((node: TreeNode, isActived: boolean) => {
    const actived = node.setActived(isActived);
    const treeNodeModel = node?.getModel();
    onActive?.(actived, { node: treeNodeModel });
    return actived;
  });

  const setChecked = usePersistFn((node: TreeNode, isChecked: boolean) => {
    const checked = node.setChecked(isChecked);
    const treeNodeModel = node?.getModel();
    onChange?.(checked, { node: treeNodeModel });
    return checked;
  });

  const handleClick: TreeItemProps['onClick'] = (node, options) => {
    console.log('handleClick', node, options);
    if (!node || disabled || node.disabled) {
      return;
    }
    const { expand, active } = options;
    const e = new MouseEvent('click');
    if (expand) {
      const expandArr = setExpanded(node, !node.isExpanded());
      store.replaceExpanded(expandArr);
    }

    console.log('active', active);
    if (active) {
      const activedArr = setActived(node, !node.isActived());
      store.replaceActived(activedArr);
    }
    const treeNodeModel = node?.getModel();
    onClick?.({
      node: treeNodeModel,
      e,
    });
  };

  const handleChange: TreeItemProps['onChange'] = (node) => {
    if (!node || disabled || node.disabled) {
      return;
    }
    const checkedArr = setChecked(node, !node.isChecked());
    store.replaceChecked(checkedArr);
  };

  /** 对外暴露的公共方法 **/
  useImperativeHandle<unknown, TreeInstanceFunctions>(
    ref,
    () => ({
      store,
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
        return store.insertAfter(value, newData);
      },
      insertBefore(value: TreeNodeValue, newData: TreeOptionData): void {
        return store.insertBefore(value, newData);
      },
      remove(value: TreeNodeValue): void {
        return store.remove(value);
      },
      setItem(value: TreeNodeValue, options: TreeNodeState): void {
        const node: TreeNode = this.store.getNode(value);
        const spec = options;
        if (node && spec) {
          if ('expanded' in options) {
            setExpanded(node, spec.expanded);
            delete spec.expanded;
          }
          if ('actived' in options) {
            setActived(node, spec.actived);
            delete spec.actived;
          }
          if ('checked' in options) {
            setChecked(node, spec.checked);
            delete spec.checked;
          }
          node.set(spec);
        }
      },
    }),
    [store, setExpanded, setActived, setChecked],
  );

  /* ======== 由 props 引发的 store 更新 ======= */
  useEffect(() => {
    if (data && Array.isArray(data)) {
      store.removeAll();
      store.append(data);
    }
  }, [data, store]);

  useEffect(() => {
    store.setConfig({
      keys,
      expandAll,
      expandLevel,
      expandMutex,
      expandParent,
      activable,
      activeMultiple,
      disabled,
      checkable,
      checkStrictly,
      load,
      lazy,
      valueMode,
    });

    store.refreshState();
  }, [
    activable,
    activeMultiple,
    checkStrictly,
    checkable,
    disabled,
    expandAll,
    expandLevel,
    expandMutex,
    expandParent,
    keys,
    lazy,
    load,
    store,
    valueMode,
  ]);

  useEffect(() => {
    if (Array.isArray(value)) {
      store.replaceChecked(value);
    }
  }, [store, value]);

  useEffect(() => {
    if (Array.isArray(expanded)) {
      store.replaceExpanded(expanded);
    }
  }, [expanded, store]);

  useEffect(() => {
    if (Array.isArray(actived)) {
      store.replaceActived(actived);
    }
  }, [actived, store]);

  useEffect(() => {
    store.setConfig({
      filter,
    });
    store.updateAll();
  }, [filter, store]);

  /* ======== render ======= */
  const renderEmpty = () => {
    let emptyView = empty || '暂无数据';
    if (empty instanceof Function) {
      emptyView = empty();
    }

    return emptyView;
  };

  const renderItems = () => {
    if (visibleNodes.length <= 0) {
      return renderEmpty();
    }

    return (
      <TransitionGroup name={FX.treeNode} className={CLASS_NAMES.treeList}>
        {visibleNodes.map((node) => (
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
              onClick={handleClick}
              onChange={handleChange}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  };
  return (
    <div
      className={classNames(CLASS_NAMES.tree, {
        [CLASS_NAMES.disabled]: disabled,
        [CLASS_NAMES.treeHoverable]: hover,
        [CLASS_NAMES.treeCheckable]: checkable,
        [CLASS_NAMES.treeFx]: transition,
        [CLASS_NAMES.treeBlockNode]: expandOnClickNode,
      })}
    >
      {renderItems()}
    </div>
  );
});

Tree.displayName = 'Tree';

Tree.defaultProps = {
  data: [],
  empty: '',
  expandLevel: 0,
  icon: true,
  line: false,
  transition: true,
  lazy: true,
  valueMode: 'onlyLeaf',
};

export default Tree;
