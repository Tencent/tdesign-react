import React from 'react';
import { ChatIcon, ShareIcon, ThumbUpIcon, UserIcon } from 'tdesign-icons-react';
import { Avatar, Button, Card, Col, Divider, Row, Tag } from 'tdesign-react';

export default function FooterCard() {
  return (
    <Card
      actions={<Tag theme="success">默认标签</Tag>}
      bordered
      cover="https://tdesign.gtimg.com/site/source/card-demo.png"
      style={{ width: '400px' }}
      avatar={
        <Avatar size="56px">
          <UserIcon></UserIcon>
        </Avatar>
      }
      footer={
        <Row align="middle" justify="center">
          <Col flex="auto">
            <Button variant="text">
              <ThumbUpIcon></ThumbUpIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto">
            <Button variant="text">
              <ChatIcon></ChatIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto">
            <Button variant="text">
              <ShareIcon></ShareIcon>
            </Button>
          </Col>
        </Row>
      }
    ></Card>
  );
}
