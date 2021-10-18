import React from 'react';
import { Comment, IconFont } from '@tencent/tdesign-react';

export default function replyComment() {
  const actionTextStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    lineHeight: '15px',
  }

  const authorIconStyle = {
    display: 'inline-block',
    margin: '0 4px',
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

  const replyAuthor = (
    <>
      <span>评论作者名B</span>
      <IconFont name="caret-right-small" size="small" style={authorIconStyle}/>
      <span>评论作者名A</span>
    </>
  )

  const replyElement = (
    <Comment
      avatar="https://tdesign.gtimg.com/list-icon.png"
      author= {replyAuthor}
      datetime="今天16:38"
      content="B评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
    />
  )

  return (
    <Comment
      avatar="https://tdesign.gtimg.com/list-icon.png"
      author="评论作者名A"
      datetime="今天16:38"
      content="A评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
      actions={actions}
      reply={replyElement}
    />
  );
}
