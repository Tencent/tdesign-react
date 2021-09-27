import React from 'react';
import { Comment, IconFont } from '@tencent/tdesign-react';

export default function OperationComment() {
  const actionTextStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    lineHeight: '15px',
  }

  const actions = [
    <span key="thumbUp">
      <IconFont name="thumb-up" />
      <span style={actionTextStyle}>6</span>
    </span>,
    <span key="chat">
      <IconFont name="chat" />
      <span style={actionTextStyle}>回复</span>
    </span>
  ]

  return (
    <Comment
      avatar="https://tdesign.gtimg.com/list-icon.png"
      author="评论作者名"
      datetime="今天16:38"
      content="评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
    />
  );
}
