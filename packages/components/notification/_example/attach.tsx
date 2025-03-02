import React, { useEffect, useRef } from 'react';
import { NotificationPlugin, Button, Space } from 'tdesign-react';

export default function NotificationExample() {
  const timerRef = useRef<any>();
  const openInfoNotification = () => {
    NotificationPlugin.info({
      title: '信息',
      content: '这是一条可以自动关闭的消息通知， 未配置attach',
      duration: 3000,
    });
  };

  const openSuccessNotification = () => {
    NotificationPlugin.success({
      attach: '#app',
      title: '信息',
      content: '这是一条可以自动关闭的消息通知, 配置attach 为 #app',
      duration: 3000,
    });
  };

  const openWarningNotification = () => {
    NotificationPlugin.warning({
      attach: '#app',
      title: '信息',
      content: '这是一条可以自动关闭的消息通知, 配置attach 为 #app',
      duration: 3000,
    });
  };

  const openErrorNotification = () => {
    NotificationPlugin.error({
      attach: '#app',
      title: '信息',
      content: '这是一条可以自动关闭的消息通知, 配置attach 为 #app',
      duration: 3000,
    });
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      NotificationPlugin.error({
        attach: '#app',
        title: '信息',
        content: '这是一条可以自动关闭的消息通知, useEffect定时2000ms触发',
        duration: 10000,
      });
    }, 2000);
  }, []);

  return (
    <Space>
      <Button onClick={() => openInfoNotification()}>信息</Button>
      <Button onClick={() => openSuccessNotification()}>成功</Button>
      <Button onClick={() => openWarningNotification()}>警告</Button>
      <Button onClick={() => openErrorNotification()}>错误</Button>
    </Space>
  );
}
