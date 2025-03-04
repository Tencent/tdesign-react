import React, { useState } from 'react';
import { Checkbox, Space } from '@tdesign/components';

export default function CheckboxExample() {
  const [value, setValue] = useState(false);

  return (
    <Space>
      <Checkbox checked={value} onChange={setValue}>
        受控属性
      </Checkbox>
      <Checkbox defaultChecked={true}>非受控属性</Checkbox>
    </Space>
  );
}
