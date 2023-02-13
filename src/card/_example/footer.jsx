import React from 'react';
import { Card, Tag, Avatar, Row, Col, Button, Divider } from 'tdesign-react';
import { UserIcon, ChatIcon, ShareIcon, ThumbUpIcon } from 'tdesign-icons-react';

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
          <Col flex="auto" align="middle">
            <Button variant="text">
              <ThumbUpIcon></ThumbUpIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto" align="middle">
            <Button variant="text">
              <ChatIcon></ChatIcon>
            </Button>
          </Col>
          <Divider layout="vertical"></Divider>
          <Col flex="auto" align="middle">
            <Button variant="text">
              <ShareIcon></ShareIcon>
            </Button>
          </Col>
        </Row>
      }
    ></Card>
  );
}
