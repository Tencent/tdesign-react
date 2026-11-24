import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useConfig from '../hooks/useConfig';
import { TdStickyProps } from './type';
import { stickyDefaultProps } from './defaultProps';
import { resolveContainer } from '../_util/getContainer';
import useDefaultProps from '../hooks/useDefaultProps';
import useLayoutEffect from '../hooks/useLayoutEffect';
import getScrollParent from '../_util/getScrollParent';

export interface StickyProps extends TdStickyProps {
  children?: ReactNode;
}

const Sticky: FC<StickyProps> = (originProps) => {
  const props = useDefaultProps(originProps, stickyDefaultProps);

  const { children, container, disabled, offsetTop, zIndex, onScroll } = props;

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-sticky`;

  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const boxElement = boxRef?.current;
  const contentElement = contentRef?.current;

  const [boxStyles, seBoxStyles] = useState({});
  const [contentStyles, setContentStyles] = useState({});

  const [contentTop, setContentTop] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const [boxTop, setBoxTop] = useState(undefined);

  const containerRef = useRef(null);

  // 滚动监听器
  const scrollhandler = useCallback(() => {
    const boxTop = boxElement?.getBoundingClientRect()?.top;
    const contentTop = contentElement?.getBoundingClientRect()?.top;
    const contentHeight = contentElement?.getBoundingClientRect()?.height;
    setBoxTop(boxTop);
    setContentTop(contentTop);
    setContentHeight(contentHeight);
  }, [boxElement, contentElement]);

  /**
   * 用于处理content变成fixed定位脱离文档流，导致父级box高度为0
   */
  useLayoutEffect(() => {
    seBoxStyles({
      height: contentElement?.getBoundingClientRect()?.height,
    });
  }, [contentElement]);

  useEffect(() => {
    containerRef.current = resolveContainer(container);
  }, [container]);

  useLayoutEffect(() => {
    const style: any = {
      zIndex,
    };

    let isFixed = false;
    if (disabled) {
      setContentStyles(style);
      return;
    }
    const offsetTopNum = Number(offsetTop);

    if (containerRef.current) {
      const containerTop = containerRef.current?.getBoundingClientRect()?.top;
      const containerHeight = containerRef.current?.getBoundingClientRect()?.height;

      if (containerHeight + containerTop < offsetTopNum + contentHeight) {
        style.transform = `translate3d(0, ${containerHeight - contentHeight}px, 0)`;
      } else if (boxTop <= offsetTopNum) {
        style.position = 'fixed';
        style.top = `${offsetTopNum}px`;
        isFixed = true;
      }
    } else if (boxTop <= offsetTopNum) {
      style.position = 'fixed';
      style.top = `${offsetTopNum}px`;
      isFixed = true;
    }

    onScroll?.({ scrollTop: contentTop, isFixed });
    setContentStyles(style);

    // 这里只需要监听boxTop，不需要全部监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxTop]);

  useEffect(() => {
    const scroller = getScrollParent(boxElement);
    scroller?.addEventListener('scroll', scrollhandler);
    return () => {
      scroller?.removeEventListener('scroll', scrollhandler);
    };
  }, [boxElement, boxTop, contentTop, contentHeight, scrollhandler]);

  return (
    <>
      <div ref={boxRef} className={name} style={boxStyles}>
        <div ref={contentRef} className={`${name}__content`} style={contentStyles}>
          {children}
        </div>
      </div>
    </>
  );
};

Sticky.displayName = 'Sticky';

export default Sticky;
