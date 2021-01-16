import React, { useEffect } from 'react';
import Tree from '../Tree';

const data = [
  {
    children: [
      {
        label: '我是节点1-1',
        value: '1-1',
      },
      {
        label: '我是节点1-2',
        value: '1-2',
      },
    ],
    label: '我是节点1',
    value: '1',
  },
  {
    children: [
      {
        label: '我是节点2-1',
        value: '2-1',
        children: [
          {
            label: '我是节点2-1-1',
            value: '2-1-1',
          },
          {
            label: '我是节点2-1-2',
            value: '2-1-2',
          },
        ],
      },
      {
        label: '我是节点2-2',
        value: '2-2',
      },
    ],
    label: '我是节点2',
    value: '2',
  },
];

export default function TreeExample() {
  const ref = React.createRef();
  useEffect(() => {
    console.log('ref:', ref.current);
  }, []);

  return (
    <>
      <Tree ref={ref} data={data} checkable={true} value={['1']} checkStrictly={false} />
    </>
  );
}
