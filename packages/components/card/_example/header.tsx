import React from 'react';
import { Card, MessagePlugin } from 'tdesign-react';

const clickHandler = () => {
  MessagePlugin.success('操作');
};

export default function HeaderCard() {
  return (
    <Card
      title="标题"
      actions={
        <a href={null} onClick={clickHandler} style={{ cursor: 'pointer' }}>
          操作
        </a>
      }
      bordered
      hoverShadow
      style={{ width: '400px' }}
    >
      卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
    </Card>
  );
}
