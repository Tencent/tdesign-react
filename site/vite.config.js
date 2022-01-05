import path from 'path';
import istanbul from 'vite-plugin-istanbul';
import react from '@vitejs/plugin-react';
import tdocPlugin from './plugin-tdoc';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import pwaConfig from './pwaConfig';

export default {
  base: process.env.NODE_ENV === 'production' ? '/react/' : './',
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
    react(),
    tdocPlugin(),
    VitePWA(pwaConfig),
    replace({ __DATE__: new Date().toISOString() }),
    // istanbul({
    //   include: ['src/**/_example/*.spec.*'],
    //   exclude: ['node_modules', 'site', 'script', 'test', 'src/_common/', 'src/_util'],
    //   extension: ['.js', '.ts', '.jsx', '.tsx'],
    //   requireEnv: false,
    //   cypress: true,
    //   all: true
    // }),
  ],
};
