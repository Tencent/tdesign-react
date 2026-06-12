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

/**
 * 保持用户的选择顺序：
 * - 保留已有项的原始顺序，将新选择的项追加到末尾
 * - 并移除当前值中已不存在的项
 * @param previousValues - 上一次的值数组（按照用户选择顺序排列）
 * @param currentValues - 当前完整的值数组（顺序可能是任意的）
 * @returns 保持用户选择顺序后的数组
 */
export function preserveSelectionOrder<T>(previousValues: T[], currentValues: T[]): T[] {
  const currentSet = new Set(currentValues);
  const existingValues = previousValues.filter((v) => currentSet.has(v));
  const existingSet = new Set(existingValues);
  const newValues = currentValues.filter((v) => !existingSet.has(v));
  return [...existingValues, ...newValues];
}
