import React, { useEffect } from 'react';
import Tree from '../Tree';

const data = [
  {
    children: [
      {
        label: '我是节点1-1',
      },
      {
        label: '我是节点1-2',
      },
    ],
    label: '我是节点1',
  },
  {
    children: [
      {
        label: '我是节点2-1',
        children: [
          {
            label: '我是节点2-1-1',
          },
          {
            label: '我是节点2-1-2',
          },
        ],
      },
      {
        label: '我是节点2-2',
      },
    ],
    label: '我是节点2',
  },
];

export default function TreeExample() {
  const ref = React.createRef();
  useEffect(() => {
    console.log('ref:', ref.current);
  }, []);
  return (
    <>
      <Tree data={data} checkable={true} ref={ref} />
    </>
  );
}
