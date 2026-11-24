import React from 'react';
import { Checkbox, CheckboxGroupChangeContext, CheckboxGroupValue } from 'tdesign-mobile-react';

export default function () {
  const options = [
    { label: '多选', value: 'checkbox1' },
    { label: '多选', value: 'checkbox2' },
    {
      label: '多选标题多行多选标题多行多选标题多行多选标题多行多选标题多行多选标题多行',
      value: 'checkbox3',
      maxLabelRow: 2,
    },
    {
      label: '多选',
      value: 'checkbox4',
      content: '描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息',
      maxContentRow: 2,
    },
  ];

  const checkboxGroupChange = (value: CheckboxGroupValue, context: CheckboxGroupChangeContext) => {
    console.log('value:', value);
    console.log('Event:', context);
  };

  return (
    <Checkbox.Group
      defaultValue={['checkbox1', 'checkbox2']}
      options={options}
      onChange={checkboxGroupChange}
    ></Checkbox.Group>
  );
}
