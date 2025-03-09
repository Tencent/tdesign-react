import React, { useState } from 'react';
import { MessagePlugin, Button } from 'tdesign-react';

export default function () {
  const [instance, setInstance] = useState(null);
  const isMessageOpen = instance === null;
  const buttonTips = isMessageOpen ? '打开' : '关闭';
  return (
    <Button
      onClick={() => {
        if (isMessageOpen) {
          const ins = MessagePlugin.info('调用关闭函数关闭信息提示框', 0);
          setInstance(ins);
        } else {
          MessagePlugin.close(instance);
          setInstance(null);
        }
      }}
    >
      自由控制关闭时机（{buttonTips}）
    </Button>
  );
}
