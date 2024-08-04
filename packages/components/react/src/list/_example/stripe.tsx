import React from 'react';
import { List } from 'tdesign-react';

const { ListItem } = List;

export default function BasicList() {
  const listData = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];
  return (
    <List stripe={true} split={false}>
      {listData.map((item) => (
        <ListItem key={item.id}>{item.content}</ListItem>
      ))}
    </List>
  );
}
