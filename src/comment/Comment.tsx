import React, { forwardRef } from 'react';
import { StyledProps } from '@TdTypes/StyledProps';
import useConfig from '@tencent/tdesign-react/_util/useConfig';
import classNames from 'classnames';
import { TdCommentProps } from '../_type/components/comment';

export interface CommentProps extends TdCommentProps, StyledProps {}

const Comment = forwardRef((props: CommentProps, ref: React.Ref<HTMLDivElement>) => {
  const { actions, author, avatar, content, datetime, reply, theme = 'comment', className, style = {} } = props;

  const { classPrefix } = useConfig();

  const avatarElement = avatar ? (
    <div className={`${classPrefix}-comment__avatar`}>
      {typeof avatar === 'string' ? (
        <img src={avatar} alt="comment-avatar" className={`${classPrefix}-comment__avatar-image`} />
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
      {actionsElement}
    </div>
  );

  const renderReply = (nestedChildren: any) => (
    <div
      className={classNames(`${classPrefix}-comment__reply`, {
        [`${classPrefix}-comment__reply--comment`]: theme === 'comment',
        [`${classPrefix}-comment__reply--quote`]: theme === 'quote',
      })}
    >
      {nestedChildren}
    </div>
  );

  return (
    <div ref={ref} style={style} className={classNames(className, [`${classPrefix}-comment`])}>
      <div className={`${classPrefix}-comment__inner`}>
        {avatarElement}
        {contentElement}
      </div>
      {reply ? renderReply(reply) : null}
    </div>
  );
});

Comment.displayName = 'Comment';

export default Comment;
