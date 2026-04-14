import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tdocPlugin from './plugin-tdoc';
import pkg from '../package.json';

const publicPathMap = {
  preview: '/',
  production: 'https://static.tdesign.tencent.com/react-chat/',
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
        '@tdesign-react/chat': path.resolve(__dirname, '../../pro-components/chat'),
        '@tdesign/ai-chat-engine': path.resolve(__dirname, '../../ai-core/packages/chat-engine/index.ts'),
        '@tdesign/react-aigc-site': path.resolve(__dirname, './'),
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
    define: {
      __VERSION__: JSON.stringify(pkg.version),
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
