import React from 'react';
import { Comment, List } from 'tdesign-react';
import { ThumbUpIcon, ChatIcon } from 'tdesign-icons-react';

const { ListItem } = List;

export default function ListComment() {
  const actions = [
    <React.Fragment key="ThumbUp">
      <ThumbUpIcon size="16px" />
      <span>6</span>
    </React.Fragment>,
    <React.Fragment key="Chat">
      <ChatIcon size="16px" />
      <span>回复</span>
    </React.Fragment>,
  ];

  const commentsData = [
    {
      id: 'A',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      author: '评论作者名A',
      datetime: '今天16:38',
      content:
        'A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
    {
      id: 'B',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      author: '评论作者名B',
      datetime: '今天16:38',
      content:
        'B评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
    {
      id: 'C',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      author: '评论作者名C',
      datetime: '今天16:38',
      content:
        'C评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。',
      actions,
    },
  ];

  return (
    <List split={true}>
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
