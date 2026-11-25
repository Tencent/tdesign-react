import React from 'react';
import { NoticeBar } from 'tdesign-mobile-react';

export default function Base() {
  return <NoticeBar visible content="这是一条普通的通知消息" prefixIcon={null} />;
}
