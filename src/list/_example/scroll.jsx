import React from 'react';
import { List } from 'tdesign-react';

const { ListItem, ListItemMeta } = List;

export default function BasicList() {
  const listData = [
    { id: 1, content: '列表内容列表内容列表内容', title: '列表主内容', icon: 'https://tdesign.gtimg.com/list-icon.png' },
    { id: 2, content: '列表内容列表内容列表内容', title: '列表主内容', icon: 'https://tdesign.gtimg.com/list-icon.png' },
    { id: 3, content: '列表内容列表内容列表内容', title: '列表主内容', icon: 'https://tdesign.gtimg.com/list-icon.png' },
    { id: 4, content: '列表内容列表内容列表内容', title: '列表主内容', icon: 'https://tdesign.gtimg.com/list-icon.png' },
  ];

  const style = {
    height: '300px',
    overflow: 'auto',
  };

  const handleScroll = ({ e: event, scrollTop, scrollBottom }) => {
    console.log(event, scrollTop, scrollBottom);
  };

  return (
    <List style={style} onScroll={handleScroll}>
      {listData.map((item) => (
        <ListItem key={item.id}>
          <ListItemMeta image={item.n} title={item.title} description={item.content} />
        </ListItem>
      ))}
    </List>
  );
}
