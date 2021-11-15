import React from 'react';
import { Message } from 'tdesign-react';

export default function () {
  return (
    <>
      <Message duration={0} theme="info">
        用户表示普通操作信息提示
      </Message>
      <Message duration={0} theme="info" style={{ marginTop: 16 }}>
        用于表示普通操作信息提示, 可关闭, 通常信息较长
      </Message>
    </>
  );
}
