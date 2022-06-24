import React from 'react';
import { NotificationPlugin, Button, Space } from 'tdesign-react';

export default function NotificationExample() {
  const openInfoNotification = () => {
    NotificationPlugin.info({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  };

  const openSuccessNotification = () => {
    NotificationPlugin.success({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  };

  const openWarningNotification = () => {
    NotificationPlugin.warning({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  };

  const openErrorNotification = () => {
    NotificationPlugin.error({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      duration: 3000,
    });
  };

  return (
    <Space>
      <Button onClick={() => openInfoNotification()}>信息</Button>
      <Button onClick={() => openSuccessNotification()}>成功</Button>
      <Button onClick={() => openWarningNotification()}>警告</Button>
      <Button onClick={() => openErrorNotification()}>错误</Button>
    </Space>
  );
}
