import React from 'react';
import { Button, PopConfirm } from '@tencent/tdesign-react';
import { CheckCircleIcon } from '@tencent/tdesign-react/icon';

export default function ExtendsExample() {
  const $content = '请确认您要进行此操作';

  const handleConfirm = (e) => {
    console.log('confirm button clicked!', e);
  };

  const handleCancel = (e) => {
    console.log('cancel button clicked!', e);
  };

  return (
    <>
      <PopConfirm content={$content} onConfirm={handleConfirm} icon={<CheckCircleIcon />} onCancel={handleCancel}>
        <Button theme="primary">提交</Button>
      </PopConfirm>
    </>
  );
}
