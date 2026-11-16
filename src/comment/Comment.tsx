import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isObject } from 'lodash-es';
import { ChevronDownSIcon, ChevronUpSIcon } from 'tdesign-icons-react';
import { CommentActionItem, CommentFold, CommentFoldState, TdCommentProps } from './type';
import { usePrefixClass } from '../hooks/useClass';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Avatar, { AvatarProps } from '../avatar';
import parseTNode, { parseContentTNode } from '../_util/parseTNode';
import { StyledProps, TNode } from '../common';

export interface CommentProps extends TdCommentProps, StyledProps {}

const DEFAULT_COMMENT_FOLDS: CommentFold = {
  state: 'collapsed',
  total: 0,
  step: 3,
};
const Comment: React.FC<CommentProps> = (props) => {
  const {
    className,
    style,
    actions,
    author,
    avatar,
    content,
    datetime,
    folds,
    defaultFolds,
    reply,
    children,
    onActions,
    onFolds,
  } = props;
  const [innerFoldsState, setInnerFoldsState] = useState<CommentFoldState>(defaultFolds?.state || 'collapsed');
  const foldSteps = useRef(0);
  const replyBodyRef = useRef<HTMLDivElement>(null);
  const replyInnerRef = useRef<HTMLDivElement>(null);
  const rootClassName = usePrefixClass('comment');
  const [locale] = useLocaleReceiver('comment');

  const isControlled = folds !== undefined;
  const commentFolds = folds || defaultFolds || DEFAULT_COMMENT_FOLDS;

  // 折叠/展开文案，优先使用业务传入的 content，其次回退到全局国际化配置
  const userContent = commentFolds.content || {};
  const foldsContent = {
    collapsed: userContent.collapsed ?? locale.collapsedText,
    partial: userContent.partial ?? [locale.expandMoreText, locale.collapseText],
    expanded: userContent.expanded ?? locale.collapseText,
  };

  // 受控模式下，当外部 folds.state 变化时同步 foldSteps
  useEffect(() => {
    if (!isControlled) {
      return;
    }
    if (folds.state === 'collapsed') {
      foldSteps.current = 0;
    } else if (folds.state === 'expanded') {
      foldSteps.current = (commentFolds.step || 3) - 1;
    }
  }, [isControlled, folds?.state, commentFolds.step]);

  // 当前实际使用的折叠状态
  const curFoldsState: CommentFoldState = isControlled ? folds.state || 'collapsed' : innerFoldsState;

  // 首次渲染前同步设置高度，避免闪烁（无动画）
  useLayoutEffect(() => {
    const body = replyBodyRef.current;
    const inner = replyInnerRef.current;
    if (body && inner) {
      body.style.height = `${inner.scrollHeight}px`;
    }
  }, []);

  // 监听回复区内容高度变化，驱动过渡动画
  useEffect(() => {
    const body = replyBodyRef.current;
    const inner = replyInnerRef.current;
    if (!body || !inner) return;

    const observer = new ResizeObserver(() => {
      body.style.height = `${inner.scrollHeight}px`;
    });

    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const handleClickActions = (event: MouseEvent, action: CommentActionItem | TNode) => {
    onActions?.({ action, e: event });
  };

  const handleClickFold = (event: MouseEvent, isExpand: boolean) => {
    if (!isExpand) {
      // 收起：重置为 collapsed
      foldSteps.current = 0;
      if (!isControlled) {
        setInnerFoldsState('collapsed');
      }
      onFolds?.({
        fold: { ...commentFolds, state: 'collapsed' },
        e: event,
      });
      return;
    }

    // 展开：递增步进并计算下一状态
    foldSteps.current += 1;
    const nextState: CommentFoldState = foldSteps.current >= (commentFolds.step || 3) - 1 ? 'expanded' : 'partial';

    if (!isControlled) {
      setInnerFoldsState(nextState);
    }
    onFolds?.({
      fold: { ...commentFolds, state: nextState },
      e: event,
    });
  };

  const renderAvatar = () => {
    if (isObject(avatar) && !React.isValidElement(avatar) && typeof avatar !== 'function') {
      return <Avatar className={`${rootClassName}__avatar`} {...(avatar as AvatarProps)} />;
    }
    return parseTNode(avatar);
  };

  const renderAuthor = () => <div className={`${rootClassName}__author`}>{parseTNode(author)}</div>;
  const renderContent = () => <div className={`${rootClassName}__content`}>{parseTNode(content)}</div>;
  const renderFooter = () => {
    const renderActions = () => {
      if (!actions) {
        return null;
      }
      if (!Array.isArray(actions)) {
        return (
          <div onClick={(e) => handleClickActions(e as unknown as MouseEvent, actions)}>{parseTNode(actions)}</div>
        );
      }
      const renderLeftPlacement = () =>
        actions
          .filter((item) => item.placement === 'start')
          .map((item) => (
            <div key={item.key} onClick={(e) => handleClickActions(e as unknown as MouseEvent, item)}>
              {parseContentTNode(item.content, { disabled: item.disabled })}
            </div>
          ));
      const renderRightPlacement = () =>
        actions
          .filter((item) => item.placement === 'end')
          .map((item) => (
            <div key={item.key} onClick={(e) => handleClickActions(e as unknown as MouseEvent, item)}>
              {parseContentTNode(item.content, { disabled: item.disabled })}
            </div>
          ));
      return (
        <>
          <div className={`${rootClassName}-block`}>{renderLeftPlacement()}</div>
          <div className={`${rootClassName}-block`}>{renderRightPlacement()}</div>
        </>
      );
    };
    return (
      <div className={`${rootClassName}__bottom`}>
        <div className={`${rootClassName}__date`}>{parseTNode(datetime)}</div>
        <div className={`${rootClassName}__actions`}>{renderActions()}</div>
      </div>
    );
  };

  const renderFolds = () => {
    const renderFoldsContent = () => {
      if (curFoldsState === 'collapsed') {
        // 全收起
        return (
          <div
            className={`${rootClassName}__folds-item`}
            onClick={(e) => handleClickFold(e as unknown as MouseEvent, true)}
          >
            {foldsContent.collapsed as ReactNode}
            <ChevronDownSIcon size="16px" />
          </div>
        );
      }
      if (curFoldsState === 'partial') {
        // 半展开
        const partialContent = foldsContent.partial;
        return (
          <>
            <div
              className={`${rootClassName}__folds-item`}
              onClick={(e) => handleClickFold(e as unknown as MouseEvent, true)}
            >
              {(Array.isArray(partialContent) ? partialContent[0] : partialContent) as ReactNode}
              <ChevronDownSIcon size="16px" />
            </div>
            <div
              className={`${rootClassName}__folds-item`}
              onClick={(e) => handleClickFold(e as unknown as MouseEvent, false)}
            >
              {(Array.isArray(partialContent) ? partialContent[1] : null) as ReactNode}
              <ChevronUpSIcon size="16px" />
            </div>
          </>
        );
      }
      // 全展开
      return (
        <div
          className={`${rootClassName}__folds-item`}
          onClick={(e) => handleClickFold(e as unknown as MouseEvent, false)}
        >
          {foldsContent.expanded as ReactNode}
          <ChevronUpSIcon size="16px" />
        </div>
      );
    };
    if (!commentFolds.total || commentFolds.total <= 1) {
      return null;
    }
    return <div className={`${rootClassName}__folds`}>{renderFoldsContent()}</div>;
  };

  const renderReply = () => {
    const replyContent = reply || children;
    return (
      <div className={`${rootClassName}__reply`}>
        <div ref={replyBodyRef} className={`${rootClassName}__reply-body`}>
          <div ref={replyInnerRef} className={`${rootClassName}__reply-inner`}>
            {parseTNode(replyContent)}
          </div>
        </div>
        {renderFolds()}
      </div>
    );
  };

  return (
    <div className={classNames(rootClassName, className)} style={style}>
      <div className={`${rootClassName}__inner`}>
        {renderAvatar()}
        <div className={`${rootClassName}__detail`}>
          {renderAuthor()}
          {renderContent()}
          {renderFooter()}
        </div>
      </div>
      {renderReply()}
    </div>
  );
};

Comment.displayName = 'Comment';

export default Comment;
