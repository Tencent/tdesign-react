import React from 'react';
import { Card, Row, Col, Button, Divider, Avatar, Dropdown, MessagePlugin } from 'tdesign-react';
import { ChatIcon, ShareIcon, ThumbUpIcon, Icon } from 'tdesign-icons-react';

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

export default function HeaderFooterActionsCard() {
  return (
    <Card
      title="标题"
      description="卡片内容"
      actions={
        <Dropdown options={options} onClick={clickHandler} minColumnWidth="112">
          <Button variant="text" shape="square">
            <Icon name="more" size="24" />
          </Button>
        </Dropdown>
      }
      bordered
      cover="https://tdesign.gtimg.com/site/source/card-demo.png"
      style={{ width: '400px' }}
      avatar={<Avatar size="40px" image="https://tdesign.gtimg.com/site/avatar-boy.jpg"></Avatar>}
      footer={
        <Row align="middle" justify="center">
          <Col flex="auto" align="middle">
            <Button block variant="text">
              <ThumbUpIcon size={24}></ThumbUpIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto" align="middle">
            <Button block variant="text">
              <ChatIcon size={24}></ChatIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto" align="middle">
            <Button block variant="text">
              <ShareIcon size={24}></ShareIcon>
            </Button>
          </Col>
        </Row>
      }
    ></Card>
  );
}
