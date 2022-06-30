import path from 'path';
// import { istanbul } from 'vite-plugin-istanbul';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'vite';
import pwaConfig from './pwaConfig';
import tdocPlugin from './plugin-tdoc';

const resolvePath = (r) => path.resolve(__dirname, r);

const publicPathMap = {
  preview: '/',
  intranet: '/react/',
  production: 'https://static.tdesign.tencent.com/react/',
};

export default ({ mode }) =>
  defineConfig({
    base: publicPathMap[mode],
    resolve: {
      alias: {
        '@': resolvePath('../'),
        '@site': resolvePath('./'),
        '@docs': resolvePath('./docs'),
        '@components': resolvePath('./src/components'),
        '@common': resolvePath('../src/_common'),
        'tdesign-react/es': resolvePath('../src'),
        'tdesign-react': resolvePath('../src'),
      },
    },
    build: {
      outDir: '../_site',
      rollupOptions: {
        input: {
          index: 'index.html',
          playground: 'playground.html',
        },
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
    plugins: [
      react(),
      tdocPlugin(),
      VitePWA(pwaConfig),
      replace({ preventAssignment: false, __DATE__: new Date().toISOString() }),
      // istanbul({
      //   cwd: resolvePath('../'),
      //   include: ['src/**/*'],
      //   exclude: ['src/_common/**/*'],
      //   extension: ['.js', '.ts', '.jsx', '.tsx'],
      // }),
    ],
  });
