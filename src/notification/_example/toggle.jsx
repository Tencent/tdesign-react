import React from 'react';
import { Notification, Button } from '@tencent/tdesign-react';

export default function NotificationExample() {
  const openNotification = React.useCallback(() => {
    const notification = Notification.info({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      onCloseBtnClick: () => {
        notification.then((instance) => instance.close());
        // or
        Notification.close(notification);
      },
    });
  }, []);

  const openMore = React.useCallback(() => {
    Notification.info({
      title: '标题名称',
      content: '这是一条需要手动关闭的消息通知',
      duration: 0,
    });
    Notification.info({
      title: '标题名称',
      content: '这是一条需要手动关闭的消息通知',
      duration: 0,
    });
  }, []);

  const closeAll = React.useCallback(() => {
    Notification.closeAll();
  }, []);

  return (
    <>
      <Button onClick={openNotification}>自由控制关闭时机</Button>
      <Button onClick={openMore}>点击打开多个消息</Button>
      <Button onClick={closeAll}>点击关闭多个消息</Button>
    </>
  );
}
