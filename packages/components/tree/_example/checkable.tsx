import React, { useState } from 'react';
import { Radio, Tree, Form, Switch, Space } from 'tdesign-react';

import type { TreeProps, RadioGroupProps } from 'tdesign-react';

const valueOptions = [
  {
    value: 'onlyLeaf',
    label: 'onlyLeaf',
  },
  {
    value: 'parentFirst',
    label: 'parentFirst',
  },
  {
    value: 'all',
    label: 'all',
  },
] as const;

type Value = 'onlyLeaf' | 'parentFirst' | 'all';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
        children: [
          {
            value: '1.1.1',
            label: '1.1.1',
            children: [
              {
                value: '1.1.1.1',
                label: '1.1.1.1',
              },
              {
                value: '1.1.1.2',
                label: '1.1.1.2',
              },
            ],
          },
          {
            value: '1.1.2',
            label: '1.1.2',
            children: [
              {
                value: '1.1.2.1',
                label: '1.1.2.1',
              },
              {
                value: '1.1.2.2',
                label: '1.1.2.2',
              },
            ],
          },
        ],
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
          {
            value: '1.2.2',
            label: '1.2.2',
            children: [
              {
                value: '1.2.2.1',
                label: '1.2.2.1',
              },
              {
                value: '1.2.2.2',
                label: '1.2.2.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
];

export default () => {
  const [checkable, setCheckable] = useState(true);
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [valueMode, setValueMode] = useState<Value>('onlyLeaf');

  const handleChange: TreeProps['onChange'] = (checked, context) => {
    console.info('onChange:', checked, context);
  };

  const handleClick: TreeProps['onClick'] = (context) => {
    console.info('onClick:', context);
  };

  const handleMode: RadioGroupProps['onChange'] = (value: Value) => {
    setValueMode(value);
  };

  return (
    <Space direction="vertical">
      <Form>
        <Form.FormItem label="可选" initialData={checkable}>
          <Switch<boolean> onChange={setCheckable} />
        </Form.FormItem>
        <Form.FormItem label="严格模式" initialData={checkStrictly}>
          <Switch<boolean> onChange={setCheckStrictly} />
        </Form.FormItem>
        <Form.FormItem label="选中值模式" name="valueMode" initialData={valueMode}>
          <Radio.Group onChange={handleMode}>
            {valueOptions.map((v) => (
              <Radio key={v.value} value={v.value}>
                {v.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.FormItem>
      </Form>
      <Tree
        expandAll
        hover
        data={items}
        checkable={checkable}
        checkStrictly={checkStrictly}
        valueMode={valueMode}
        onChange={handleChange}
        onClick={handleClick}
      />
    </Space>
  );
};
