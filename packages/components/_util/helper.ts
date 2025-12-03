import { camelCase } from 'lodash-es';

export function omit(obj: object, fields: string[]): object {
  const shallowCopy = {
    ...obj,
  };
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export function removeEmptyAttrs<T>(obj: T): Partial<T> {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined' || obj[key] === null) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

export function getTabElementByValue(tabs: [] = [], value: string): object {
  const [result] = tabs.filter((item) => {
    const { id } = item as any;
    return id === value;
  });
  return result || null;
}

export function firstUpperCase(str: string): string {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (char: string) => char.toUpperCase());
}

// keyboard-event => onKeyboardEvent
export function getPropsApiByEvent(eventName: string) {
  return camelCase(`on-${eventName}`);
}

/**
 * 获取元素相对于容器(祖先)的偏移量
 * @param element 目标元素
 * @param container 容器元素
 * @returns 相对于容器的偏移量
 */
export function getOffsetTopToContainer(element: HTMLElement, container: HTMLElement) {
  let { offsetTop } = element;

  let current = element.offsetParent as HTMLElement;
  while (current && current !== container) {
    offsetTop += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return offsetTop;
}
