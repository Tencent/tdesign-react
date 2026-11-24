import { useTimeout } from 'ahooks';
import classNames from 'classnames';
import { isObject } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CheckCircleFilledIcon, CloseIcon, ErrorCircleFilledIcon, InfoCircleFilledIcon } from 'tdesign-icons-react';
import { convertUnit } from '../_util/convertUnit';
import parseTNode from '../_util/parseTNode';
import type { StyledProps, TNode } from '../common';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import Link from '../link';
import { messageDefaultProps } from './defaultProps';
import useMarqueeAnimation from './hooks/useMarqueeAnimation';
import useCssTransition from '../_util/hooks/useCssTransition';
import type { TdMessageProps } from './type';

export interface MessageProps extends TdMessageProps, StyledProps {
  container?: Element;
  children?: React.ReactNode;
}

const iconDefault = {
  info: <InfoCircleFilledIcon size={22} />,
  success: <CheckCircleFilledIcon size={22} />,
  warning: <ErrorCircleFilledIcon size={22} />,
  error: <ErrorCircleFilledIcon size={22} />,
};

const changeNumToStr = (arr: TdMessageProps['offset'] = []) => arr.map((item) => convertUnit(item));

const getMessageStylesOffset = (offset: TdMessageProps['offset']) => {
  const arr = changeNumToStr(offset);
  return offset
    ? {
        top: arr[0],
        right: arr[1],
        left: arr[1],
      }
    : {};
};

const Message: React.FC<MessageProps> = (originProps) => {
  const props = useDefaultProps(originProps, messageDefaultProps);
  const {
    className,
    style,
    children,
    align,
    closeBtn,
    duration,
    theme,
    marquee,
    visible,
    defaultVisible,
    link,
    zIndex,
    content,
    icon,
    container,
    onDurationEnd,
    onCloseBtnClick,
  } = props;

  const name = usePrefixClass('message');

  /**
   * duration为0时，取消倒计时
   */
  const [messageDuration] = useState<number | null>(duration || null);

  const [messageVisible, setVisible] = useState<boolean>(visible ?? defaultVisible);

  useEffect(() => {
    if (typeof visible !== 'undefined' && messageVisible !== visible) {
      setVisible(visible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const contentRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const cssTransitionState = useCssTransition({
    contentRef,
    classPrefix: 'message',
    container: container as HTMLElement,
  });

  useTimeout(() => {
    setVisible(false);
    onDurationEnd?.();
  }, messageDuration);

  const onLinkClick = (e) => {
    props.onLinkClick?.(e);
  };

  const leftIcon = parseTNode(icon, null, iconDefault[theme] || iconDefault.info);

  const getLinkContent = () => {
    if (typeof link === 'string') {
      return <Link theme="primary" content={link} />;
    }

    // React element is also an object,need to add extra judgement
    if (isObject(link) && !React.isValidElement(link) && typeof link !== 'function') {
      return <Link theme="primary" {...link} />;
    }

    return parseTNode(link as TNode);
  };

  const clickCloseButton = (e) => {
    setVisible(false);
    onCloseBtnClick?.({ e });
  };

  const renderCloseBtn = () =>
    closeBtn === true ? (
      <CloseIcon className={`${name}--close-btn`} size={22} />
    ) : (
      parseTNode(closeBtn as string | TNode)
    );

  useMarqueeAnimation(marquee, textWrapRef, textRef);

  return (
    <CSSTransition in={messageVisible} appear {...cssTransitionState.props} unmountOnExit>
      <div
        className={classNames(`${name}`, className, `${name}--${theme}`, { [`${name}-align--${align}`]: !!align })}
        ref={contentRef}
        style={{ zIndex, ...getMessageStylesOffset(props.offset), ...style }}
      >
        <div className={`${name}__icon--left`}>{leftIcon}</div>
        <div ref={textWrapRef} className={classNames(`${name}__text-wrap`, { [`${name}__text-nowrap`]: marquee })}>
          <div ref={textRef} className={`${name}__text`}>
            {parseTNode(content) || parseTNode(children)}
          </div>
        </div>
        {link && (
          <div className={`${name}__link`} onClick={(e) => onLinkClick({ e })}>
            {getLinkContent()}
          </div>
        )}
        {closeBtn && (
          <div className={`${name}__close-wrap ${name}__icon--right`} onClick={clickCloseButton}>
            {renderCloseBtn()}
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

Message.displayName = 'Message';

export default Message;
