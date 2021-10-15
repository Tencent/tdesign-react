import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import tdocPlugin from './plugin-tdoc';

// cdn-go 插件会自动部署官网历史版本，需要增加 cdn-go 外网地址前缀
process.env.CDN_PATH = process.env.CDN_URL ? process.env.CDN_URL : './';

export default {
  base: process.env.NODE_ENV === 'production' ? '/react/' : process.env.CDN_PATH,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '@docs': path.resolve(__dirname, './docs'),
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, '../src/_common'),
      '@tencent/tdesign-react': path.resolve(__dirname, '../src'),
    },
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
  plugins: [reactRefresh(), tdocPlugin()],
};
