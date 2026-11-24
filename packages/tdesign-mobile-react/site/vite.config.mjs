import path from 'path';

import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './pwaConfig';

import changelog2Json from './web/plugins/changelog-to-json';
import tdocPlugin from './web/plugins/plugin-tdoc';
import generateLlms from './web/plugins/generate-llms';

const publicPathMap = {
  preview: '/',
  production: 'https://static.tdesign.tencent.com/mobile-react/',
};

// Rollup 4+ 的 tree-shaking 策略调整, 这里是为了让样式在站点构建正常
const disableTreeShakingPlugin = (paths) => ({
  name: 'disable-treeshake',
  transform(code, id) {
    for (const path of paths) {
      if (id.includes(path)) {
        return { code, map: null, moduleSideEffects: 'no-treeshake' };
      }
    }
  },
});

export default ({ mode }) =>
  defineConfig({
    base: publicPathMap[mode],
    define: {
      __VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../'),
        '@docs': path.resolve(__dirname, './docs'),
        '@web': path.resolve(__dirname, './web'),
        '@components': path.resolve(__dirname, './src/components'),
        '@common': path.resolve(__dirname, '../src/_common'),
        'tdesign-mobile-react/es': path.resolve(__dirname, '../src'),
        'tdesign-mobile-react': path.resolve(__dirname, '../src'),
        '@test/utils': path.resolve(__dirname, '../test/utils'),
      },
    },
    build: {
      outDir: '../_site',
      rollupOptions: {
        input: {
          site: 'index.html',
          mobile: 'mobile.html',
        },
      },
    },
    jsx: 'react',
    server: {
      host: '0.0.0.0',
      port: 19000,
      open: '/',
      https: false,
      fs: { strict: false },
    },
    plugins: [
      react(),
      tdocPlugin(),
      changelog2Json(),
      generateLlms(),
      VitePWA(pwaConfig),
      disableTreeShakingPlugin(['style/']),
      replace({ __DATE__: new Date().toISOString() }),
    ],
  });
