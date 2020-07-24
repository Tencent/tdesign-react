import React from 'react';
import { Notification } from '@tdesign/react';

export default function NotificationExample() {
  return (
    <>
      <Notification title="自定义内容（字符串）" content="这是一条消息通知" />
      <br />
      <Notification title="自定义内容" content={<div>这是一条消息通知</div>} />
    </>
  );
}
