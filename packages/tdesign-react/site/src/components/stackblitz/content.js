import orgPkg from '../../../../package.json';

export const htmlContent = `
  <div id="app"></div>
  <script type="module" src="/src/index.jsx"></script>
`;

export const mainJsContent = `
  import React, { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';

  import Demo from './demo';
  import './index.css';
  import 'tdesign-react/dist/tdesign.css';

  const rootElement = document.getElementById('app');
  const root = createRoot(rootElement);

  root.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  );
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

export const tsconfigContent = `{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
`;

export const stackblitzRc = `
  {
    "installDependencies": true,
    "startCommand": "npm run dev"
  }
`;

export const viteConfigContent = `
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
  });
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
      react: orgPkg.devDependencies.react,
      dayjs: orgPkg.dependencies.dayjs,
      'react-dom': orgPkg.devDependencies['react-dom'],
      'tdesign-react': orgPkg.version,
      'tdesign-icons-react': orgPkg.dependencies['tdesign-icons-react'],
      '@types/react': orgPkg.devDependencies['@types/react'],
      '@types/react-dom': orgPkg.devDependencies['@types/react-dom'],
    },
    devDependencies: {
      vite: orgPkg.devDependencies.vite,
      '@vitejs/plugin-react': orgPkg.devDependencies['@vitejs/plugin-react'],
      typescript: orgPkg.devDependencies.typescript,
    },
  },
  null,
  2,
);
