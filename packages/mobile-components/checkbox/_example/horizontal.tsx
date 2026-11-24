import React from 'react';
import { Checkbox, CheckboxGroupChangeContext, CheckboxGroupValue } from 'tdesign-mobile-react';

export default function () {
  const checkboxGroupChange = (value: CheckboxGroupValue, context: CheckboxGroupChangeContext) => {
    console.log('value:', value);
    console.log('Event:', context);
  };

  return (
    <Checkbox.Group
      className="box horizontal"
      defaultValue={['checkbox1', 'checkbox2']}
      borderless
      direction="horizontal"
      onChange={checkboxGroupChange}
    >
      <Checkbox label="多选标题" value="checkbox1" />
      <Checkbox label="多选标题" value="checkbox2" />
      <Checkbox label="上限四字" value="checkbox3" />
    </Checkbox.Group>
  );
}
