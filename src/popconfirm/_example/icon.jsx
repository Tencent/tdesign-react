import React from 'react';
import { Button, Icon } from '@tencent/tdesign-react';
import PopConfirm from '../PopConfirm';

export default function IconUsageExample() {
  const $content = '请确认您要进行此操作';
  const iconComponent = <Icon name="info-circle-filled" style={{ marginRight: '8px' }} />;
  const iconElement = () => <Icon name="logo-github" style={{ marginRight: '8px' }} />;
  return (
    <>
      <PopConfirm content={$content} icon="check-circle-filled">
        <Button theme="primary">使用String</Button>
      </PopConfirm>
      <PopConfirm content={$content} icon={iconComponent}>
        <Button theme="primary">使用VNode</Button>
      </PopConfirm>
      <PopConfirm content={$content} icon={iconElement}>
        <Button theme="primary">使用Function</Button>
      </PopConfirm>
    </>
  );
}
