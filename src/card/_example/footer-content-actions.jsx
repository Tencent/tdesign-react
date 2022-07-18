import React from 'react';
import { Card, Button, Dropdown, MessagePlugin, Comment } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

const options = [
  {
    content: '操作一',
    value: 1,
  },
  {
    content: '操作二',
    value: 2,
  },
];

const clickHandler = (data) => {
  MessagePlugin.success(`选中【${data.value}】`);
};

export default function FooterContentActionsCard() {
  return (
    <Card
      actions={
        <Dropdown options={options} onClick={clickHandler} minColumnWidth="112">
          <Button variant="text" shape="square">
            <Icon name="more" size="24" />
          </Button>
        </Dropdown>
      }
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
