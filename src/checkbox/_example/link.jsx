import React, { useState } from 'react';
import { Checkbox, Button } from '@tencent/tdesign-react';

export default function CheckboxControlledExample() {
  const [value, setValue] = useState(false);
  return (
    <>
      <Checkbox value={value}>腾讯云A</Checkbox>
      <Checkbox value={value}>腾讯云B</Checkbox>
      <Checkbox value={value}>腾讯云C</Checkbox>

      <div style={{ margin: '16px 0' }}>
        <Button onClick={() => setValue(false)}>删除</Button>
        <Button style={{ marginLeft: 16 }} onClick={() => setValue(true)}>
          开启
        </Button>
      </div>
    </>
  );
}
