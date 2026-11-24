import { isFunction, isString } from 'lodash-es';
import { AttachNode } from '../../common';
import { elementInViewport, getWindowScroll, getWindowSize } from './shared';
/**
 * 获取元素某个 css 对应的值
 * @param element 元素
 * @param propName css 名
 * @returns string
 */
export function getElmCssPropValue(element: HTMLElement, propName: string): string {
  let propValue = '';

  if (document.defaultView && document.defaultView.getComputedStyle) {
    propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
  }

  if (propValue && propValue.toLowerCase) {
    return propValue.toLowerCase();
  }

  return propValue;
}

/**
 * 判断元素是否处在 position fixed 中
 * @param element 元素
 * @returns boolean
 */
export function isFixed(element: HTMLElement): boolean {
  const p = element.parentNode as HTMLElement;

  if (!p || p.nodeName === 'HTML') {
    return false;
  }

  if (getElmCssPropValue(element, 'position') === 'fixed') {
    return true;
  }

  return isFixed(p);
}

/**
 * 获取元素相对于另一个元素的位置（或者说相对于 body）
 * 感谢 `meouw`: http://stackoverflow.com/a/442474/375966
 */
export function getRelativePosition(elm: HTMLElement, relativeElm: HTMLElement = document.body) {
  const { scrollTop, scrollLeft } = getWindowScroll();
  const { top: elmTop, left: elmLeft } = elm.getBoundingClientRect();
  const { top: relElmTop, left: relElmLeft } = relativeElm.getBoundingClientRect();
  const relativeElmPosition = getElmCssPropValue(relativeElm, 'position');

  if (
    (relativeElm.tagName.toLowerCase() !== 'body' && relativeElmPosition === 'relative') ||
    relativeElmPosition === 'sticky'
  ) {
    return {
      top: elmTop - relElmTop,
      left: elmLeft - relElmLeft,
    };
  }

  if (isFixed(elm)) {
    return {
      top: elmTop,
      left: elmLeft,
    };
  }

  return {
    top: elmTop + scrollTop,
    left: elmLeft + scrollLeft,
  };
}

export function getTargetElm(elm: AttachNode): HTMLElement {
  if (elm) {
    let targetElement: HTMLElement;
    if (isString(elm)) {
      targetElement = document.querySelector(elm) as HTMLElement;
    } else if (isFunction(elm)) {
      targetElement = elm() as HTMLElement;
    } else {
      throw new Error('elm should be string or function');
    }
    if (targetElement) {
      return targetElement as HTMLElement;
    }
    if (process?.env?.NODE_ENV !== 'test') {
      throw new Error('There is no element with given.');
    }
  } else {
    return document.body;
  }
  return document.body;
}

export function getScrollParent(element: HTMLElement) {
  let style = window.getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = /(auto|scroll)/;

  if (style.position === 'fixed') return document.body;

  for (let parent = element; parent.parentElement; ) {
    parent = parent.parentElement;
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return document.body;
}

export function scrollToParentVisibleArea(element: HTMLElement) {
  const parent = getScrollParent(element);
  if (parent === document.body) return;
  // !todo 逻辑待验证
  if (elementInViewport(element, parent)) return;
  parent.scrollTop = element.offsetTop - parent.offsetTop;
}

export function scrollToElm(elm: HTMLElement) {
  const rect = elm.getBoundingClientRect();

  if (!elementInViewport(elm)) {
    const winHeight = getWindowSize().height;
    // const top = rect.bottom - (rect.bottom - rect.top);
    window.scrollTo({
      top: rect.top - (winHeight / 2 - rect.height / 2),
      behavior: 'smooth',
    });
  }
}
