import React from 'react';
import { List, ListItem } from '@tencent/tdesign-react';

export default function BasicList() {
  const listData = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];
  return (
    <List loading="load-more">
      {listData.map((item) => (
        <ListItem key={item.id}>{item.content}</ListItem>
      ))}
    </List>
  );
}
