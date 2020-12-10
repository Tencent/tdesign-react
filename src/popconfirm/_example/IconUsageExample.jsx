import React from 'react';
import { Button, Icon } from '@tencent/tdesign-react';
import PopConfirm from '../PopConfirm';

export default function IconUsageExample() {
  const $content = '请确认您要进行此操作';
  const iconComponent = <Icon name="notification_full" style={{ 'margin-right': '8px' }} />;
  const iconElement = () => <Icon name="success_fill" style={{ 'margin-right': '8px' }} />;
  return (
    <>
      <PopConfirm content={$content} icon="success">
        <Button style={{ marginLeft: 8 }} theme="primary">
          使用String
        </Button>
      </PopConfirm>
      <PopConfirm content={$content} icon={iconComponent}>
        <Button style={{ marginLeft: 8 }} theme="primary">
          使用VNode
        </Button>
      </PopConfirm>
      <PopConfirm content={$content} icon={iconElement}>
        <Button style={{ marginLeft: 8 }} theme="primary">
          使用Function
        </Button>
      </PopConfirm>
    </>
  );
}
