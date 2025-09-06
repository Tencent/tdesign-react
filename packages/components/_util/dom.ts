import { isString } from 'lodash-es';
import { getCssVarsValue } from './style';

// 用于判断是否可使用 dom
export const canUseDocument = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * 返回是否 window 对象
 *
 * @export
 * @param {any} obj
 * @returns
 */
export const isWindow = (val: unknown): val is Window => val === window;

export const getAttach = (node: any): HTMLElement => {
  const attachNode = typeof node === 'function' ? node() : node;
  if (!attachNode) {
    return document.body;
  }
  if (isString(attachNode)) {
    return document.querySelector(attachNode);
  }
  if (attachNode instanceof HTMLElement) {
    return attachNode;
  }
  return document.body;
};

/**
 * 检查元素是否在父元素视图
 * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
 * @param elm 元素
 * @param parent
 * @returns boolean
 */
export function elementInViewport(elm: HTMLElement, parent?: HTMLElement): boolean {
  const rect = elm.getBoundingClientRect();
  if (parent) {
    const parentRect = parent.getBoundingClientRect();
    return (
      rect.top >= parentRect.top &&
      rect.left >= parentRect.left &&
      rect.bottom <= parentRect.bottom &&
      rect.right <= parentRect.right
    );
  }
  return rect.top >= 0 && rect.left >= 0 && rect.bottom + 80 <= window.innerHeight && rect.right <= window.innerWidth;
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

  if (getCssVarsValue('position', element) === 'fixed') {
    return true;
  }

  return isFixed(p);
}

/**
 * 获取当前视图的大小
 * @returns { width: number, height: number }
 */
export function getWindowSize(): { width: number; height: number } {
  if (canUseDocument) {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  return { width: 0, height: 0 };
}

export type BindElement = HTMLElement | Window | null | undefined;

export function getTargetRect(target: BindElement): DOMRect {
  return target !== window
    ? (target as HTMLElement).getBoundingClientRect()
    : ({ top: 0, bottom: window.innerHeight } as DOMRect);
}

export type BindElement = HTMLElement | Window | null | undefined;

export function getTargetRect(target: BindElement): DOMRect {
  return target !== window
    ? (target as HTMLElement).getBoundingClientRect()
    : ({ top: 0, bottom: window.innerHeight } as DOMRect);
}
