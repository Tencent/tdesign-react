import React, { useRef, useState } from 'react';
import { InputAdornment, Button, Input, Tree, Form, Switch, Space } from 'tdesign-react';

const items = [
  {
    value: 'node1',
  },
  {
    value: 'node2',
  },
];

let index = 2;

export default () => {
  const [useActived, setUseActived] = useState(false);
  const [expandParent, setExpandParent] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [activeId, setActiveId] = useState('');
  const [activeIds, setActiveIds] = useState([]);

  const getLabelContent = (node) => {
    const pathNodes = node.getPath();
    let label = pathNodes.map((itemNode) => itemNode.getIndex() + 1).join('.');
    label = `${label} | value: ${node.value}`;
    return label;
  };

  const getLabel = (node) => {
    const label = getLabelContent(node);
    const { data } = node;
    data.label = label;
    return label;
  };

  const renderOperations = (node) => `value: ${node.value}`;

  const handleInputChange = (value) => {
    setFilterText(value);
    console.info('on input:', value);
  };

  const filterByText = (node) => {
    const label = node?.data?.label || '';
    const rs = label.indexOf(filterText) >= 0;
    return rs;
  };

  const handleExpand = (vals, state) => {
    console.info('on expand:', vals, state);
  };

  const handleChange = (vals, state) => {
    console.info('on change:', vals, state);
  };

  const handleActive = (vals, state) => {
    console.info('on active:', vals, state);
    setActiveIds(vals);
    setActiveId(vals[0] || '');
  };

  /* ======== 操作 api ======= */
  const treeRef = useRef(null);

  const setLabel = (value) => {
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
  const append = (node) => {
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

  const insertBefore = (node) => {
    const item = getInsertItem();
    if (item) {
      treeRef.current.insertBefore(node.value, item);
      setLabel(item.value);
    }
  };

  const insertAfter = (node) => {
    const item = getInsertItem();
    if (item) {
      treeRef.current.insertAfter(node.value, item);
      setLabel(item.value);
    }
  };

  const remove = (node) => {
    treeRef.current.remove(node.value);
  };

  const renderOperations2 = (node) => (
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
    let nodes = [];
    if (node) {
      nodes = node.getChildren(true) || [];
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

  const getPlainData = (item) => {
    const root = item;
    if (!root) return null;
    const children = item.getChildren(true) || [];
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
      <h3 className="title">render:</h3>
      <Tree hover expandAll data={items} label={getLabel} operations={renderOperations} />
      <h3 className="title">api:</h3>
      <div className="operations">
        <Form labelWidth={200}>
          <Form.FormItem label="插入节点使用高亮节点" initialData={useActived}>
            <Switch onChange={setUseActived} />
          </Form.FormItem>
          <Form.FormItem label="子节点展开触发父节点展开" initialData={expandParent}>
            <Switch onChange={setExpandParent} />
          </Form.FormItem>
        </Form>
      </div>
      <div className="operations">
        <InputAdornment prepend="filter:">
          <Input value={filterText} onChange={handleInputChange} />
        </InputAdornment>
      </div>
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
      <h3 className="title">api:</h3>
      <Space breakLine>
        <Button theme="primary" onClick={getItem}>
          {"获取 value 为 'node1' 的单个节点"}
        </Button>
        <Button theme="primary" onClick={getAllItems}>
          获取所有节点
        </Button>
        <Button theme="primary" onClick={getActiveChildren}>
          获取高亮节点的所有子节点
        </Button>
        <Button theme="primary" onClick={getAllActived}>
          获取所有高亮节点
        </Button>
        <Button theme="primary" onClick={getActiveChecked}>
          获取高亮节点下的选中节点
        </Button>
        <Button theme="primary" onClick={() => append()}>
          插入一个根节点
        </Button>
        <Button theme="primary" onClick={getActiveParent}>
          获取高亮节点的父节点
        </Button>
        <Button theme="primary" onClick={getActiveParents}>
          获取高亮节点的所有父节点
        </Button>
        <Button theme="primary" onClick={getActiveIndex}>
          获取高亮节点在子节点中的位置
        </Button>
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
