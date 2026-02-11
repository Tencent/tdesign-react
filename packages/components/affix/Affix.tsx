import { isFunction } from 'lodash-es';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { isWindow } from '../_util/dom';
import { getScrollContainer } from '../_util/scroll';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { affixDefaultProps } from './defaultProps';

import type { ScrollContainerElement, StyledProps } from '../common';
import type { TdAffixProps } from './type';

export interface AffixProps extends TdAffixProps, StyledProps {}

export interface AffixRef {
  handleScroll: () => void;
}

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const { children, content, zIndex, container, offsetBottom, offsetTop, className, style, onFixedChange } =
    useDefaultProps(props, affixDefaultProps);

  const { classPrefix } = useConfig();

  const [containerReady, setContainerReady] = useState(false);

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
          bottom: wrapToBottom = 0,
          width: wrapWidth = 0,
          height: wrapHeight = 0,
        } = affixWrapRef.current?.getBoundingClientRect() ?? { top: 0, bottom: 0 };

        // 容器到页面顶部的距离, windows 为0
        let containerToTop = 0;
        let containerToBottom = 0;
        if (isWindow(scrollContainer.current)) {
          containerToBottom = scrollContainer.current.innerHeight;
        } else if (scrollContainer.current instanceof HTMLElement) {
          const rect = scrollContainer.current.getBoundingClientRect();
          containerToTop = rect.top;
          containerToBottom = rect.bottom;
        }

        const calcTop = wrapToTop - containerToTop; // 节点顶部到 container 顶部的距离

        let fixedTop: number | false;
        if (props.offsetBottom !== undefined && props.offsetTop === undefined) {
          const bottomThreshold = containerToBottom - (offsetBottom ?? 0);
          if (wrapToBottom >= bottomThreshold) {
            fixedTop = bottomThreshold - wrapHeight;
          } else {
            fixedTop = false;
          }
        } else {
          const containerHeight =
            scrollContainer.current?.[isWindow(scrollContainer.current) ? 'innerHeight' : 'clientHeight'] -
            wrapHeight;
          const calcBottom = containerToTop + containerHeight - (offsetBottom ?? 0); // 计算 bottom 相对应的 top 值
          if (calcTop <= offsetTop) {
            // top 的触发
            fixedTop = containerToTop + offsetTop;
          } else if (wrapToTop >= calcBottom) {
            // bottom 的触发
            fixedTop = calcBottom;
          } else {
            fixedTop = false;
          }
        }

        if (affixRef.current) {
          const affixed = fixedTop !== false;
          let placeholderStatus = affixWrapRef.current.contains(placeholderEL.current);
          const prePlaceholderStatus = placeholderStatus;

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
              placeholderStatus = true;
            }
          } else {
            affixRef.current.removeAttribute('class');
            affixRef.current.removeAttribute('style');

            // 删除占位节点
            if (placeholderStatus) {
              placeholderEL.current.remove();
              placeholderStatus = false;
            }
          }
          if (prePlaceholderStatus !== placeholderStatus && isFunction(onFixedChange)) {
            onFixedChange(affixed, { top: +fixedTop });
          }
        }

        ticking.current = false;
      });
    }
    ticking.current = true;
  }, [classPrefix, offsetBottom, offsetTop, zIndex, onFixedChange, props.offsetBottom, props.offsetTop]);

  useImperativeHandle(ref, () => ({
    handleScroll,
  }));

  useEffect(() => {
    // 创建占位节点
    placeholderEL.current = document.createElement('div');
  }, []);

  useEffect(() => {
    const checkContainerExist = () => {
      const el = getScrollContainer(container);
      const isReady = isWindow(el) || el instanceof HTMLElement;
      setContainerReady(isReady);
      return isReady;
    };

    if (checkContainerExist()) return;

    const observer = new MutationObserver(() => {
      if (checkContainerExist()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [container]);

  useEffect(() => {
    if (!containerReady) return;

    const newContainer = getScrollContainer(container);
    if (!newContainer) return; // 容器没准备好

    // 清理旧的监听器
    if (scrollContainer.current) {
      scrollContainer.current.removeEventListener('scroll', handleScroll);
    }

    scrollContainer.current = newContainer;

    handleScroll();
    scrollContainer.current.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // 当 container 不是 window 时，也需要监听 window 的 scroll 事件
    // 这样当整个页面滚动时，可以确保 affix 元素不会超出容器范围
    const isContainerNotWindow = !isWindow(scrollContainer.current);
    if (isContainerNotWindow) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
      if (isContainerNotWindow) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [container, containerReady, handleScroll]);

  return (
    <div ref={affixWrapRef} className={className} style={style}>
      <div ref={affixRef}>{children || content}</div>
    </div>
  );
});

Affix.displayName = 'Affix';

export default Affix;
