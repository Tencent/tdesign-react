import { useCallback, useEffect, useMemo } from 'react';
import setStyle from '@tdesign/common-js/utils/setStyle';

import { canUseDocument } from '../_util/dom';
import useAnimation from './useAnimation';
import useConfig from './useConfig';

import type { RefObject } from 'react';

const period = 200;
const elementTransitionPeriod = 200;
const rippleExtraWidth = 20;
const rippleSkew = 'skewX(-8deg)';
const noneRippleBg = 'rgba(0, 0, 0, 0)';
const defaultRippleColor = 'rgba(0, 0, 0, 0.35)';

// 设置动画颜色 get the ripple animation color
const getRippleColor = (el: HTMLElement, fixedRippleColor?: string) => {
  // get fixed color from params
  if (fixedRippleColor) {
    return fixedRippleColor;
  }
  // get dynamic color from the dataset
  if (el?.dataset?.ripple) {
    const rippleColor = el.dataset.ripple;
    return rippleColor;
  }
  // use css variable
  const cssVariable = getComputedStyle(el).getPropertyValue('--ripple-color');
  if (cssVariable) {
    return cssVariable;
  }
  return defaultRippleColor;
};

const unwrapRippleEl = (el: HTMLElement | RefObject<HTMLElement | null> | null | undefined): HTMLElement | null => {
  if (!el) return null;
  if (el instanceof HTMLElement) return el;
  return el.current ?? null;
};

/**
 * 斜八角动画 hooks 支持三种方式使用
 * 1. fixedRippleColor 固定色值 useRipple(ref,fixedRippleColor);
 * 2. dynamicColor 动态色值 data.ripple="rippleColor" useRipple(ref)
 * 3. CSS variables（recommended） 配合节点对应 CSS 设置 --ripple-color useRipple(ref)
 * @param dom 需要使用斜八角动画的 DOM，或指向该 DOM 的 ref（避免在 ref callback 里 setState）
 * @param fixedRippleColor 斜八角的动画颜色
 */
export default function useRipple(
  el: HTMLElement | RefObject<HTMLElement | null> | null,
  fixedRippleColor?: string,
): void {
  const { classPrefix } = useConfig();
  // 全局配置
  const { keepRipple } = useAnimation();
  const rippleContainer = useMemo(() => {
    if (!canUseDocument) return null;
    const container = document.createElement('div');
    container.className = `${classPrefix}-ripple`;

    return container;
  }, [classPrefix]);

  // 为节点添加斜八角动画 add ripple to the DOM and set up the animation
  const handleAddRipple = useCallback(
    (e) => {
      const target = unwrapRippleEl(el);
      if (e.button !== 0 || !target || !keepRipple) return;
      const rippleColor = getRippleColor(target, fixedRippleColor);

      if (
        target.classList.contains(`${classPrefix}-is-active`) ||
        target.classList.contains(`${classPrefix}-is-disabled`) ||
        target.classList.contains(`${classPrefix}-is-checked`) ||
        target.classList.contains(`${classPrefix}-is-loading`)
      )
        return;

      const elStyle = getComputedStyle(target);

      const elBorder = parseInt(elStyle.borderWidth, 10);
      const border = elBorder > 0 ? elBorder : 0;

      if (rippleContainer.parentNode === null) {
        setStyle(rippleContainer, {
          position: 'absolute',
          left: `${0 - border}px`,
          top: `${0 - border}px`,
          width: `calc(100% + ${border * 2}px)`,
          height: `calc(100% + ${border * 2}px)`,
          borderRadius: elStyle.borderRadius,
          pointerEvents: 'none',
          overflow: 'hidden',
        });
        target.appendChild(rippleContainer);
      }
      // 新增一个 ripple
      const ripple = document.createElement('div');

      ripple.className = `${classPrefix}-ripple__inner`;

      setStyle(ripple, {
        marginTop: '0',
        marginLeft: '0',
        right: '100%',
        // 使用百分比尺寸与位移，让 ripple 在 loading icon 插入导致按钮变宽时仍覆盖完整按钮
        width: `calc(100% + ${rippleExtraWidth}px)`,
        height: '100%',
        transition: `transform ${period}ms cubic-bezier(.38, 0, .24, 1), background ${period * 2}ms linear`,
        transform: rippleSkew,
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 0,
        backgroundColor: rippleColor,
        opacity: '0.9',
      });

      // fix zIndex：避免遮盖内部元素
      const elMap = new WeakMap();
      for (let n = target.children.length, i = 0; i < n; ++i) {
        const child = target.children[i];
        if ((child as HTMLElement).style.zIndex === '' && child !== rippleContainer) {
          (child as HTMLElement).style.zIndex = '1';
          elMap.set(child, true);
        }
      }

      // fix position
      const initPosition = target.style.position ? target.style.position : getComputedStyle(target).position;
      if (initPosition === '' || initPosition === 'static') {
        // eslint-disable-next-line no-param-reassign
        target.style.position = 'relative';
      }
      rippleContainer.insertBefore(ripple, rippleContainer.firstChild);

      setTimeout(() => {
        ripple.style.transform = `translateX(calc(100% - ${rippleExtraWidth}px)) ${rippleSkew}`;
      }, 0);
      // 清除动画节点 clear ripple container
      let cleared = false;
      let classChangeObserver: MutationObserver | null = null;
      const handleClearRipple = () => {
        if (cleared) return;
        cleared = true;

        ripple.style.backgroundColor = noneRippleBg;

        if (classChangeObserver) {
          classChangeObserver.disconnect();
          classChangeObserver = null;
        }

        target.removeEventListener('pointerup', handleClearRipple, false);
        target.removeEventListener('pointerleave', handleClearRipple, false);

        setTimeout(
          () => {
            ripple.remove();
            if (rippleContainer.children.length === 0) rippleContainer.remove();
          },
          period * 2 + 100,
        );
      };

      if (typeof MutationObserver !== 'undefined') {
        classChangeObserver = new MutationObserver(() => {
          const cls = target.classList;
          if (
            cls.contains(`${classPrefix}-is-loading`) ||
            cls.contains(`${classPrefix}-is-disabled`) ||
            cls.contains(`${classPrefix}-is-active`) ||
            cls.contains(`${classPrefix}-is-checked`)
          ) {
            ripple.style.transition = `transform ${period}ms cubic-bezier(.38, 0, .24, 1), background ${elementTransitionPeriod}ms linear`;
            handleClearRipple();
          }
        });
        classChangeObserver.observe(target, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }

      target.addEventListener('pointerup', handleClearRipple, false);
      target.addEventListener('pointerleave', handleClearRipple, false);
    },
    [classPrefix, el, fixedRippleColor, rippleContainer, keepRipple],
  );

  useEffect(() => {
    const target = unwrapRippleEl(el);
    if (!target) return;
    target.addEventListener('pointerdown', handleAddRipple, false);

    return () => {
      target.removeEventListener('pointerdown', handleAddRipple, false);
    };
  }, [handleAddRipple, fixedRippleColor, el]);
}
