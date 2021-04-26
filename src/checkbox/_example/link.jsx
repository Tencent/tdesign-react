import React, { useState } from 'react';
import { Checkbox, Button } from '@tencent/tdesign-react';

export default function CheckboxControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <Checkbox checked={checked}>腾讯云A</Checkbox>
      <Checkbox checked={checked}>腾讯云B</Checkbox>
      <Checkbox checked={checked}>腾讯云C</Checkbox>

      <div style={{ margin: '16px 0' }}>
        <Button onClick={() => setChecked(false)}>删除</Button>
        <Button style={{ marginLeft: 16 }} onClick={() => setChecked(true)}>
          开启
        </Button>
      </div>
    </>
  );
}
