import React, { forwardRef, useEffect, useState } from 'react';
// import noop from '../_util/noop';
// import { Icon } from '../icon';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TreeStore } from '../../common/js/tree/TreeStore';
import { TreeNode } from '../../common/js/tree/TreeNode';
import { TreeProps } from './TreeProps';
import TreeItem from './TreeItem';

/**
 * 树组件
 */
const Tree = forwardRef((props: TreeProps, ref: React.Ref<HTMLDivElement>) => {
  /* eslint-disable */
  const {
    data, // 数据
    empty, // 数据为空时展示的文本
    keys, // 开发者定义的映射字段
    expandAll, // 【??】展开所有子节点
    expandTrigger, // 【??】子节点展开的触发方式，默认：父节点被click
    expandParent, // 【??】展开子节点的时候是否自动展开父节点（api调用时）
    expandKeys, // 默认展开的节点id数组
    expandLevel, // 默认展开的级别（第一层为0）
    expandMutex, // 同级别展开是否互斥（手风琴效果）
    activable, // 【??】节点是否可高亮选中
    activeMultiple, // 节点是否可多选高亮
    activeKeys, // 【??】被高亮的树节点，为id数组
    disabled, // 树是否可操作（展开，选中等）
    checkable, // 节点是否添加复选框
    checkedKeys, // 被选中复选框的id列表
    checkProps, // 透传 checkbox 组件的属性
    checkStrictly, // 【??】checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
    hover, // 节点是否有hover状态
    icon, // 【??】是否显示节点图标
    line, // 【??】是否显示连接线
    load, // 加载子树数据的方法，仅当data数据中children属性被设置为true时生效
    lazy, // 延迟加载 children 为 true 的子节点，即使 expandAll 被设置为 true
    label, // 【??】树节点文本渲染方法
    filter, // 树节点筛选方法（开发者定义这个方法的逻辑，我们给开发者传入 node 即可）
    operations, // 【??】节点操作区域
    // children, // 待定
    // className, // 待定
  } = props;

  let store = null;
  const { classPrefix } = useConfig();
  const [treeNodes, setTreeNodes] = useState([]);

  // 组件初始化，创建 store
  useEffect(() => {
    if (!store) {
      store = new TreeStore({
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
        // valueMode, // 待定
        // filter, // 待定
        // 更改节点的组成，如异步加载、需要插入新节点
        onReflow: () => {
          console.log('onReflowonReflowonReflow');
          updateNodes();
        },
        // 更改节点的属性，节点排列不变，TreeNode 的任意属性更改
        // onUpdate: () => {
        //   console.log('update nodes');
        // },
      });

      if (data && data.length > 0) {
        store.append(data);
      }
    }
  }, [props]);

  const onClick = (node: TreeNode) => {
    if (disabled || !node || node.disabled) {
      return;
    }
    // []
    // console.log('onClick treeNodes', treeNodes)
    node.toggleExpand();
    updateNodes();
  };

  const onChange = (node: TreeNode) => {
    // []
    // console.log('onChange treeNodes', treeNodes)
    if (disabled || !node || node.disabled) {
      return;
    }
    const checkedValues = node.toggleChecked();
    store.setChecked(checkedValues);
    updateNodes();
  };

  // 【待修改】拿到的 treeNodes 一直为[]，这里存在些逻辑问题
  const updateNodes = () => {
    const map = {};

    // []
    console.log('updateNodes treeNodes:', treeNodes)

    const updateNodes = Array.from(treeNodes);

    // 移除不能呈现的节点
    let index = 0;
    while (index < updateNodes.length) {
      const treeItem = updateNodes[index];
      const nodeItem = treeItem.props.node;
      if (!nodeItem.visible) {
        updateNodes.splice(index, 1);
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
        const treeItem = updateNodes[index];
        let nodeItem = null;
        let shouldInsert = false;
        if (treeItem) {
          nodeItem = treeItem.props.node;
          if (nodeItem.value !== node.value) {
            shouldInsert = true;
          }
        } else {
          shouldInsert = true;
        }
        if (shouldInsert) {
          const insertNode = <TreeItem key={node.value} node={node} empty={empty} onClick={onClick} onChange={onChange} />;
          if (!map[node.value]) {
            map[node.value] = true;
            updateNodes.splice(index, 0, insertNode);
          }
        }
        index += 1;
      }
    });
    setTreeNodes(updateNodes);
  };

  return (
    <div ref={ref} className={classNames(`${classPrefix}-tree`, {})}>
      {treeNodes}
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
