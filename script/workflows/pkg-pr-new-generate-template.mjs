import { execSync } from 'child_process';
import { join } from 'path';
import { rmSync, writeFileSync, readFileSync, existsSync } from 'fs';

// 文件模板（跨项目共用）
const SHARED_TEMPLATES = {
  APP_TSX: `
import React from 'react';
import Demo from './Demo';

export default () => <Demo />;
  `,
  VITE_CONFIG_TS: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
  `,
};

// 各发布包对应的示例项目配置
const DEMOS = [
  {
    projectName: 'tdesign-react-demo',
    packageName: 'tdesign-react',
    mainTsx: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'tdesign-react';
import zh_CN from 'tdesign-react/es/locale/zh_CN';
import App from './App';
import 'tdesign-react/es/style/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider globalConfig={zh_CN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
  `,
    demoTsx: `
import React from 'react';
import { Button } from 'tdesign-react';

export default () => <Button>按钮</Button>;
  `,
  },
  {
    projectName: 'tdesign-mobile-react-demo',
    packageName: 'tdesign-mobile-react',
    mainTsx: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'tdesign-mobile-react/es/style/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
  `,
    demoTsx: `
import React from 'react';
import { Button } from 'tdesign-mobile-react';

export default () => <Button>按钮</Button>;
  `,
  },
];

// 构建示例项目
function buildExample({ projectName, packageName, mainTsx, demoTsx }) {
  execSync(`pnpm create vite@7 ${projectName} --template react-ts`, { stdio: 'inherit' });

  const projectPath = join(process.cwd(), projectName);
  const paths = {
    main: join(projectPath, 'src/main.tsx'),
    app: join(projectPath, 'src/App.tsx'),
    demo: join(projectPath, 'src/Demo.tsx'),
    packageJson: join(projectPath, 'package.json'),
    appCSS: join(projectPath, 'src/App.css'),
    indexCSS: join(projectPath, 'src/index.css'),
    viteConfig: join(projectPath, 'vite.config.ts'),
  };

  // 更新 package.json
  const pkg = JSON.parse(readFileSync(paths.packageJson, 'utf8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    [packageName]: 'latest',
    'tdesign-icons-react': 'latest',
    '@vitejs/plugin-react': 'latest',
  };

  writeFileSync(paths.packageJson, JSON.stringify(pkg, null, 2));

  // 删除默认样式文件
  [paths.appCSS, paths.indexCSS].forEach((path) => {
    if (existsSync(path)) rmSync(path);
  });

  // 写入示例代码
  writeFileSync(paths.main, mainTsx.trim());
  writeFileSync(paths.app, SHARED_TEMPLATES.APP_TSX.trim());
  writeFileSync(paths.demo, demoTsx.trim());
  writeFileSync(paths.viteConfig, SHARED_TEMPLATES.VITE_CONFIG_TS.trim());
}

try {
  DEMOS.forEach((demo) => buildExample(demo));
} catch (error) {
  console.error('构建过程中发生错误:', error);
  process.exit(1);
}
