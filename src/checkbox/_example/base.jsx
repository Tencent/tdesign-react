import React, { useState } from 'react';
import { Checkbox } from '@tencent/tdesign-react';

export default function CheckboxExample() {
  const [value, setValue] = useState(true);

  return (
    <div class="tdesign-demo-block-row">
      <Checkbox>未选中项</Checkbox>
      <Checkbox indeterminate>半选状态</Checkbox>
      <Checkbox checked={value} onChange={setValue}>选中项</Checkbox>
      <Checkbox disabled>未选禁用项</Checkbox>
      <Checkbox disabled defaultChecked>选中禁用项</Checkbox>
    </div>
  );
}
