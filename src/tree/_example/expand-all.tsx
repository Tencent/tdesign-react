import React, { useState } from 'react';
import { Form, Switch, Tree, Space } from 'tdesign-react';

const data1 = [
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
      },
      {
        label: '2.2',
      },
    ],
  },
];

const data2 = [
  {
    label: '1',
  },
  {
    label: '2',
  },
  {
    label: '3',
    children: [
      {
        label: '3.1',
      },
      {
        label: '3.2',
      },
    ],
  },
];

export default () => {
  const [items, setItems] = useState(data1);
  const [hover, setHover] = useState(true);
  const [transition, setTransition] = useState(true);

  const handleItemsChange = () => {
    setItems((v) => (v === data1 ? data2 : data1));
  };

  return (
    <Space direction="vertical">
      <Form labelWidth={150}>
        <Form.FormItem label="切换数据">
          <Switch onChange={handleItemsChange} />
        </Form.FormItem>
        <Form.FormItem label="提供 hover 状态" initialData={hover}>
          <Switch onChange={setHover} />
        </Form.FormItem>
        <Form.FormItem label="展开动画" initialData={transition}>
          <Switch onChange={setTransition} />
        </Form.FormItem>
      </Form>
      <Tree data={items} expandAll hover={hover} transition={transition} />
    </Space>
  );
};
