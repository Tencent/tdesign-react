import React, { useEffect } from 'react';
import { Comment } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

const classStyles = `
  <style>
    .comment-reply > .t-comment__inner .t-comment__actions {
      margin-right: 24px;
    }
  </style>
`;

export default function replyComment() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const actionTextStyle = {
    display: 'inline-block',
    marginLeft: '6px',
    lineHeight: '15px',
  };

  const authorIconStyle = {
    display: 'inline-block',
    margin: '0 4px',
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

  const replyAuthor = (
    <>
      <span>评论作者名B</span>
      <IconFont name="caret-right-small" size="small" style={authorIconStyle} />
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
