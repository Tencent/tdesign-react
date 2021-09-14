import React from 'react';
import { StyledProps } from '@TdTypes/StyledProps';
import { TdCommentProps } from '../_type/components/comment';

export interface CommentProps extends TdCommentProps, StyledProps {
  children?: React.ReactNode;
}

const Comment = (props: CommentProps) => <div>{props}</div>;

Comment.displayName = 'Comment';

export default Comment;
