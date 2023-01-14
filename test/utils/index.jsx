import '@testing-library/jest-dom';
import _userEvent from '@testing-library/user-event';
import { fireEvent, createEvent } from '@testing-library/react';

export * from '@testing-library/react';
export * from 'vitest';

export const userEvent = _userEvent;

// 延迟判断
export function mockTimeout(callback, timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback && callback()), timeout);
  });
}

export function mockDelay(timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), timeout);
  });
}

export function simulateInputChange(dom, text) {
  fireEvent.change(dom, { target: { value: text } });
}

export function simulateClipboardPaste(dom, text) {
  const paste = createEvent.paste(dom, {
    clipboardData: {
      getData: () => text,
    },
  });
  fireEvent(dom, paste);
}
