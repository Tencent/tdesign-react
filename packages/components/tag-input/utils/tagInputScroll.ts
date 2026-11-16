/**
 * TagInput 滚动相关逻辑
 * 当标签数量过多时，输入框显示不下则需要滚动查看
 */

const SCROLL_CONTAINER_CLASS = 'input__prefix';
const SCROLLABLE_CLASS = 'input__prefix--scrollable';

/** 根据根元素查找滚动容器 .{classPrefix}-input__prefix */
export function getScrollContainer(root: HTMLElement, classPrefix: string): HTMLElement | null {
  return root.querySelector(`.${classPrefix}-${SCROLL_CONTAINER_CLASS}`);
}

/** 计算元素的最大可滚动距离 scrollWidth - clientWidth */
export function getScrollDistance(el: HTMLElement): number {
  return el.scrollWidth - el.clientWidth;
}

/** 设置/移除 scrollable 状态类，控制 overflow 是否开放 */
export function setScrollableClass(el: HTMLElement, classPrefix: string, scrollable: boolean): void {
  const className = `${classPrefix}-${SCROLLABLE_CLASS}`;
  if (scrollable) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }
}

/** 处理滚轮事件：MAC deltaX / Windows deltaY 兼容 */
export function handleWheelScroll(el: HTMLElement, e: { deltaX: number; deltaY: number }): void {
  const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (delta === 0) return;
  const max = getScrollDistance(el);
  // eslint-disable-next-line no-param-reassign
  el.scrollLeft = Math.max(0, Math.min(el.scrollLeft + delta, max));
}

/** 滚动到最左侧并移除 scrollable class（鼠标离开时） */
export function scrollToLeft(el: HTMLElement, classPrefix: string): void {
  // eslint-disable-next-line no-param-reassign
  el.scrollLeft = 0;
  setScrollableClass(el, classPrefix, false);
}

/** 滚动到最右侧并开启 scrollable class */
export function scrollToRight(el: HTMLElement, classPrefix: string): void {
  setScrollableClass(el, classPrefix, true);
  // eslint-disable-next-line no-param-reassign
  el.scrollLeft = getScrollDistance(el);
}
