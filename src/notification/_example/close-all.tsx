import React from 'react';
import { NotificationPlugin, Button, Space } from 'tdesign-react';

export default function NotificationExample() {
  const openMore = () => {
    NotificationPlugin.info({
      title: '标题名称',
      content: '这是一条需要手动关闭的消息通知',
      duration: 0,
    });
    NotificationPlugin.warning({
      title: '标题名称',
      content: '这是第二条通知',
      duration: 0,
    });
    NotificationPlugin.error({
      title: '标题名称',
      content: '这是第三条通知',
      duration: 0,
    });
  };

  const closeAll = () => {
    NotificationPlugin.closeAll();
  };

  return (
    <Space>
      <Button onClick={openMore}>点击打开多个消息</Button>
      <Button onClick={closeAll}>点击关闭多个消息</Button>
    </Space>
  );
}
