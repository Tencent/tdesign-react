import React, { useEffect, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import isFunction from 'lodash/isFunction';
import { StyledProps, ScrollContainerElement } from '../common';
import { TdAffixProps } from './type';
import { getScrollContainer } from '../_util/dom';
import useConfig from '../hooks/useConfig';
import { affixDefaultProps } from './defaultProps';

export interface AffixProps extends TdAffixProps, StyledProps {}

export interface AffixRef {
  handleScroll: () => void;
}

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const { children, content, zIndex, container, offsetBottom, offsetTop, className, style, onFixedChange } = props;

  const { classPrefix } = useConfig();

  const affixRef = useRef<HTMLDivElement>(null);
  const affixWrapRef = useRef<HTMLDivElement>(null);
  const placeholderEL = useRef<HTMLElement>(null);
  const scrollContainer = useRef<ScrollContainerElement>(null);

  const ticking = useRef(false);

  // 这里是通过控制 wrap 的 border-top 到浏览器顶部距离和 offsetTop 比较
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        // top = 节点到页面顶部的距离，包含 scroll 中的高度
        const {
          top: wrapToTop = 0,
          width: wrapWidth = 0,
          height: wrapHeight = 0,
        } = affixWrapRef.current?.getBoundingClientRect() ?? { top: 0 };

        // 容器到页面顶部的距离, windows 为0
        let containerToTop = 0;
        if (scrollContainer.current instanceof HTMLElement) {
          containerToTop = scrollContainer.current.getBoundingClientRect().top;
        }

        const calcTop = wrapToTop - containerToTop; // 节点顶部到 container 顶部的距离
        const containerHeight =
          scrollContainer.current[scrollContainer.current instanceof Window ? 'innerHeight' : 'clientHeight'] -
          wrapHeight;
        const calcBottom = containerToTop + containerHeight - (offsetBottom ?? 0); // 计算 bottom 相对应的 top 值

        let fixedTop: number | false;
        if (offsetTop !== undefined && calcTop <= offsetTop) {
          // top 的触发
          fixedTop = containerToTop + offsetTop;
        } else if (offsetBottom !== undefined && wrapToTop >= calcBottom) {
          // bottom 的触发
          fixedTop = calcBottom;
        } else {
          fixedTop = false;
        }

        if (affixRef.current) {
          const affixed = fixedTop !== false;
          const placeholderStatus = affixWrapRef.current.contains(placeholderEL.current);

          if (affixed) {
            // 定位
            affixRef.current.className = `${classPrefix}-affix`;
            affixRef.current.style.top = `${fixedTop}px`;
            affixRef.current.style.width = `${wrapWidth}px`;
            affixRef.current.style.height = `${wrapHeight}px`;

            if (zIndex) {
              affixRef.current.style.zIndex = `${zIndex}`;
            }

            // 插入占位节点
            if (!placeholderStatus) {
              placeholderEL.current.style.width = `${wrapWidth}px`;
              placeholderEL.current.style.height = `${wrapHeight}px`;
              affixWrapRef.current.appendChild(placeholderEL.current);
            }
          } else {
            affixRef.current.removeAttribute('class');
            affixRef.current.removeAttribute('style');

            // 删除占位节点
            placeholderStatus && placeholderEL.current.remove();
          }

          if (isFunction(onFixedChange)) {
            onFixedChange(affixed, { top: +fixedTop });
          }
        }

        ticking.current = false;
      });
    }
    ticking.current = true;
  }, [classPrefix, offsetBottom, offsetTop, onFixedChange, zIndex]);

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  useEffect(() => {
    // 创建占位节点
    placeholderEL.current = document.createElement('div');
  }, []);

  useEffect(() => {
    scrollContainer.current = getScrollContainer(container);
    if (scrollContainer.current) {
      handleScroll();
      scrollContainer.current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        scrollContainer.current.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [container, handleScroll]);

  return (
    <div ref={affixWrapRef} className={className} style={style}>
      <div ref={affixRef}>{children || content}</div>
    </div>
  );
});

Affix.displayName = 'Affix';
Affix.defaultProps = affixDefaultProps;

export default Affix;
