import React from 'react';
import { Notification, Button } from '@tdesign/react';

export default function NotificationExample() {
  const openInfoNotification = React.useCallback(() => {
    Notification.info({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  }, []);

  const openSuccessNotification = React.useCallback(() => {
    Notification.success({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  }, []);

  const openWarningNotification = React.useCallback(() => {
    Notification.warning({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  }, []);

  const openErrorNotification = React.useCallback(() => {
    Notification.error({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  }, []);

  return (
    <>
      <Button onClick={() => openInfoNotification()}>信息</Button>
      <Button onClick={() => openSuccessNotification()}>成功</Button>
      <Button onClick={() => openWarningNotification()}>警告</Button>
      <Button onClick={() => openErrorNotification()}>错误</Button>
    </>
  );
}
