import React from 'react';
import { Alert, Space, Tag } from 'tdesign-react';

export default function AlertClose() {
  // eslint-disable-next-line no-alert
  const beforeClose = () => window.confirm('确认关闭吗？');

  const handleClosed = () => {
    console.log('关闭');
  };

  const warningClose = () => 'FunctionPropClose';

  return (
    <Space direction="vertical">
      <Alert theme="success" message="这是一条成功的消息提示" closeBtn />
      <Alert theme="info" message="这是一条普通的消息提示" closeBtn="知道了" onClose={beforeClose} />
      <Alert
        theme="warning"
        message="这是一条警示消息"
        closeBtn={warningClose()}
        onClose={beforeClose}
        onClosed={handleClosed}
      />
      <Alert
        theme="error"
        message="高危操作/出错信息提示"
        closeBtn={
          <Tag variant="outline" theme="danger">
            关闭
          </Tag>
        }
      />
    </Space>
  );
}
