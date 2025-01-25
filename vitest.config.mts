import path from 'path';
import { defineConfig } from 'vitest/config';
import { InlineConfig } from 'vitest/node';

// 单元测试相关配置
const testConfig: InlineConfig = {
  include:
    process.env.NODE_ENV === 'test-snap'
      ? ['test/snap/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
      : ['packages/web/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  globals: true,
  environment: 'jsdom',
  testTimeout: 16000,
  testTransformMode: {
    web: ['\\.[jt]sx$'],
  },
  coverage: {
    provider: 'istanbul',
    exclude: ['packages/web/_common'],
    reporter: ['text', 'json', 'html'],
    reportsDirectory: 'test/coverage',
  },
};

export default defineConfig({
  resolve: {
    alias: {
      'tdesign-react/es': path.resolve(__dirname, './packages/web/'),
      'tdesign-react': path.resolve(__dirname, './packages/web/'),
      '@test/utils': path.resolve(__dirname, './test/utils'),
    },
  },
  test: testConfig,
});
