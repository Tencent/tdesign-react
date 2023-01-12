import React from 'react';
import { Card, Avatar, Row, Col, Button, Divider, Dropdown, MessagePlugin, Space } from 'tdesign-react';
import { UserIcon, ChatIcon, ShareIcon, ThumbUpIcon, HeartIcon, MoreIcon } from 'tdesign-icons-react';

const { Group: AvatarGroup } = Avatar;

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

export default function FooterActionsCard() {
  return (
    <Space direction="vertical">
      <Card
        bordered
        theme="poster2"
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        footer={
          <Row align="middle" justify="center">
            <Col flex="auto" align="middle">
              <Button block variant="text" shape="square">
                <ThumbUpIcon size={24}></ThumbUpIcon>
              </Button>
            </Col>
            <Divider layout="vertical"></Divider>
            <Col flex="auto" align="middle">
              <Button block variant="text" shape="square">
                <ChatIcon size={24}></ChatIcon>
              </Button>
            </Col>
            <Divider layout="vertical"></Divider>
            <Col flex="auto" align="middle">
              <Button block variant="text" shape="square">
                <ShareIcon size={24}></ShareIcon>
              </Button>
            </Col>
          </Row>
        }
      ></Card>
      <Card
        bordered
        theme="poster2"
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        actions={
          <Col flex="auto" align="middle">
            <Dropdown options={options} onClick={clickHandler}>
              <Button variant="text" shape="square">
                <MoreIcon size={24}></MoreIcon>
              </Button>
            </Dropdown>
          </Col>
        }
        footer={
          <Row align="middle" justify="center">
            <Col flex="auto">
              <Button variant="text" shape="square" style={{ marginRight: '8px' }}>
                <HeartIcon size={16}></HeartIcon>
              </Button>
              <Button variant="text" shape="square">
                <ShareIcon size={16}></ShareIcon>
              </Button>
            </Col>
          </Row>
        }
      ></Card>
      <Card
        bordered
        theme="poster2"
        cover="https://tdesign.gtimg.com/site/source/card-demo.png"
        style={{ width: '400px' }}
        actions={
          <Col flex="auto" align="middle">
            <Dropdown options={options} onClick={clickHandler}>
              <Button variant="text" shape="square">
                <MoreIcon size={24}></MoreIcon>
              </Button>
            </Dropdown>
          </Col>
        }
        footer={
          <AvatarGroup max={2} cascading="left-up">
            <Avatar image="https://tdesign.gtimg.com/site/avatar-boy.jpg"></Avatar>
            <Avatar>Q</Avatar>
            <Avatar>C</Avatar>
            <Avatar>G</Avatar>
            <Avatar icon={<UserIcon />}></Avatar>
          </AvatarGroup>
        }
      ></Card>
    </Space>
  );
}
