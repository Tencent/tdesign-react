import React from 'react';
import { Notification } from '@tencent/tdesign-react';

export default function NotificationExample() {
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Notification
          theme="info"
          title="普通通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Notification
          theme="error"
          title="危险通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Notification
          theme="warning"
          title="告警通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Notification
          theme="success"
          title="成功通知"
          content="这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知这是一条消息通知"
        />
      </div>
    </>
  );
}
