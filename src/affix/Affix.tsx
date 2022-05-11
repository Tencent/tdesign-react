import React, { useEffect, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import isFunction from 'lodash/isFunction';
import { StyledProps, ScrollContainerElement } from '../common';
import { TdAffixProps } from './type';
import { getScrollContainer } from '../_util/dom';
import useConfig from '../_util/useConfig';

export interface AffixProps extends TdAffixProps, StyledProps {
  children: React.ReactNode;
}

interface StateRef {
  ticking: boolean;
  containerHeight: number;
  scrollContainer?: ScrollContainerElement;
}

export interface AffixRef {
  calcInitValue: () => void;
  handleScroll: () => void;
}

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const { children, zIndex, container = () => window, offsetBottom, offsetTop, onFixedChange } = props;

  const { classPrefix } = useConfig();

  const affixRef = useRef<HTMLDivElement>(null);
  const affixWrapRef = useRef<HTMLDivElement>(null);
  const placeholderEL = useRef(document.createElement('div'));

  const stateRef = useRef<StateRef>({ ticking: false, containerHeight: 0 });

  const handleScroll = useCallback(() => {
    const { ticking, scrollContainer, containerHeight } = stateRef.current;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // top = 节点到页面顶部的距离，包含 scroll 中的高度
        const top = affixWrapRef.current?.getBoundingClientRect()?.top ?? 0;

        // containerTop = 容器到页面顶部的距离
        let containerTop = 0;
        if (scrollContainer instanceof HTMLElement) {
          containerTop = scrollContainer.getBoundingClientRect().top;
        }

        let fixedTop: number | false;
        const calcTop = top - containerTop; // 节点顶部到 container 顶部的距离
        const calcBottom = containerTop + containerHeight - (offsetBottom ?? 0); // 计算 bottom 相对应的 top 值

        if (offsetTop !== undefined && calcTop <= offsetTop) {
          // top 的触发
          fixedTop = containerTop + offsetTop;
        } else if (offsetBottom !== undefined && top >= calcBottom) {
          // bottom 的触发
          fixedTop = calcBottom;
        } else {
          fixedTop = false;
        }

        if (affixRef.current) {
          const affixed = fixedTop !== false;
          const placeholderStatus = affixWrapRef.current.contains(placeholderEL.current);

          if (affixed) {
            const { clientWidth, clientHeight } = affixWrapRef.current;

            affixRef.current.className = `${classPrefix}-affix`;
            affixRef.current.style.top = `${fixedTop}px`;
            affixRef.current.style.width = `${clientWidth}px`;
            affixRef.current.style.height = `${clientHeight}px`;

            if (zIndex) {
              affixRef.current.style.zIndex = `${zIndex}`;
            }

            // 插入占位节点
            if (!placeholderStatus) {
              setTimeout(() => {
                placeholderEL.current.style.width = `${clientWidth}px`;
                placeholderEL.current.style.height = `${clientHeight}px`;
                affixWrapRef.current.appendChild(placeholderEL.current);
              });
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

        stateRef.current.ticking = false;
      });
    }
    stateRef.current.ticking = true;
  }, [classPrefix, offsetBottom, offsetTop, onFixedChange, zIndex]);

  const calcInitValue = useCallback(() => {
    const scrollContainer = getScrollContainer(container);
    if (!scrollContainer) return;
    // 获取当前可视的高度
    let containerHeight = 0;
    if (scrollContainer instanceof Window) {
      containerHeight = scrollContainer.innerHeight;
    } else {
      containerHeight = scrollContainer.clientHeight;
    }
    // 被包裹的子节点宽高
    const { clientHeight } = affixRef.current || {};
    stateRef.current = {
      ...stateRef.current,
      scrollContainer,
      containerHeight: containerHeight - clientHeight,
    };

    handleScroll();
  }, [container, handleScroll]);

  useImperativeHandle(ref, () => ({
    calcInitValue,
    handleScroll,
  }));

  useEffect(() => {
    calcInitValue();
    if (stateRef.current.scrollContainer) {
      stateRef.current.scrollContainer.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        stateRef.current.scrollContainer?.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [calcInitValue, handleScroll]);

  return (
    <div ref={affixWrapRef} style={{ width: '100%' }}>
      <div ref={affixRef}>{children}</div>
    </div>
  );
});

export default Affix;
