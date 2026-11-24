import React, { useState } from 'react';
import { Overlay, Button } from 'tdesign-mobile-react';

export default function Base() {
  const [visible, setVisible] = useState(false);

  const transitionCallbacks = {
    onOpen: () => {
      console.log('--遮罩执行弹出动画效果前触发--');
    },
    onOpened: () => {
      console.log('--遮罩弹出动画效果结束后触发--');
    },
    onClose: () => {
      console.log('--遮罩执行消失动画效果前触发--');
    },
    onClosed: () => {
      console.log('--遮罩消失动画效果结束后触发--');
    },
  };

  return (
    <div>
      <Button size="large" block variant="outline" theme="primary" onClick={() => setVisible(true)}>
        基础用法
      </Button>
      <Overlay visible={visible} onClick={() => setVisible(false)} {...transitionCallbacks} />
    </div>
  );
}
