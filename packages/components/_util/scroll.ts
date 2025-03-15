import { isString } from 'lodash-es';
import raf from 'raf';
import { ScrollContainer, ScrollContainerElement } from '../common';
import { isWindow } from './dom';
import { easeInOutCubic, EasingFunction } from './easing';

export function hasBodyScrollbar() {
  return document.body.scrollHeight > document.documentElement.clientHeight;
}

// 用于判断节点内容是否溢出
export const isNodeOverflow = (ele: Element | Element[]): boolean => {
  const { clientWidth = 0, scrollWidth = 0 } = ele as Element & { clientWidth: number; scrollWidth: number };

  if (scrollWidth > clientWidth) {
    return true;
  }
  return false;
};

/**
 * 获取滚动容器
 * 因为 document 不存在 scroll 等属性, 因此排除 document
 * window | HTMLElement
 * @param {ScrollContainerElement} [container='body']
 * @returns {ScrollContainer}
 */
export const getScrollContainer = (container: ScrollContainer = 'body'): ScrollContainerElement => {
  if (isString(container)) {
    return container ? (document.querySelector(container) as HTMLElement) : window;
  }
  if (typeof container === 'function') {
    return container();
  }
  return container || window;
};

/**
 * 获取滚动距离
 *
 * @export
 * @param {ScrollTarget} target
 * @param {boolean} isLeft true 为获取 scrollLeft, false 为获取 scrollTop
 * @returns {number}
 */
export function getScroll(target: ScrollTarget, isLeft?: boolean): number {
  // node 环境或者 target 为空
  if (typeof window === 'undefined' || !target) {
    return 0;
  }
  const method = isLeft ? 'scrollLeft' : 'scrollTop';
  let result = 0;
  if (isWindow(target)) {
    result = (target as Window)[isLeft ? 'pageXOffset' : 'pageYOffset'];
  } else if (target instanceof Document) {
    result = target.documentElement[method];
  } else if (target) {
    result = (target as HTMLElement)[method];
  }
  return result;
}

export type ScrollTarget = HTMLElement | Window | Document;

interface ScrollTopOptions {
  container?: ScrollTarget;
  duration?: number;
  easing?: EasingFunction;
}

export function scrollTo(target: number, opt: ScrollTopOptions) {
  const { container = window, duration = 450, easing = easeInOutCubic } = opt;
  const scrollTop = getScroll(container);
  const startTime = Date.now();
  return new Promise((res) => {
    const fnc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      const nextScrollTop = easing(Math.min(time, duration), scrollTop, target, duration);
      if (isWindow(container)) {
        (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
      } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
        (container as HTMLDocument).documentElement.scrollTop = nextScrollTop;
      } else {
        (container as HTMLElement).scrollTop = nextScrollTop;
      }
      if (time < duration) {
        raf(fnc);
      } else {
        // 由于上面步骤设置了 scrollTop, 滚动事件可能未触发完毕
        // 此时应该在下一帧再执行 res
        raf(res);
      }
    };
    raf(fnc);
  });
}

/**
 * 获取当前视图滑动的距离
 * @returns { scrollTop: number, scrollLeft: number }
 */
export function getWindowScroll(): { scrollTop: number; scrollLeft: number } {
  const { body } = document;
  const docElm = document.documentElement;
  const scrollTop = window.pageYOffset || docElm.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docElm.scrollLeft || body.scrollLeft;

  return { scrollTop, scrollLeft };
}

export type AnchorContainer = HTMLElement | Window;

export function getOffsetTop(target: HTMLElement, container: AnchorContainer) {
  const { top } = target.getBoundingClientRect();
  if (container === window) {
    // 减去 document 的边框
    return top - document.documentElement.clientTop;
  }
  return top - (container as HTMLElement).getBoundingClientRect().top;
}
