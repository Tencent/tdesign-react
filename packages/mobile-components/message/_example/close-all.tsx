import React from 'react';
import { Message, Button } from 'tdesign-mobile-react';

export default function () {
  const showMessage = ({
    theme,
    content = '这是一条通知信息',
    duration = 5000,
    index,
  }: {
    theme: string;
    content?: string;
    duration?: number;
    index: number;
  }) => {
    if (Message[theme]) {
      Message[theme]({
        offset: [58 * index + 10, 16],
        content,
        duration,
        icon: true,
        zIndex: 20000,
        context: document.querySelector('.button-demo-closeall'),
      });
    }
  };

  const openAllMessage = () => {
    ['info', 'warning', 'success', 'error'].forEach((theme, index) => {
      setTimeout(() => {
        showMessage({ theme, index });
      }, 300 * index);
    });
  };

  const closeAllMessage = () => {
    Message.closeAll();
  };

  return (
    <div className="container button-demo-closeall">
      <Button block size="large" variant="outline" theme="primary" className="button" onClick={openAllMessage}>
        打开多个通知
      </Button>
      <Button block size="large" variant="outline" theme="primary" className="button" onClick={closeAllMessage}>
        关闭所有通知
      </Button>
    </div>
  );
}
