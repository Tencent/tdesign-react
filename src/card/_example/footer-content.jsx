import React from 'react';
import { Card, Comment } from 'tdesign-react';

export default function FooterContentCard() {
  return (
    <Card
      bordered
      theme="poster2"
      cover="https://tdesign.gtimg.com/site/source/card-demo.png"
      style={{ width: '400px' }}
      footer={
        <Comment author="标题" content="卡片内容" avatar="https://tdesign.gtimg.com/site/avatar-boy.jpg"></Comment>
      }
    ></Card>
  );
}
