import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { BacktopIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import { TdBackTopProps } from './type';
import { backTopDefaultProps } from './defaultProps';
import useScroll from './useScroll';
import { scrollTo } from '../_util/dom';

export type BackTopProps = TdBackTopProps;

const getContainer = (container: string | Function) => {
  if (typeof container === 'string') {
    if (typeof document !== 'undefined') {
      return document.querySelector(container);
    }
  }
  if (typeof container === 'function') {
    return container();
  }
  return null;
};

const BackTop = (props: BackTopProps) => {
  const {
    theme,
    size,
    shape,
    target,
    visibleHeight,
    container,
    duration,
    content,
    offset,
    children,
    default: cusContent,
    className,
    style,
    onClick,
  } = props;
  const { classPrefix } = useConfig();
  const scrollContainer = useMemo(() => getContainer(container), [container]);
  const { scrollTop } = useScroll({ target: scrollContainer });
  const defaultContent = (
    <>
      <BacktopIcon className={`${classPrefix}-back-top__icon`} size={24} />
      <span className={`${classPrefix}-back-top__text`}>TOP</span>
    </>
  );
  const renderChildren = children || content || cusContent || defaultContent;

  const visible = useMemo(() => {
    if (typeof visibleHeight === 'string') {
      return scrollTop >= Number(visibleHeight.replace('px', ''));
    }
    return scrollTop >= visibleHeight;
  }, [scrollTop, visibleHeight]);

  const backTopStyle = useMemo(
    () => ({
      insetInlineEnd: offset[0],
      insetBlockEnd: offset[1],
      ...style,
    }),
    [offset, style],
  );

  const cls = classNames(
    `${classPrefix}-back-top`,
    `${classPrefix}-back-top--theme-${theme}`,
    `${classPrefix}-back-top--${shape}`,
    {
      [`${classPrefix}-back-top--show`]: visible,
      [`${classPrefix}-size-s`]: size === 'small',
      [`${classPrefix}-size-m`]: size === 'medium',
    },
    className,
  );

  const getBackTo = useCallback(() => {
    if (!target) return 0;
    const targetNode = getContainer(target);
    if (!targetNode) return 0;
    const rect = targetNode.getBoundingClientRect();
    const { y } = rect;
    return y;
  }, [target]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onClick?.({ e });
      const backTo = getBackTo();
      scrollTo(backTo, { container: scrollContainer, duration });
    },
    [duration, getBackTo, onClick, scrollContainer],
  );

  return (
    <button type="button" className={cls} style={backTopStyle} onClick={handleClick}>
      {renderChildren}
    </button>
  );
};

BackTop.displayName = 'BackTop';
BackTop.defaultProps = backTopDefaultProps;
export default BackTop;
