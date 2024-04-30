import React, { useState } from 'react';
import { Form, Switch, Tree, Space } from 'tdesign-react';

const items = [
  {
    label: '1',
    children: [
      {
        label: '1.1',
      },
      {
        label: '1.2',
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
  const [activable, setActivable] = useState(true);
  const [activeMultiple, setActiveMultiple] = useState(false);
  const [expandOnClickNode, setExpandOnClickNode] = useState(false);

  const handleClick = (context) => {
    console.info('onClick', context);
  };

  const handleActive = (value, context) => {
    console.info('onActive', value, context);
  };

  return (
    <Space direction="vertical">
      <Form labelWidth={120}>
        <Form.FormItem label="节点可高亮" initialData={activable}>
          <Switch onChange={setActivable} />
        </Form.FormItem>
        <Form.FormItem label="节点可多选高亮" initialData={activeMultiple}>
          <Switch onChange={setActiveMultiple} />
        </Form.FormItem>
        <Form.FormItem label="整个节点可点击" initialData={expandOnClickNode}>
          <Switch onChange={setExpandOnClickNode} />
        </Form.FormItem>
      </Form>
      <Tree
        data={items}
        expandAll
        activable={activable}
        activeMultiple={activeMultiple}
        expandOnClickNode={expandOnClickNode}
        onClick={handleClick}
        onActive={handleActive}
        hover
      />
    </Space>
  );
};
