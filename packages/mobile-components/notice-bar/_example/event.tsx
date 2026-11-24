import React from 'react';
import { NoticeBar, Toast } from 'tdesign-mobile-react';
import { ChevronRightIcon } from 'tdesign-icons-react';

export default function Event() {
  const handleClick = (context: string) => {
    Toast({ message: `click:${context}` });
  };
  return (
    <NoticeBar
      visible
      className="notice-bar-demo-block"
      content="这是一条普通的消息通知"
      suffixIcon={<ChevronRightIcon />}
      onClick={handleClick}
    />
  );
}
