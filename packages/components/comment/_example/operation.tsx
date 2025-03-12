import React from 'react';
import { Comment } from 'tdesign-react';
import { ThumbUpIcon, ChatIcon } from 'tdesign-icons-react';

export default function OperationComment() {
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

  return (
    <Comment
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      author="评论作者名"
      datetime="今天16:38"
      content="评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
    />
  );
}
