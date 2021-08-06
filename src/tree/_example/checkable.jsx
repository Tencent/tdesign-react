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

const activedNodeKeys = ['2'];
const activedNodeLabel = '我是节点2';

export default function TreeExample() {
  const [checked, setChecked] = useState(false);
  const [selectArr, setSelectArr] = useState([activedNodeLabel]);

  const handleClick = useCallback(({ event, node }) => {
    const index = selectArr.indexOf(node.label);
    if (node.actived) {
      if (index === -1) {
        selectArr.push(node.label);
      }
    } else {
      selectArr.splice(index, 1);
    }
    setSelectArr([...selectArr]);
  }, []);

  const handleSwitchChange = useCallback((value) => {
    setChecked(value);
  }, []);

  const handleInput = useCallback(() => null, []);

  return (
    <>
      <span style={{ marginRight: '10px' }}>点击文字，展开节点</span>
      <Switch value={checked} onChange={handleSwitchChange} />
      <Input style={{ margin: '10px 0' }} value={selectArr.join('，')} onChange={handleInput} />
      <Tree
        data={data}
        activable={true}
        activeMultiple={true}
        actived={activedNodeKeys}
        expandOnClickNode={checked}
        checkable={true}
        onClick={handleClick}
      />
    </>
  );
}
