import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      {
        find: '@tdesign/ai-chat-engine',
        replacement: resolve('packages/tdesign-react-aigc/node_modules/@tdesign/ai-chat-engine'),
      },
      {
        find: /^tdesign-react(\/.*)?$/,
        replacement: `${resolve('packages/tdesign-react-aigc/node_modules/tdesign-react')}$1`,
      },
      {
        find: /^use-sync-external-store(\/.*)?$/,
        replacement: `${resolve('packages/tdesign-react-aigc/node_modules/use-sync-external-store')}$1`,
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/pro-components/chat/**/__tests__/*.test.{ts,tsx}'],
    setupFiles: ['packages/pro-components/chat/__tests__/setup.ts'],
    testTimeout: 10000,
  },
});
