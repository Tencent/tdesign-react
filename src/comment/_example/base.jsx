import React from 'react';
import { Comment } from '@tencent/tdesign-react';
import moment from 'moment'

export default function BasicComment() {
  return (
    <Comment
      avatar="https://tdesign.gtimg.com/list-icon.png"
      author="评论作者名"
      datetime={moment().format('MM[月]DD[日] HH:mm')}
      content="评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
    />
  );
}
