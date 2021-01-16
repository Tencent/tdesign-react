import React, { useState, useCallback } from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';
import Switch from '../../switch';
import Input from '../../input';

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

export default function TreeExample() {
  const [expandOnClickNode, setExpandOnClickNode] = useState(false);
  const [selectLabel, setSelectLabel] = useState('');

  const handleClick = useCallback(({ event, node }) => {
    if (node.actived) {
      setSelectLabel(node.label);
    } else {
      setSelectLabel('');
    }
  }, []);

  const handleSwitchChange = useCallback((value) => {
    setExpandOnClickNode(value);
  }, []);

  const handleInput = useCallback(() => {
    return;
  }, []);

  return (
    <>
      <div>
        <span style={{ marginRight: '10px' }}>点击文字，展开节点</span>
        <Switch value={expandOnClickNode} onChange={handleSwitchChange} />
      </div>

      <Input style={{ margin: '10px 0' }} value={selectLabel} onChange={handleInput} />
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
