import React from 'react';
import { Notification, Button } from '@tencent/tdesign-react';

export default function NotificationExample() {
  const openNotification = React.useCallback(() => {
    const notification = Notification.info({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知',
      onCloseBtnClick: () => {
        notification.then((instance) => instance.close());
        Notification.close(notification);
      },
    });
  }, []);

  return (
    <>
      <Button onClick={openNotification}>自由控制关闭时机</Button>
    </>
  );
}
