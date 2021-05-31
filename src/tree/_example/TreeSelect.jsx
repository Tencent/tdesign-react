import React, { useState } from 'react';
import Tree from '../Tree';
import Switch from '../../switch';
import Input from '../../input';
import Tag from '../../tag';

const data = [
  {
    children: [
      {
        value: '1-1',
        label: '我是节点1-1',
      },
      {
        value: '1-2',
        label: '我是节点1-2',
        children: [
          {
            value: '1-2-1',
            label: '我是节点1-2-1',
          },
          {
            value: '1-2-2',
            label: '我是节点1-2-2',
          },
          {
            value: '1-2-3',
            label: '我是节点1-2-3',
          },
        ],
      },
      {
        value: '1-3',
        label: '我是节点1-3',
      },
    ],
    value: '1',
    label: '我是节点1',
  },
  {
    children: [
      {
        value: '2-1',
        label: '我是节点2-1',
        children: [
          {
            value: '2-1-1',
            label: '我是节点2-1-1',
            children: [
              {
                value: '2-1-1-1',
                label: '我是节点2-1-1-1',
              },
              {
                value: '2-1-1-2',
                label: '我是节点2-1-1-2',
                children: [
                  {
                    value: '2-1-1-2-1',
                    label: '我是节点2-1-1-2-1',
                    children: [
                      {
                        value: '2-1-1-2-1-1',
                        label: '我是节点2-1-1-2-1-1',
                      },
                      {
                        value: '2-1-1-2-1-2',
                        label: '我是节点2-1-1-2-1-2',
                      },
                    ],
                  },
                  {
                    value: '2-1-1-2-2',
                    label: '我是节点2-1-1-2-2',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: '2-2',
        label: '我是节点2-2',
      },
      {
        value: '2-3',
        label: '我是节点2-3',
      },
    ],
    value: '2',
    label: '我是节点2',
  },
];

const initActivedNode = { value: '1-1', label: '我是节点1-1' };

export default function TreeExample() {
  const [expandOnClickNode, setExpandOnClickNode] = useState(false);
  const [activedNodeKeys, setActivedNodeKeys] = useState([initActivedNode.value]);
  const [value, setValue] = useState('');
  const [selectNode, setSelectNode] = useState(initActivedNode);

  const handleSwitchChange = (value) => {
    setExpandOnClickNode(value);
  };

  const handleClick = ({ event, node }) => {
    console.log('node:', node);
    console.log('selectNode:', selectNode);
    if (node.actived && node.data) {
      setSelectNode(node.data);
    } else if (!node.actived && node.data && selectNode.value === node.data.value) {
      setSelectNode(null);
    }
    setValue('');
  };

  const handleInput = (event) => {
    setValue(event.target.value);
    setSelectNode(null);
  };

  const deleteTag = () => {
    setSelectNode(null);
    setActivedNodeKeys([]);
  };

  return (
    <>
      <div>
        <span style={{ marginRight: '10px' }}>点击文字，展开节点</span>
        <Switch value={expandOnClickNode} onChange={handleSwitchChange} />
      </div>

      {!selectNode ? (
        <Input style={{ margin: '10px 0' }} value={value} onChange={handleInput} />
      ) : (
        <div style={{ border: '1px solid #bbb', padding: '3px', margin: '10px 0' }}>
          <span>
            <Tag
              closable
              onClose={() => {
                deleteTag();
              }}
            >
              {selectNode.label}
            </Tag>
          </span>
        </div>
      )}

      <Tree
        data={data}
        activable={true}
        actived={activedNodeKeys}
        expandOnClickNode={expandOnClickNode}
        onClick={handleClick}
      />
    </>
  );
}
