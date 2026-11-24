import orgPkg from '../../../../package.json';

export const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="icon" href="/favicon.ico">
      <title>TDesign</title>
      <!--[if lte IE 9]>
      <style>
        #app {
          display: none;
        }
      </style>
      <![endif]-->
    </head>

    <body>
      <!--[if lte IE 9]>
        <h1 style="position: absolute; width: 100%; text-align:center; top: 45%">请使用 IE 10 以及更新版本的浏览器访问，建议使用 <a href="https://www.google.cn/chrome/">Chrome</a></h1>
      <![endif]-->

      <div id="app"></div>
    </body>

  </html>
`;

export const mainJsContent = `
  import React from 'react';
  import ReactDOM from 'react-dom/client';

  import Demo from './demo';
  import './index.css';
  import 'tdesign-mobile-react/es/style/index.css';

  const root = ReactDOM.createRoot(document.getElementById('app'));

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

export const packageJSONContent = JSON.stringify(
  {
    name: 'tdesign-mobile-react-demo',
    version: '0.0.0',
    description: 'React example starter project',
    keywords: ['react', 'starter'],
    main: 'src/main.tsx',
    dependencies: {
      react: orgPkg.devDependencies.react,
      dayjs: orgPkg.dependencies.dayjs,
      'react-dom': orgPkg.devDependencies['react-dom'],
      'tdesign-mobile-react': orgPkg.version,
      'tdesign-icons-react': orgPkg.dependencies['tdesign-icons-react'],
      '@types/react': orgPkg.devDependencies['@types/react'],
      '@types/react-dom': orgPkg.devDependencies['@types/react-dom'],
    },
    devDependencies: {
      typescript: '^4.4.4',
      'react-scripts': '^5.0.0',
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test --env=jsdom',
      eject: 'react-scripts eject',
    },
    browserslist: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
  },
  null,
  2,
);
