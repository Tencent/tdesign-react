import React from 'react';
import { Comment, List } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

const { ListItem } = List;

export default function ListComment() {
  const actionTextStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    lineHeight: '15px',
  };

  const actions = [
    <span key="thumbUp">
      <IconFont name="thumb-up" />
      <span style={actionTextStyle}>6</span>
    </span>,
    <span key="chat">
      <IconFont name="chat" />
      <span style={actionTextStyle}>回复</span>
    </span>,
  ];

  const commentsData = [
    {
      id: 'A',
      avatar: 'https://tdesign.gtimg.com/list-icon.png',
      author: '评论作者名A',
      datetime: '今天16:38',
      content:
        'A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
    {
      id: 'B',
      avatar: 'https://tdesign.gtimg.com/list-icon.png',
      author: '评论作者名B',
      datetime: '今天16:38',
      content:
        'B评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
    {
      id: 'C',
      avatar: 'https://tdesign.gtimg.com/list-icon.png',
      author: '评论作者名C',
      datetime: '今天16:38',
      content:
        'C评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
  ];

  return (
    <List>
      {commentsData.map((item) => (
        <ListItem key={item.id}>
          <Comment
            avatar={item.avatar}
            author={item.author}
            datetime={item.datetime}
            content={item.content}
            actions={actions}
          />
        </ListItem>
      ))}
    </List>
  );
}
