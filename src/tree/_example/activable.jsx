import React, { useState, useCallback } from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';
import Switch from '../../switch';

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

export default function TreeExample() {
  const [hoverable, setHoverable] = useState(false);

  const handleSwitchChange = useCallback((value) => {
    setHoverable(value);
  }, []);

  return (
    <>
      <div>
        <span style={{ marginRight: '10px' }}>开启hover态</span>
        <Switch value={hoverable} onChange={handleSwitchChange} />
      </div>

      <Tree data={data} hover={hoverable} />
    </>
  );
}
