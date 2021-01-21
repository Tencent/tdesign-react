import React from 'react';
import { Notification, IconFont } from '@tencent/tdesign-react';

export default function NotificationExample() {
  return <Notification title="自定义icon" content="这是一条消息通知" icon={<IconFont name="more" />} />;
}
