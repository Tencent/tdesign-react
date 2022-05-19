import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdCommentProps } from './type';
import { commentDefaultProps } from './defaultProps';

export interface CommentProps extends TdCommentProps, StyledProps {}

const Comment = forwardRef((props: CommentProps, ref: React.Ref<HTMLDivElement>) => {
  const { actions, author, avatar, content, datetime, reply, quote, className, style } = props;

  const { classPrefix } = useConfig();

  const avatarElement = avatar ? (
    <div className={`${classPrefix}-comment__avatar`}>
      {typeof avatar === 'string' ? (
        <img src={avatar} alt="" className={`${classPrefix}-comment__avatar-image`} />
      ) : (
        avatar
      )}
    </div>
  ) : null;

  const authorDatetimeContent = (author || datetime) && (
    <div className={`${classPrefix}-comment__author`}>
      {author && <span className={`${classPrefix}-comment__name`}>{author}</span>}
      {datetime && <span className={`${classPrefix}-comment__time`}>{datetime}</span>}
    </div>
  );

  const quoteElement = quote ? <div className={`${classPrefix}-comment__quote`}>{quote}</div> : null;

  const actionsElement =
    actions && actions.length ? (
      <ul className={`${classPrefix}-comment__actions`}>
        {actions.map((action, index) => (
          <li key={`action-${index}`}>{action}</li>
        ))}
      </ul>
    ) : null;

  const contentElement = (
    <div className={`${classPrefix}-comment__content`}>
      {authorDatetimeContent}
      <div className={`${classPrefix}-comment__detail`}>{content}</div>
      {quoteElement}
      {actionsElement}
    </div>
  );

  const replyElement = reply ? <div className={classNames(`${classPrefix}-comment__reply`)}>{reply}</div> : null;

  return (
    <div ref={ref} style={style} className={classNames(className, [`${classPrefix}-comment`])}>
      <div className={`${classPrefix}-comment__inner`}>
        {avatarElement}
        {contentElement}
      </div>
      {replyElement}
    </div>
  );
});

Comment.displayName = 'Comment';
Comment.defaultProps = commentDefaultProps;

export default Comment;
