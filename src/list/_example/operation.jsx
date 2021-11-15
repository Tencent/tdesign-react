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
    <List>
      {listData.map((item) => (
        <ListItem
          key={item.id}
          action={
            <>
              <li>
                <a href="" key="operate-one">
                  操作1
                </a>
              </li>
              <li>
                <a href="" key="operate-two">
                  操作2
                </a>
              </li>
            </>
          }
        >
          {item.content}
        </ListItem>
      ))}
    </List>
  );
}
