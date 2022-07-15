import React from 'react';
import { Button, Popup, Input, Space } from 'tdesign-react';

export default function Triggers() {
  return (
    <Space>
      <Popup trigger="hover" showArrow content="这是一个弹出框">
        <Button variant="outline">悬浮时触发（默认）</Button>
      </Popup>
      <Popup trigger="focus" showArrow content="这是一个弹出框">
        <Input placeholder="获得焦点时触发" style={{ width: 200 }}></Input>
      </Popup>
      <Popup trigger="click" showArrow content="这是一个弹出框">
        <Button onClick={() => console.log('自定义事件')} variant="outline">
          点击时触发
        </Button>
      </Popup>
      <Popup trigger="context-menu" showArrow content="这是一个弹出框">
        <Button variant="outline">右击时触发</Button>
      </Popup>
    </Space>
  );
}
