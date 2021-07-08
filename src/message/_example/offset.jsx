import React from 'react';
import { Button, Message } from '@tencent/tdesign-react';
export default function () {
  return (
    <div className="message-element">
      <Button
        onClick={() => {
          Message.info({
            content: '用户表示普通操作信息提示',
            placement: 'top',
            offset: [-300, 50],
          }, 30000);
        }}
      >
        带 offset 信息位置
      </Button>
    </div>
  );
}
