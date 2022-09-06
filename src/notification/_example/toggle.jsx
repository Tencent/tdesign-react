import React from 'react';
import { NotificationPlugin, Button } from 'tdesign-react';

export default function NotificationExample() {
  const openNotification = () => {
    const notification = NotificationPlugin.info({
      title: '信息',
      content: '这是一条不会自动关闭的消息通知',
      closeBtn: true,
      duration: 0,
      onCloseBtnClick: () => {
        NotificationPlugin.close(notification);
      },
    });
  };

  return <Button onClick={openNotification}>自由控制关闭时机</Button>;
}
