import React from 'react';
import { Alert, Space } from 'tdesign-react';

export default function AlertClose() {
  return (
    <Space direction="vertical">
      <Alert theme="success" message="这是一条成功的消息提示" close />
      <Alert theme="info" message="这是一条普通的消息提示" close="关闭" />
      <Alert theme="warning" message="这是一条警示消息" close="知道了" />
      <Alert theme="error" message="高危操作/出错信息提示" close={<span>自定义关闭</span>} />
    </Space>
  );
}
