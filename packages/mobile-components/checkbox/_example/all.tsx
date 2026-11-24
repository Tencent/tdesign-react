import React from 'react';
import { Checkbox, CheckboxGroupChangeContext, CheckboxGroupValue } from 'tdesign-mobile-react';

export default function () {
  const options = [
    { label: '全选', checkAll: true },
    { label: '多选', value: 1 },
    {
      label: '多选',
      value: 2,
    },
    {
      label: '多选',
      value: 3,
      content: '单选描述信息单选描述信息单选描述信息单选描述信息单选描述信息单选描述信息单选描述信息',
    },
  ];

  const checkboxGroupChange = (value: CheckboxGroupValue, context: CheckboxGroupChangeContext) => {
    console.log('value:', value);
    console.log('Event:', context);
  };

  return <Checkbox.Group defaultValue={[1, 2, 3]} options={options} onChange={checkboxGroupChange}></Checkbox.Group>;
}
