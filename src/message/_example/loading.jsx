import React from 'react';
import { Message } from '@tencent/tdesign-react';

export default function () {
  return (
    <Message duration={0} theme="loading">
      用于表示操作正在生效的过程中
    </Message>
  );
}
