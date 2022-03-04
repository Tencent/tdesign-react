import orgPkg from '../../../../package.json';

export const htmlContent = `
  <div id="app" style="padding: 24px;"></div>
  <script type="module" src="/src/main.jsx"></script>
`;

export const mainJsContent = `
  import React from 'react';
  import ReactDOM from 'react-dom';
  import Demo from './demo';
  import './index.css';
  import 'tdesign-react/es/style/index.css';

  const rootElement = document.getElementById('app');
  ReactDOM.render(<Demo />, rootElement);
`;

export const styleContent = `
  /* 竖排展示 demo 行间距 16px */
  .tdesign-demo-block-column {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  /* 竖排展示 demo 行间距 32px */
  .tdesign-demo-block-column-large {
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  /* 横排排展示 demo 列间距 16px */
  .tdesign-demo-block-row {
    display: flex;
    column-gap: 16px;
    align-items: center;
  }
`;

export const stackblitzRc = `
  {
    "installDependencies": true,
    "startCommand": "npm run dev"
  }
`;

export const viteConfigContent = `
  import react from '@vitejs/plugin-react';

  export default {
    jsx: 'react',
    plugins: [react()],
  };
`;

export const packageJSONContent = JSON.stringify(
  {
    name: 'tdesign-react-demo',
    version: '0.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    dependencies: {
      'tdesign-react': orgPkg.version,
      'tdesign-icons-react': orgPkg.dependencies['tdesign-icons-react'],
      react: orgPkg.devDependencies.react,
      'react-dom': orgPkg.devDependencies['react-dom'],
    },
    devDependencies: {
      vite: orgPkg.devDependencies.vite,
      '@vitejs/plugin-react': orgPkg.devDependencies['@vitejs/plugin-react'],
    },
  },
  null,
  2,
);
