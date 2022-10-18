import '@testing-library/jest-dom';

export * from '@testing-library/react';
export * from 'vitest';

// 延迟判断
export function mockTimeout(callback, timeout = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback()), timeout);
  });
}
