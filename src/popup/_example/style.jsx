import React from 'react';
import { Button, Popup, Space } from 'tdesign-react';

export default function OverlayStyle() {
  return (
    <Space>
      <Popup
        trigger="click"
        overlayStyle={{ background: 'green', margin: '0px', zIndex: 5600, color: '#fff' }}
        showArrow={false}
        content="这是一个弹出框"
      >
        <Button>click我试试</Button>
      </Popup>
      <Popup
        trigger="click"
        overlayStyle={(triggerElem) => ({ width: `${triggerElem.offsetWidth}px` })}
        content="这是一个弹出框"
      >
        <Button>根据 trigger 元素定制 overlayStyle</Button>
      </Popup>
    </Space>
  );
}
