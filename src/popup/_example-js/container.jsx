import React from 'react';
import { Button, Popup, Space } from 'tdesign-react';

export default function Attach() {
  return (
    <Space>
      <Popup
        trigger="click"
        content="触发元素的父元素是组件跟元素，通过 CSSSelector 定义"
        attach=".t-space"
      >
        <Button>点击查看我的父元素(CSSSelector)</Button>
      </Popup>
      <Popup
        trigger="click"
        content="触发元素的父元素是组件跟元素，通过 Function 定义"
        attach={(triggerElement) => triggerElement.parentElement}
      >
        <Button>点击查看我的父元素(Function)</Button>
      </Popup>
    </Space>
  );
}
