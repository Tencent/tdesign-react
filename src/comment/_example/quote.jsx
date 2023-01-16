import React from 'react';
import { Comment } from 'tdesign-react';
import { ThumbUpIcon, ChatIcon } from 'tdesign-icons-react';

export default function quoteComment() {
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

  const quoteElement = (
    <Comment
      author="引用内容标题"
      content="引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容。"
    />
  );

  return (
    <Comment
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      author="评论作者名A"
      datetime="今天16:38"
      content="A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
      quote={quoteElement}
    />
  );
}
