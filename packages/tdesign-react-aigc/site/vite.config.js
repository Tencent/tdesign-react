import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tdocPlugin from './plugin-tdoc';

const publicPathMap = {
  preview: '/',
  intranet: '/react-aigc/',
  production: 'https://static.tdesign.tencent.com/react-aigc/',
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
        '@tdesign-react/aigc': path.resolve(__dirname, '../../pro-components/chat'),
        '@tdesign/react-aigc-site': path.resolve(__dirname, './'),
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
      port: 15001,
      open: '/',
      https: false,
      fs: {
        strict: false,
      },
    },
    test: {
      environment: 'jsdom',
    },
    plugins: [react(), tdocPlugin(), disableTreeShakingPlugin(['style/'])],
  });
