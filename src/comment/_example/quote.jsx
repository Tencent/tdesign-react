import React from 'react';
import { Comment } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

export default function quoteComment() {
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

  const quoteElement = (
    <Comment
      author="引用内容标题"
      content="引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容。"
    />
  );

  return (
    <Comment
      avatar="https://tdesign.gtimg.com/list-icon.png"
      author="评论作者名A"
      datetime="今天16:38"
      content="A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
      quote={quoteElement}
    />
  );
}
