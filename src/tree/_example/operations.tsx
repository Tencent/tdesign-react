import React, { useRef, useState } from 'react';
import {
  InputAdornment,
  Button,
  Input,
  Tree,
  Form,
  Switch,
  Space,
  TreeNodeModel,
  TreeInstanceFunctions,
} from 'tdesign-react';

import type { TreeProps, TreeNodeValue } from 'tdesign-react';

const items = [
  {
    value: 'node1',
  },
  {
    value: 'node2',
    children: [],
  },
];

let index = 2;

export default () => {
  const [useActived, setUseActived] = useState(false);
  const [expandParent, setExpandParent] = useState(false);
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

  /* ======== 操作 api ======= */
  const treeRef = useRef<TreeInstanceFunctions<{ value: string; label?: string }>>(null);

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
      // setLabel(item.value);
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

  const remove = (node: TreeNodeModel) => {
    treeRef.current.remove(node.value);
  };

  const renderOperations2 = (node: TreeNodeModel) => (
    <>
      <Button style={{ marginLeft: '10px' }} size="small" variant="base" onClick={() => append(node)}>
        添加子节点
      </Button>
      <Button style={{ marginLeft: '10px' }} size="small" variant="outline" onClick={() => insertBefore(node)}>
        前插节点
      </Button>
      <Button style={{ marginLeft: '10px' }} size="small" variant="outline" onClick={() => insertAfter(node)}>
        后插节点
      </Button>
      <Button style={{ marginLeft: '10px' }} size="small" variant="base" theme="danger" onClick={() => remove(node)}>
        删除
      </Button>
    </>
  );

  /* ======== API ======= */
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

  const setActiveChecked = () => {
    treeRef.current.setItem('node2', {
      indeterminate: true,
    });
  };

  const setActiveExpanded = () => {
    const node = getActivedNode();
    if (!node) return;
    treeRef.current.setItem('node2', {
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
        operations={renderOperations2}
        onExpand={handleExpand}
        onChange={handleChange}
        onActive={handleActive}
      />
      <Space breakLine>
        <Button theme="primary" onClick={setActiveChecked}>
          选中高亮节点
        </Button>
        <Button theme="primary" onClick={setActiveExpanded}>
          展开高亮节点
        </Button>
        <Button theme="primary" onClick={getActivePlainData}>
          获取高亮节点与其子节点的数据
        </Button>
      </Space>
    </Space>
  );
};
