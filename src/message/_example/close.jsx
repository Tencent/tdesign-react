import React from 'react';
import { Message } from '@tencent/tdesign-react';

export default function () {
  return (
    <>
      <Message duration={0} theme="info" closeBtn={true}>
        默认关闭按钮
      </Message>
      <br />
      <Message duration={0} theme="info" closeBtn={'关闭'}>
        自定义关闭按钮（文字）
      </Message>
      <br />
      <Message duration={0} theme="info" closeBtn={(close) => <div onClick={close}>x</div>}>
        自定义关闭按钮（函数）
      </Message>
      <br />
      <Message duration={0} theme="info" closeBtn={<div onClick={() => console.log('close')}>x</div>}>
        自定义关闭按钮（ReactNode）
      </Message>
    </>
  );
}
