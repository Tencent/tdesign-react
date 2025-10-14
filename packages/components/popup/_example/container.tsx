import React from 'react';
import { Button, Popup, Space } from 'tdesign-react';

export default function Attach() {
  return (
    <Space className='attach-container' style={{ position: 'relative' }}>
      <Popup trigger="click" content="触发元素的父元素是组件根元素，通过 CSS Selector 定义" attach=".attach-container">
        <Button>点击查看我的父元素(CSS Selector)</Button>
      </Popup>
      <Popup
        trigger="click"
        content="触发元素的父元素是组件根元素，通过 Function 定义"
        attach={(triggerElement) => triggerElement.parentElement}
      >
        <Button>点击查看我的父元素(Function)</Button>
      </Popup>
    </Space>
  );
}
