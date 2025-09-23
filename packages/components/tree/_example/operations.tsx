import React, { useRef, useState } from 'react';

import type { TreeInstanceFunctions, TreeNodeModel } from 'tdesign-react';
import { Button, Input, InputAdornment, Space, Switch, Tree, TreeNodeValue, TreeProps } from 'tdesign-react';

const items = [
  {
    value: 'node1',
  },
  {
    value: 'node2',
    disabled: true,
  },
];

let index = 2;

export default () => {
  const treeRef = useRef<TreeInstanceFunctions<{ value: string; label?: string }>>(null);

  const [useActived, setUseActived] = useState(false);
  const [expandParent, setExpandParent] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [activeId, setActiveId] = useState<TreeNodeValue>('');
  const [activeIds, setActiveIds] = useState([]);

  const getLabelContent = (node: TreeNodeModel) => {
    const pathNodes = node.getPath();
    let label = pathNodes.map((itemNode) => itemNode.getIndex() + 1).join('.');
    label = `${label} | value: ${node.value}`;
    return label;
  };

  const getLabel: TreeProps['label'] = (node) => {
    const label = getLabelContent(node);
    const { data } = node;
    data.label = label;
    return label;
  };

  const handleInputChange = (value: string) => {
    setFilterText(value);
    console.info('on input:', value);
  };

  const filterByText: TreeProps['filter'] = (node) => {
    const label = node?.data?.label || '';
    const rs = (label as string).indexOf(filterText) >= 0;
    return rs;
  };

  const handleExpand: TreeProps['onExpand'] = (vals, state) => {
    console.info('on expand:', vals, state);
  };

  const handleChange: TreeProps['onChange'] = (vals, state) => {
    console.info('on change:', vals, state);
  };

  const handleActive: TreeProps['onActive'] = (vals, state) => {
    console.info('on active:', vals, state);
    setActiveIds(vals);
    setActiveId(vals[0] || '');
  };

  const setLabel = (value: string) => {
    const node = treeRef.current.getItem(value);
    const label = getLabelContent(node);
    const { data } = node;
    data.label = label;
  };

  const getActivedNode = () => {
    const activeNode = treeRef.current.getItem(activeId);
    return activeNode;
  };

  const getInsertItem = () => {
    let item = null;
    index += 1;
    const value = `t${index}`;
    item = {
      value,
    };
    return item;
  };

  const append = (node?: TreeNodeModel) => {
    const item = getInsertItem();
    if (item) {
      if (!node) {
        treeRef.current.appendTo('', item);
      } else {
        treeRef.current.appendTo(node.value, item);
      }
      if (useActived) {
        setActiveIds((v) => [...v, item.value]);
      }
    }
  };

  const insertBefore = (node: TreeNodeModel) => {
    const item = getInsertItem();
    if (item) {
      treeRef.current.insertBefore(node.value, item);
      setLabel(item.value);
    }
  };

  const insertAfter = (node: TreeNodeModel) => {
    const item = getInsertItem();
    if (item) {
      treeRef.current.insertAfter(node.value, item);
      setLabel(item.value);
    }
  };

  const canToggleDisable = (node: TreeNodeModel) => {
    const parent = node.getParent?.();
    const isCheckStrictly = false; // 默认关闭
    if (!isCheckStrictly && parent?.disabled) {
      return false; // 父节点被禁用时，子节点状态不支持手动改变
    }
    return true;
  };

  const toggleDisable = (node: TreeNodeModel) => {
    treeRef.current.setItem(node.value, {
      disabled: !node.disabled,
    });
    console.log(treeRef.current.getItems(node.value));
  };

  const remove = (node: TreeNodeModel) => {
    treeRef.current.remove(node.value);
  };

  const renderOperations = (node: TreeNodeModel) => (
    <Space>
      <Button size="small" theme="primary" variant="base" onClick={() => append(node)}>
        添加子节点
      </Button>
      <Button size="small" theme="primary" variant="outline" onClick={() => insertBefore(node)}>
        前插节点
      </Button>
      <Button size="small" theme="primary" variant="outline" onClick={() => insertAfter(node)}>
        后插节点
      </Button>
      <Button
        size="small"
        variant="base"
        theme={node.disabled ? 'success' : 'warning'}
        disabled={!canToggleDisable(node)}
        onClick={() => toggleDisable(node)}
      >
        {node.disabled ? 'enable' : 'disable'}
      </Button>
      <Button size="small" theme="danger" variant="base" onClick={() => remove(node)}>
        删除
      </Button>
    </Space>
  );

  const getItem = () => {
    const node = treeRef.current.getItem('node1');
    console.info('getItem:', node.value);
  };

  const getAllItems = () => {
    const nodes = treeRef.current.getItems();
    console.info(
      'getAllItems:',
      nodes.map((node) => node.value),
    );
  };

  const getActiveChildren = () => {
    console.log(activeIds);
    const node = getActivedNode();
    if (!node) return;
    let nodes: Array<TreeNodeModel> = [];
    if (node) {
      const child = node.getChildren(true);
      if (typeof child === 'boolean') {
        // getChildren will never return true value.
        nodes = [];
      } else {
        nodes = child;
      }
    }
    console.info(
      'getActiveChildren:',
      nodes.map((node) => node.value),
    );
  };

  const getAllActived = () => {
    console.info('getActived value:', activeIds.slice(0));
  };

  const getActiveChecked = () => {
    const node = getActivedNode();
    if (!node) return;
    const nodes = treeRef.current.getItems(node.value);
    console.info(
      'getChecked:',
      nodes.filter((node) => node.checked).map((node) => node.value),
    );
  };

  const getActiveParent = () => {
    const node = getActivedNode();
    if (!node) return;
    const parent = treeRef.current.getParent(node.value);
    console.info('getParent', parent?.value);
  };

  const getActiveParents = () => {
    const node = getActivedNode();
    if (!node) return;
    const parents = treeRef.current.getParents(node.value);
    console.info(
      'getParents',
      parents.map((node) => node.value),
    );
  };

  const getActiveIndex = () => {
    const node = getActivedNode();
    if (!node) return;
    const index = treeRef.current.getIndex(node.value);
    console.info('getIndex', index);
  };

  const setActiveChecked = () => {
    const node = getActivedNode();
    if (!node) return;
    treeRef.current.setItem(node.value, {
      checked: true,
    });
  };

  const setActiveExpanded = () => {
    const node = getActivedNode();
    if (!node) return;
    treeRef.current.setItem(node?.value, {
      expanded: true,
    });
  };

  const getPlainData = (item: TreeNodeModel<{ value: string; label?: string }>) => {
    const root = item;
    if (!root) return null;
    const children = (item.getChildren(true) || []) as Array<TreeNodeModel<{ value: string; label?: string }>>;
    const list = [root].concat(children);
    const nodeMap = {};
    const nodeList = list.map((item) => {
      const node = {
        walkData() {
          const data = {
            ...this.data,
          };
          const itemChildren = this.getChildren();
          if (Array.isArray(itemChildren)) {
            data.children = [];
            itemChildren.forEach((childItem) => {
              const childNode = nodeMap[childItem.value];
              const childData = childNode.walkData();
              data.children.push(childData);
            });
          }
          return data;
        },
        ...item,
      };
      nodeMap[item.value] = node;
      return node;
    });
    const [rootNode] = nodeList;
    const data = rootNode.walkData();
    return data;
  };

  const getActivePlainData = () => {
    const node = getActivedNode();
    if (!node) return;
    const data = getPlainData(node);
    console.log('getActivePlainData:', data);
    return data;
  };

  return (
    <Space direction="vertical">
      <Space>
        插入节点使用高亮节点
        <Switch<boolean> onChange={setUseActived} />
      </Space>
      <Space>
        子节点展开触发父节点展开
        <Switch<boolean> onChange={setExpandParent} />
      </Space>
      <InputAdornment prepend="filter:">
        <Input value={filterText} onChange={handleInputChange} />
      </InputAdornment>
      <Tree
        ref={treeRef}
        hover
        expandAll
        activable
        checkable
        line
        data={items}
        actived={activeIds}
        activeMultiple
        allowFoldNodeOnFilter
        label={getLabel}
        expandParent={expandParent}
        filter={filterByText}
        operations={renderOperations}
        onExpand={handleExpand}
        onChange={handleChange}
        onActive={handleActive}
      />
      <Space breakLine>
        <Button theme="primary" variant="outline" onClick={getItem}>
          获取 value 为 node1 的单个节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getAllItems}>
          获取所有节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActiveChildren}>
          获取高亮节点的所有子节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getAllActived}>
          获取所有高亮节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActiveChecked}>
          获取高亮节点下的选中节点
        </Button>
        <Button theme="primary" variant="outline" onClick={() => append()}>
          插入一个根节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActiveParent}>
          获取高亮节点的父节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActiveParents}>
          获取高亮节点的所有父节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActiveIndex}>
          获取高亮节点在子节点中的位置
        </Button>
        <Button theme="primary" variant="outline" onClick={setActiveChecked}>
          选中高亮节点
        </Button>
        <Button theme="primary" variant="outline" onClick={setActiveExpanded}>
          展开高亮节点
        </Button>
        <Button theme="primary" variant="outline" onClick={getActivePlainData}>
          获取高亮节点与其子节点的数据
        </Button>
      </Space>
      <Space>* 相关信息通过控制台输出</Space>
    </Space>
  );
};
