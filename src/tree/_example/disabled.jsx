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
      },
      {
        label: '2.2',
      },
    ],
  },
];

export default () => {
  const [disabled, setDisabled] = useState(true);

  return (
    <Space direction="vertical">
      <Form labelWidth={120}>
        <Form.FormItem label="是否禁用" initialData={disabled}>
          <Switch onChange={setDisabled} />
        </Form.FormItem>
      </Form>
      <Tree data={items} hover checkable expandAll disabled={disabled} />
    </Space>
  );
};
