import React from 'react';
import { Message } from 'tdesign-react';

export default function () {
  return (
    <>
      <Message duration={0} theme="info">
        用户表示普通操作信息提示
      </Message>
      <Message duration={0} theme="success" style={{ marginTop: 16 }}>
        用户表示操作引起一定后果
      </Message>
      <Message duration={0} theme="warning" style={{ marginTop: 16 }}>
        用于表示操作顺利达成
      </Message>
      <Message duration={0} theme="error" style={{ marginTop: 16 }}>
        用于表示操作引起严重的后果
      </Message>
      <Message duration={0} theme="question" style={{ marginTop: 16 }}>
        用于帮助用户操作的信息提示
      </Message>
    </>
  );
}
