import React from 'react';
import { List, Link, Space } from 'tdesign-react';

const { ListItem } = List;

export default function BasicList() {

  return (
    <List>
      <ListItem action={
        <Space>
          <Link theme="primary" hover="color">操作1</Link>
          <Link theme="primary" hover="color">操作2</Link>
          <Link theme="primary" hover="color">操作3</Link>
        </Space>
      }>列表内容的描述性文字</ListItem>
      <ListItem action={
        <Space>
          <Link theme="primary" hover="color">操作1</Link>
          <Link theme="primary" hover="color">操作2</Link>
          <Link theme="primary" hover="color">操作3</Link>
        </Space>
      }>列表内容的描述性文字</ListItem>
    </List>
  );
}
