import React, { useState } from 'react';
import { Button } from '@tencent/tdesign-react';
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
    <PopConfirm content={$content} placement="right">
      <Button theme="primary" style={{ marginLeft: 8 }}>
        浮层在右边
      </Button>
    </PopConfirm>
  );
}
