import React, { useState } from 'react';
import { NotificationIcon } from 'tdesign-icons-react';
import { Button, Message } from 'tdesign-mobile-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const messages = [
    {
      duration: 5000,
      content: '这是一条纯文字的消息通知 5s消失',
      icon: false,
    },
    {
      duration: 5000,
      content: '这是一条带图标的消息通知 5s消失',
      icon: true,
    },
    {
      closeBtn: true,
      duration: 0,
      content: '这是一条带关闭的消息通知 常驻可关闭',
      icon: true,
    },
    {
      duration: 5000,
      content: '这是一条普通的通知信息，这是一条普通的通知信息，这是一条普通的通知信息',
      marquee: true,
      icon: false,
    },
  ];

  const content = ['纯文字的通知', '带图标的通知', '带关闭的通知', '可滚动的通知'];

  const onClick = (index) => {
    Message.info({
      ...messages[index],
    });
  };

  return (
    <div className="container">
      {content.map((v, index) => (
        <Button
          block
          size="large"
          variant="outline"
          theme="primary"
          className="button"
          onClick={() => onClick(index)}
          key={index}
        >
          {v}
        </Button>
      ))}
      <Button block size="large" variant="outline" theme="primary" className="button" onClick={() => setVisible(true)}>
        带按钮的通知
      </Button>
      <Message
        visible={visible}
        link="链接"
        duration={0}
        content="这是一条带操作的消息通知"
        icon={<NotificationIcon size={22} />}
      />
    </div>
  );
}
