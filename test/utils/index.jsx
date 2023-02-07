import '@testing-library/jest-dom';
import { createEvent, fireEvent, act } from '@testing-library/react';
import _userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { EVENTS_MAP } from './events';

export * from '@testing-library/react';
export * from 'vitest';

export const userEvent = _userEvent;

// 延迟判断
export function mockTimeout(callback, timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback && callback()), timeout);
  });
}

export async function mockDelay(timeout) {
  if (!timeout) {
    await act(() => {});
  } else {
    await act(async () => {
      await mockTimeout(() => {}, timeout);
    });
  }
}

// input text
export function simulateInputChange(dom, text) {
  fireEvent.change(dom, { target: { value: text } });
}

// input enter
export function simulateInputEnter(dom) {
  fireEvent.keyDown(dom, { key: 'Enter', code: 'Enter', charCode: 13 });
}

export function simulateDocumentMouseEvent(dom = document, trigger = 'click') {
  const triggerName = EVENTS_MAP[trigger] || trigger;
  fireEvent[triggerName](dom);
}

export function simulateClipboardPaste(dom, text) {
  const paste = createEvent.paste(dom, {
    clipboardData: {
      getData: () => text,
    },
  });
  fireEvent(dom, paste);
}

// image event 可选值：load/error
export function simulateImageEvent(dom, event) {
  fireEvent(dom, createEvent(event, dom));
}

export function getFakeFileList(type = 'file', count = 1) {
  if (type === 'image') {
    return new Array(count).fill(null).map((_, index) => {
      const letters = new Array(index).fill('A').join('');
      return new File([`image bits${letters}`], `image-name${index || ''}.png`, { type: 'text/plain', lastModified: 1674355700444 })
    });
  }
  if (type === 'file') {
    return new Array(count).fill(null).map((_, index) => {
      const letters = new Array(index).fill('B').join('');
      return new File([`this is file text bits${letters}`], `file-name${index || ''}.txt`, { type: 'image/png', lastModified: 1674355700444 });
    });
  }
  return [];
}

/**
 * 模拟文件变化
 * @param {Document | Node | Element | Window} dom 发生变化的元素
 * @param {String} type 类型，可选值: file/image。
 * @param {Number} count 文件数量
 * @returns File[]
 */
export function simulateFileChange(dom, type = 'file', count = 1) {
  const fakeFileList = getFakeFileList(type, count);
  fireEvent.change(dom, {
    target: { files: fakeFileList },
  });
  return fakeFileList;
}

/**
 * 模拟拖拽上传文件
 * @param {String} dom 触发节点
 * @param {String} trigger 可选值：dragEnter/dragLeave/dragOver/drop
 * @param {String} type 可选值：file/image
 * @param {Number} count 数量
 * @returns File[]
 */
export function simulateDragFileChange(dom, trigger, type = 'file', count = 1) {
  const fakeFileList = getFakeFileList(type, count);
  fireEvent[trigger](dom, {
    dataTransfer: { files: fakeFileList },
  });
  return fakeFileList;
}

// document keydown
export function simulateKeydownEvent(dom, type) {
  let event;
  switch (type) {
    case 'ArrowDown':
      event = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', charCode: 40 });
      break;
    case 'ArrowUp':
      event = new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp', charCode: 38 });
      break;
    case 'ArrowLeft':
      event = new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', charCode: 37 });
      break;
    case 'ArrowRight':
      event = new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', charCode: 36 });
      break;
    case 'Escape':
      event = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', charCode: 27 });
      break;
    case 'Enter':
      event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', charCode: 13 });
      break;
    default:
      console.warn('Event Type is Error');
      break;
  }
  dom.dispatchEvent(event);
}

/**
 * mock window 上的 IntersectionObserver 方法
 * @param mockData 可选，默认的一些配置数据，比如boundingClientRect、intersectionRect等值
 * @param mockFunc 可选，mock IntersectionObserver 中的一些方法，比如observe、unobserve等
 * @returns void
 */
export function mockIntersectionObserver (mockData, mockFunc) {
  const { boundingClientRect = {}, intersectionRect = {}, rootBounds = {}, thresholds = 0.5 } = mockData;
  const { observe, unobserve, disconnect } = mockFunc;

  const defaultValue = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
  };
  const records = [
    {
      isIntersecting: true,
      boundingClientRect: { ...defaultValue, ...boundingClientRect },
      intersectionRatio: 0.5,
      intersectionRect: { ...defaultValue, ...intersectionRect },
      rootBounds: { ...defaultValue, ...rootBounds },
      target: document.createElement('div'),
      time: 0,
    },
  ];

  window.IntersectionObserver = vi.fn((callback, { root, rootMargin }) => ({
    root,
    rootMargin,
    thresholds,
    observe: observe
      ? (element) => {
          observe(element, callback);
        }
      : vi.fn(),
    unobserve: unobserve || vi.fn(),
    disconnect: disconnect || vi.fn(),
    takeRecords: () => records,
  }));
};