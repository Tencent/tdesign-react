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
        ],
  globals: true,
  environment: 'jsdom',
  testTimeout: 16000,
  testTransformMode: {
    web: ['\\.[jt]sx$'],
  },
  coverage: {
    provider: 'istanbul',
    reporter: ['text', 'json', 'html'],
    reportsDirectory: 'test/coverage',
  },
  typecheck: {
    tsconfig: './tsconfig.vitest.json',
  },
};

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@tdesign/ai-chat-engine': path.resolve(
        __dirname,
        './packages/tdesign-react-aigc/node_modules/@tdesign/ai-chat-engine',
      ),
      'tdesign-react/es': path.resolve(__dirname, './packages/components'),
      'tdesign-react': path.resolve(__dirname, './packages/components'),
      '@test/utils': path.resolve(__dirname, './test/utils'),
    },
  },
  test: testConfig,
});
