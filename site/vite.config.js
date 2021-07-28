import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import tdocPlugin, { transforms } from './plugin-tdoc';

export default {
  base: process.env.NODE_ENV === 'production' ? '/react/' : './',
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
  optimizeDeps: {
    include: ['prismjs', 'clipboard'],
  },
  server: {
    host: '0.0.0.0',
    port: 15000,
    open: '/',
    https: false,
  },
  plugins: [
    reactRefresh(),
    tdocPlugin({
      transforms: transforms(),
    }),
  ],
};
