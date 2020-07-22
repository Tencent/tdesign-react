import React from 'react';
import { Notification, Button } from '@tdesign/react';

export default function NotificationExample() {
  const openNotification = React.useCallback((placement) => {
    Notification.open({
      title: '标题名称',
      content: '这是一条可以自动关闭的消息通知',
      placement,
      duration: 3000,
    });
  }, []);

  return (
    <>
      <Button onClick={() => openNotification('top-left')}>左上角</Button>
      <Button onClick={() => openNotification('top-right')}>右上角</Button>
      <br />
      <Button onClick={() => openNotification('bottom-left')}>左下角</Button>
      <Button onClick={() => openNotification('bottom-right')}>右下角</Button>
    </>
  );
}
