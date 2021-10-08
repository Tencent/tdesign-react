import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import { TreeNodeState, TreeNodeValue, TypeTreeNodeModel } from '../_common/js/tree/types';
import TreeNode from '../_common/js/tree/tree-node';
import { TreeOptionData } from '../_type';
import { usePersistFn } from '../_util/usePersistFn';
import { TreeInstanceFunctions, TdTreeProps } from '../_type/components/tree';
import { useTreeConfig } from './useTreeConfig';
import { TreeItemProps } from './interface';

import TreeItem from './TreeItem';
import { useStore } from './useStore';

/**
 * 树组件
 */
const Tree = forwardRef((props: TdTreeProps, ref: React.Ref<TreeInstanceFunctions>) => {
  const { treeClassNames, transitionNames, transitionClassNames, transitionDuration } = useTreeConfig();

  // 可见节点集合
  const [visibleNodes, setVisibleNodes] = useState([]);

  const {
    empty,
    // defaultExpanded,
    activable,
    disabled,
    checkable,
    // defaultValue,
    checkProps,
    hover,
    icon,
    line,
    label,
    operations,
    transition, // 动画默认开启
    expandOnClickNode,
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

    onExpand?.(expanded, {
      node: treeNodeModel,
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

  const handleItemClick: TreeItemProps['onClick'] = (node, options) => {
    if (!node || disabled || node.disabled) {
      return;
    }
    const { expand, active, event } = options;
    if (expand) {
      const expandArr = setExpanded(node, !node.isExpanded());
      store.replaceExpanded(expandArr);
    }

    if (active) {
      const activedArr = setActived(node, !node.isActived());
      store.replaceActived(activedArr);
    }
    const treeNodeModel = node?.getModel();
    onClick?.({
      node: treeNodeModel,
      e: event,
    });
  };

  const handleChange: TreeItemProps['onChange'] = (node) => {
    if (!node || disabled || node.disabled) {
      return;
    }
    const checkedArr = setChecked(node, !node.isChecked());
    store.replaceChecked(checkedArr);
  };

  /** 对外暴露的公共方法 * */
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
      <TransitionGroup name={transitionNames.treeNode} className={treeClassNames.treeList}>
        {visibleNodes.map((node) => (
          // https://github.com/reactjs/react-transition-group/issues/668
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
              onClick={handleItemClick}
              onChange={handleChange}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  };
  return (
    <div
      className={classNames(treeClassNames.tree, {
        [treeClassNames.disabled]: disabled,
        [treeClassNames.treeHoverable]: hover,
        [treeClassNames.treeCheckable]: checkable,
        [treeClassNames.treeFx]: transition,
        [treeClassNames.treeBlockNode]: expandOnClickNode,
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
