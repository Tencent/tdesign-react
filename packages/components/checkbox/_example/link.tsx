import React, { useState } from 'react';
import { Checkbox, Button, Space } from 'tdesign-react';

export default function CheckboxControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Space direction="vertical">
      <Space>
        <Checkbox checked={checked}>腾讯云A</Checkbox>
        <Checkbox checked={checked}>腾讯云B</Checkbox>
        <Checkbox checked={checked}>腾讯云C</Checkbox>
      </Space>

      <Space>
        <Button onClick={() => setChecked(false)}>重置</Button>
        <Button style={{ marginLeft: 16 }} onClick={() => setChecked(true)}>
          全选
        </Button>
      </Space>
    </Space>
  );
}
