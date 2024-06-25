import React from 'react';
import { Message, Space } from 'tdesign-react';

export default function () {
  return (
    <Space direction="vertical">
      <Message duration={0} theme="info">
        用户表示普通操作信息提示
      </Message>
      <Message duration={0} theme="success">
        用户表示操作引起一定后果
      </Message>
      <Message duration={0} theme="warning">
        用于表示操作顺利达成
      </Message>
      <Message duration={0} theme="error">
        用于表示操作引起严重的后果
      </Message>
      <Message duration={0} theme="question">
        用于帮助用户操作的信息提示
      </Message>
    </Space>
  );
}
