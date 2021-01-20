import React, { useState, useCallback } from 'react';
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

const activedNodeKeys = ['1-1'];
const activedNodeLabel = '我是节点1-1';

export default function TreeExample() {
  const [expandOnClickNode, setExpandOnClickNode] = useState(false);
  const [value, setValue] = useState('');
  const [selectLabel, setSelectLabel] = useState(activedNodeLabel);

  const handleSwitchChange = useCallback((value) => {
    setExpandOnClickNode(value);
  }, []);

  const handleClick = useCallback(({ event, node }) => {
    if (node.actived && node.data) {
      setSelectLabel(node.data.label);
    } else {
      setSelectLabel('');
    }
    setValue('');
  }, []);

  const handleInput = (event) => {
    setValue(event.target.value);
    setSelectLabel('');
  };

  const deleteTag = useCallback(() => {
    setSelectLabel('');
  }, []);

  return (
    <>
      <div>
        <span style={{ marginRight: '10px' }}>点击文字，展开节点</span>
        <Switch value={expandOnClickNode} onChange={handleSwitchChange} />
      </div>

      {!selectLabel ? (
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
              {selectLabel}
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
