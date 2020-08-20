import React, { useState } from 'react';
import { Button } from '@tdesign/react';
import PopConfirm from '../PopConfirm';

export default function BasicUsageExample() {
  const [visible, setVisible] = useState(false);
  const $content = '请确认您要进行此操作';

  const handleConfirm = (e) => {
    console.log('confirm button clicked!', e);
    setVisible(false);
  };

  const handleCancel = (e) => {
    console.log('confirm button clicked!', e);
    setVisible(false);
  };

  return (
    <>
      <PopConfirm
        theme="info"
        trigger="manual"
        visible={visible}
        content={$content}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <Button
          theme="primary"
          onClick={() => setVisible(true)} style={{ marginLeft: 8 }}>
          点击展示
        </Button>
      </PopConfirm>
      <PopConfirm content={$content} placement="right">
        <Button
          theme="primary" style={{ marginLeft: 8 }}>浮层在右边</Button>
      </PopConfirm>
    </>
  );
}
