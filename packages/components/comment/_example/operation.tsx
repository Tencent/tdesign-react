import React from 'react';
import { ChatIcon, ThumbUpIcon } from 'tdesign-icons-react';
import { Comment } from 'tdesign-react';

export default function OperationComment() {
  const commentProps = {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: '评论作者名',
    datetime: '今天16:38',
    content: '这里是评论者写的评论内容。',
  };

  const action = (
    <>
      <React.Fragment key="ThumbUp">
        <ThumbUpIcon size="16px" />
        <span>6</span>
      </React.Fragment>
      <React.Fragment key="Chat">
        <ChatIcon size="16px" />
        <span>回复</span>
      </React.Fragment>
    </>
  );

  const actionList = [
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ margin: 0 }}>TNode</h3>
      <Comment {...commentProps} actions={action} />

      <h3 style={{ margin: 0 }}>Array</h3>
      <Comment {...commentProps} actions={actionList} />
    </div>
  );
}
