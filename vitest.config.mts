import path from 'path';

import { defineConfig } from 'vitest/config';

import pkg from './packages/tdesign-react/package.json';

import type { InlineConfig } from 'vitest/node';

// 单元测试相关配置
const testConfig: InlineConfig = {
  include:
    process.env.NODE_ENV === 'test-snap'
      ? ['test/snap/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
      : [
          'packages/components/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          'packages/pro-components/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
          'packages/mobile-components/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
  globals: true,
  environment: 'jsdom',
  testTimeout: 16000,
  testTransformMode: {
    web: ['\\.[jt]sx$'],
  },
  setupFiles: ['./test/setup.js'],
  coverage: {
    provider: 'istanbul',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: 'test/coverage',
    exclude: [
      '**/__tests__/**',
      '**/*.{test,spec}.{ts,tsx}',
      '**/_example/**',
      '**/_example-js/**',
      '**/node_modules/**',
      'packages/pro-components/**',
    ],
  },
  typecheck: {
    tsconfig: './tsconfig.vitest.json',
  },
};

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    // 强制 dayjs 单实例，避免多版本并存时 dayjs.extend(插件) 作用的实例与运行时实例不一致
    dedupe: ['dayjs'],
    alias: {
      'tdesign-react/es': path.resolve(__dirname, './packages/components'),
      'tdesign-react': path.resolve(__dirname, './packages/components'),
      'tdesign-mobile-react/es': path.resolve(__dirname, './packages/mobile-components'),
      'tdesign-mobile-react': path.resolve(__dirname, './packages/mobile-components'),
      '@test/utils': path.resolve(__dirname, './test/utils'),
      '@tdesign-react/chat': path.resolve(__dirname, './packages/pro-components/chat'),
    },
  },
  test: testConfig,
});
