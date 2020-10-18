import React, { forwardRef, useState, useEffect } from 'react';
// import noop from '../_util/noop';
// import { Icon } from '../icon';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TreeProps } from './TreeProps';
import TreeNode from './TreeNode';

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

  const { classPrefix } = useConfig();

  const [expendState, setExpendState] = useState(true);
  const [treeNodes, setTreeNodes] = useState([]);

  // componentDidMount
  useEffect(() => {
    console.log('data:', data);
    const renderTreeNodes = [];
    renderTree(data, renderTreeNodes);
    setTreeNodes(renderTreeNodes);
  }, []);

  // 初始化渲染
  const renderTree = (data, arr) => {
    data.forEach((item, index) => {
      const { value, children, label, parent } = item;
      // 内部自定义节点id
      if (!parent) {
        // 0层节点
        item.id = `${index}`;
      } else {
        // 其他节点
        item.id = `${parent}-${index}`;
      }
      arr.push(
        <TreeNode
          value={item.id}
          children={children}
          parent={parent}
          label={label}
          key={item.id}
          expand={expendState}
        />,
      );
      // 当前节点具有子节点
      if (Array.isArray(children) && children.length > 0) {
        children.forEach((childItem) => {
          childItem.parent = item.id;
        });
        renderTree(children, arr);
      }
    });
  };

  console.log('treeNodes:', treeNodes);

  return (
    <div ref={ref} className={classNames(`${classPrefix}-tree`, {})}>
      {treeNodes}
    </div>
  );
});

Tree.displayName = 'Tree';

export default Tree;
