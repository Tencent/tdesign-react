import React, { useState, useEffect, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import isFunction from 'lodash/isFunction';
import { StyledProps, ScrollContainerElement } from '../common';
import { TdAffixProps } from './type';
import { getScrollContainer } from '../_util/dom';
import useConfig from '../_util/useConfig';

export interface AffixProps extends TdAffixProps, StyledProps {}

interface StateRef {
  ticking: boolean;
  oldWidth: number;
  oldHeight: number;
  containerHeight: number;
  scrollContainer?: ScrollContainerElement;
}

export interface AffixRef {
  calcInitValue: () => void;
  handleScroll: () => void;
}

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const { children, zIndex, container = () => window, offsetBottom, offsetTop, onFixedChange } = props;

  const [affixed, setAffixed] = useState<boolean>(false);
  const { classPrefix } = useConfig();

  const affixRef = useRef<HTMLDivElement>(null);
  const affixWrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<StateRef>({ ticking: false, oldWidth: 0, oldHeight: 0, containerHeight: 0 });

  const handleScroll = useCallback(() => {
    const { ticking, scrollContainer, containerHeight, oldWidth } = stateRef.current;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const affixEl = affixRef.current;

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

        if (affixEl) {
          if (fixedTop !== false) {
            affixEl.className = `${classPrefix}-affix`;
            affixEl.style.top = `${fixedTop}px`;
            affixEl.style.width = `${oldWidth}px`;

            if (zIndex) {
              affixEl.style.zIndex = `${zIndex}`;
            }
          } else {
            affixEl.removeAttribute('class');
            affixEl.removeAttribute('style');
          }
        }

        const affixed = fixedTop !== false;

        setAffixed(affixed);

        if (isFunction(onFixedChange)) {
          onFixedChange(affixed, { top: +fixedTop });
        }

        stateRef.current.ticking = false;
      });
    }
    stateRef.current.ticking = true;
  }, [classPrefix, offsetBottom, offsetTop, zIndex, onFixedChange]);

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
    const { clientWidth, clientHeight } = affixRef.current || {};
    stateRef.current = {
      ...stateRef.current,
      scrollContainer,
      oldWidth: clientWidth,
      oldHeight: clientHeight,
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

  const { oldWidth, oldHeight } = stateRef.current;

  return (
    <div ref={affixWrapRef}>
      {affixed ? <div style={{ width: `${oldWidth}px`, height: `${oldHeight}px` }}></div> : ''}
      <div ref={affixRef}>{children}</div>
    </div>
  );
});

export default Affix;
