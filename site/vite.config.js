import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import tdocPlugin from './plugin-tdoc';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import pwaConfig from './pwaConfig';

// cdn-go 插件会自动部署官网历史版本，需要增加 cdn-go 外网地址前缀
process.env.CDN_PATH = process.env.CDN_URL ? process.env.CDN_URL : './';

export default {
  base: process.env.NODE_ENV === 'production' ? '/react/' : process.env.CDN_PATH,
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '@docs': path.resolve(__dirname, './docs'),
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, '../src/_common'),
      'tdesign-react': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: '../_site',
  },
  jsx: 'react',
  server: {
    host: '0.0.0.0',
    port: 15000,
    open: '/',
    https: false,
    fs: {
      strict: false,
    },
  },
  plugins: [
    reactRefresh(),
    tdocPlugin(),
    VitePWA(pwaConfig),
    replace({ __DATE__: new Date().toISOString() }),
  ],
};
