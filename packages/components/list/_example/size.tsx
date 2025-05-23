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
    <div className="tdesign-demo-item__body tdesign-demo-item__body--list">
      <h4>尺寸-小</h4>
      <List size="small">
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>

      <h4 style={{ marginTop: 32 }}>尺寸-中（默认）</h4>
      <List>
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>

      <h4 style={{ marginTop: 32 }}>尺寸-大</h4>
      <List size="large">
        {listData.map((item) => (
          <ListItem key={item.id}>{item.content}</ListItem>
        ))}
      </List>
    </div>
  );
}
