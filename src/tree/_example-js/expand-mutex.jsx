import React, { useState } from 'react';
import { Form, Switch, Tree, Space } from 'tdesign-react';

const items = [
  {
    label: '1',
    children: [
      {
        label: '1.1',
        children: [
          {
            label: '1.1.1',
          },
          {
            label: '1.1.2',
          },
        ],
      },
      {
        label: '1.2',
        children: [
          {
            label: '1.2.1',
          },
          {
            label: '1.2.2',
          },
        ],
      },
    ],
  },
  {
    label: '2',
    children: [
      {
        label: '2.1',
        children: [
          {
            label: '2.1.1',
          },
          {
            label: '2.1.2',
          },
        ],
      },
      {
        label: '2.2',
        children: [
          {
            label: '2.2.1',
          },
          {
            label: '2.2.2',
          },
        ],
      },
    ],
  },
];

export default () => {
  const [mutex, setMutex] = useState(true);
  const [expandOnClickNode, setExpandOnClickNode] = useState(true);

  const handleClick = (context) => {
    console.info('onClick', context);
  };

  const handleExpand = (value, context) => {
    console.info('onExpand', value, context);
  };

  return (
    <Space direction="vertical">
      <Form labelWidth={120}>
        <Form.FormItem label="互斥展开" initialData={mutex}>
          <Switch onChange={setMutex} />
        </Form.FormItem>
        <Form.FormItem label="整个节点可点击" initialData={expandOnClickNode}>
          <Switch onChange={setExpandOnClickNode} />
        </Form.FormItem>
      </Form>
      <Tree
        data={items}
        hover
        expandMutex={mutex}
        expandOnClickNode={expandOnClickNode}
        onClick={handleClick}
        onExpand={handleExpand}
      />
    </Space>
  );
};
