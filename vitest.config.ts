import path from 'path';
import { defineConfig } from 'vitest/config';
import { InlineConfig } from 'vitest';

// 单元测试相关配置
const testConfig: InlineConfig = {
  include: ['src/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  globals: true,
  environment: 'jsdom',
  testTimeout: 5000,
  transformMode: {
    web: [/\.[jt]sx$/],
  },
  coverage: {
    provider: 'istanbul',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: 'test/coverage',
  },
};

export default defineConfig({
  resolve: {
    alias: {
      '@test/utils': path.resolve(__dirname, './test/utils'),
    },
  },
  test: testConfig,
});
