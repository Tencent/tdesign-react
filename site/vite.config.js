import path from 'path';
import istanbul from 'vite-plugin-istanbul';
import react from '@vitejs/plugin-react';
import tdocPlugin from './plugin-tdoc';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import pwaConfig from './pwaConfig';

const resolvePath = (r) => path.resolve(__dirname, r);

export default {
  base: process.env.NODE_ENV === 'production' ? '/react/' : './',
  resolve: {
    alias: {
      '@': resolvePath('../'),
      '@docs': resolvePath('./docs'),
      '@components': resolvePath('./src/components'),
      '@common': resolvePath('../src/_common'),
      'tdesign-react': resolvePath('../src'),
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
    istanbul({
      cwd: resolvePath('../'),
      include: ['src/**/*'],
      exclude: ['src/_common/**/*'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
    }),
  ],
};
