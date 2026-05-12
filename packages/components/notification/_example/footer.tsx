import React from 'react';
import { Notification } from 'tdesign-react';

export default function NotificationExample() {
  return (
    <Notification
      title="自定义底部详情"
      content="这是一条消息通知"
      footer={
        <div className="t-notification__detail">
          <span className="t-notification__detail-item">重启</span>
          <span className="t-notification__detail-item t-is-active">查看详情</span>
        </div>
      }
    />
  );
}
