import React, { useState } from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';
import Switch from '../../switch';
import Input from '../../input';
import Tag from '../../Tag';

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

const initActivedNodes = [
  { value: '2', label: '我是节点2' },
  { value: '2-3', label: '我是节点2-3' },
];
const initActivedMap = new Map();
initActivedNodes.forEach((activedNode) => {
  initActivedMap.set(activedNode.value, activedNode);
});

export default function TreeExample() {
  const [activedNodeKeys, setActivedNodeKeys] = useState([...initActivedMap.keys()]);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [activedMap, setActivedMap] = useState(initActivedMap);

  const handleSwitchChange = (value) => {
    setChecked(value);
  };

  const handleClick = ({ event, node }) => {
    if (node.actived && node.data && !activedMap.get(node.data.value)) {
      activedMap.set(node.data.value, node.data);
    } else if (!node.actived && activedMap.get(node.data.value)) {
      activedMap.delete(node.data.value);
    }
    setActivedMap(new Map(activedMap));
    setValue('');
  };

  const handleInput = (event) => {
    setValue(event.target.value);
    setActivedMap(new Map());
  };

  const deleteTag = (value) => {
    activedMap.delete(value);
    setActivedMap(new Map(activedMap));
    setActivedNodeKeys([...activedMap.keys()]);
  };

  return (
    <>
      <span style={{ marginRight: '10px' }}>点击文字，展开节点</span>
      <Switch value={checked} onChange={handleSwitchChange} />

      {activedMap.size === 0 ? (
        <Input style={{ margin: '10px 0' }} value={value} onChange={handleInput} />
      ) : (
        <div style={{ border: '1px solid #bbb', padding: '3px', margin: '10px 0' }}>
          <span>
            {[...activedMap.values()].map((selectNode) => (
              <Tag
                key={selectNode.value}
                closable
                onClose={() => {
                  deleteTag(selectNode.value);
                }}
              >
                {selectNode.label}
              </Tag>
            ))}
          </span>
        </div>
      )}

      <Tree
        data={data}
        activable={true}
        activeMultiple={true}
        actived={activedNodeKeys}
        expandOnClickNode={checked}
        onClick={handleClick}
      />
    </>
  );
}
