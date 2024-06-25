import React from 'react';
import { Message, Space } from 'tdesign-react';

export default function () {
  return (
    <Space direction="vertical">
      <Message duration={0} theme="info" closeBtn={true}>
        默认关闭按钮
      </Message>
      <Message duration={0} theme="info" closeBtn={'关闭'}>
        自定义关闭按钮（文字）
      </Message>
      <Message duration={0} theme="info" closeBtn={(close) => <div onClick={close}>x</div>}>
        自定义关闭按钮（函数）
      </Message>
      <Message duration={0} theme="info" closeBtn={<div onClick={() => console.log('close')}>x</div>}>
        自定义关闭按钮（ReactNode）
      </Message>
    </Space>
  );
}
