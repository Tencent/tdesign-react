import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './pwaConfig';

import changelog2Json from './plugins/changelog-to-json';
import tdocPlugin from './plugins/plugin-tdoc';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const publicPathMap = {
  preview: '/',
  intranet: '/react/',
  production: 'https://static.tdesign.tencent.com/react/',
};

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
    resolve: {
      alias: {
        'tdesign-react/es': path.resolve(__dirname, '../../components'),
        'tdesign-react': path.resolve(__dirname, '../../components'),
      },
    },
    build: {
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
    test: {
      environment: 'jsdom',
    },
    plugins: [react(), tdocPlugin(), changelog2Json(), VitePWA(pwaConfig), disableTreeShakingPlugin(['style/'])],
  });
