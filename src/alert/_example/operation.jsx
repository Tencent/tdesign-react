import React from 'react';
import { Alert, Space } from 'tdesign-react';

export default function AlertOperation() {
  const operation = <span>相关操作</span>;
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Alert
        theme="success"
        message="这是一条成功的消息提示"
        operation={operation}
        close
        onClosed={() => {
          console.log('onClosed');
        }}
      />
      <Alert theme="info" message="这是一条普通的消息提示" operation={operation} close />
      <Alert theme="warning" message="这是一条警示消息" operation={operation} close />
      <Alert theme="error" message="高危操作/出错信息提示" operation={operation} close />
    </Space>
  );
}
