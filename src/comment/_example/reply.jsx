import React from 'react';
import { Comment } from 'tdesign-react';
import { CaretRightSmallIcon, ThumbUpIcon, ChatIcon } from 'tdesign-icons-react';

export default function replyComment() {
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

  const replyAuthor = (
    <>
      <span>评论作者名B</span>
      <CaretRightSmallIcon size="small" />
      <span>评论作者名A</span>
    </>
  );

  const replyElement = (
    <Comment
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      author={replyAuthor}
      datetime="今天16:38"
      content="B评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
    />
  );

  return (
    <Comment
      className="comment-reply"
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      author="评论作者名A"
      datetime="今天16:38"
      content="A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
      reply={replyElement}
    />
  );
}
