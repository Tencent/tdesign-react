import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: __APP_DIR_JSON__,
  plugins: [react()],
  define: {
    __VERSION__: JSON.stringify(__SOURCE_VERSION_JSON__),
  },
  resolve: {
    alias: __ALIASES_JSON__,
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '127.0.0.1',
    fs: {
      allow: __SERVER_ALLOW_JSON__,
    },
  },
});
