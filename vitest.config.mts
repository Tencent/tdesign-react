import path, { basename, dirname, join } from 'path';
import { defineConfig } from 'vitest/config';
import { InlineConfig } from 'vitest/node';

// 单元测试相关配置
const testConfig: InlineConfig = {
  include:
    process.env.NODE_ENV === 'test-snap'
      ? ['test/snap/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
      : ['packages/components/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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
  resolveSnapshotPath: (testPath, snapExtension) => {
    const prefix = process.env.REACT_19 ? 'react-19-' : '';
    const filename = basename(testPath);
    const snapPath = join(dirname(testPath), `__snapshots__`);

    return `${snapPath}/${prefix}${filename}${snapExtension}`;
  },
  // snapshotFormat: {
  //   printBasicPrototype: false,
  //   escapeString: true,
  // },
};

export default defineConfig({
  resolve: {
    alias: {
      'tdesign-react/es': path.resolve(__dirname, './packages/components'),
      'tdesign-react': path.resolve(__dirname, './packages/components'),
      '@test/utils': path.resolve(__dirname, './test/utils'),
    },
  },
  test: testConfig,
});
