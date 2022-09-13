import orgPkg from '../../../../package.json';

export const htmlContent = '<div id="app" style="padding: 24px;"></div>';

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

export const pkgContent = JSON.stringify(
  {
    name: 'tdesign-react-demo',
    version: '1.0.0',
    description: 'React example starter project',
    keywords: ['react', 'starter'],
    main: 'src/main.jsx',
    dependencies: {
      dayjs: orgPkg.dependencies.dayjs,
      react: orgPkg.devDependencies.react,
      'react-dom': orgPkg.devDependencies['react-dom'],
      'tdesign-react': orgPkg.version,
      'tdesign-icons-react': orgPkg.dependencies['tdesign-icons-react'],
      'react-scripts': '^5.0.0',
    },
    devDependencies: {
      typescript: '^4.4.4',
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
