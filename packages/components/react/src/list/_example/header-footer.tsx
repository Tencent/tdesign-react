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
    <>
      <List header='这里是 Header' footer='这里是 Footer'>
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>
      <div style={{ marginBottom: '16px' }}></div>
      <List header={<p>通过 TNode 插入的 Header</p>} footer={<p>通过 TNode 插入的 Footer</p>}>
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>
    </>
  );
}
