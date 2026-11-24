const trim = (str: string): string => (str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');

export const getSSRAttach = () => {
  if (process.env.NODE_ENV === 'test-snap') return 'body';
};

export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    // The event can be canceled, so we do so.
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

export function hasClass(el: Element, cls: string): any {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return ` ${el.className} `.indexOf(` ${cls} `) > -1;
}

export function addClass(el: Element, cls: string): any {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    // eslint-disable-next-line no-param-reassign
    el.className = curClass;
  }
}

export function removeClass(el: Element, cls: string): any {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!el.classList) {
    // eslint-disable-next-line no-param-reassign
    el.className = trim(curClass);
  }
}

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

/**
 * 获取当前视图的大小
 * @returns { width: number, height: number }
 */
export function getWindowSize(): { width: number; height: number } {
  if (window.innerWidth !== undefined) {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  const doc = document.documentElement;
  return { width: doc.clientWidth, height: doc.clientHeight };
}
