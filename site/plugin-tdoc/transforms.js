/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import path from 'path';
import fs from 'fs';

import mdToReact from './md-to-react';

let demoImports = {};
let demoCodesImports = {};

export default {
  before({ source, file }) {
    const resourceDir = path.dirname(file);
    const reg = file.match(/src\/([\w-]+)\/(\w+-?\w+)\.?(\w+-?\w+)?\.md/);

    const fileName = reg && reg[0];
    const componentName = reg && reg[1];
    const localeName = reg && reg[3];

    demoImports = {};
    demoCodesImports = {};
    // 统一换成 common 公共文档内容
    if (fileName && source.includes(':: BASE_DOC ::')) {
      const localeDocPath = path.resolve(__dirname, `../../src/_common/docs/web/api/${fileName}`);
      const defaultDocPath = path.resolve(
        __dirname,
        `../../src/_common/docs/web/api/${localeName ? `${componentName}.${localeName}` : componentName}.md`,
      );
      let baseDoc = '';

      if (fs.existsSync(localeDocPath)) {
        // 优先载入语言版本
        baseDoc = fs.readFileSync(localeDocPath, 'utf-8');
      } else if (fs.existsSync(defaultDocPath)) {
        // 回退中文默认版本
        baseDoc = fs.readFileSync(defaultDocPath, 'utf-8');
      } else {
        console.error(`未找到 ${defaultDocPath} 文件`);
      }
      source = source.replace(':: BASE_DOC ::', baseDoc);
    }

    // 替换成对应 demo 文件
    source = source.replace(/\{\{\s+(.+)\s+\}\}/g, (demoStr, demoFileName) => {
      const defaultDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.jsx`);
      const localeDemoPath = path.resolve(resourceDir, `../_example/${demoFileName}.${localeName}.jsx`);
      // localeDemo 优先级最高
      if (fs.existsSync(localeDemoPath))
        return `\n::: demo _example/${demoFileName}.${localeName} ${componentName}\n:::\n`;

      if (!fs.existsSync(defaultDemoPath)) {
        console.log('\x1B[36m%s\x1B[0m', `${componentName} 组件需要实现 _example/${demoFileName}.jsx 示例!`);
        return '\n<h3>DEMO (🚧建设中）...</h3>';
      }

      return `\n::: demo _example/${demoFileName} ${componentName}\n:::\n`;
    });

    source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
      const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
      const demoDefName = `Demo${demoPathOnlyLetters}`;
      const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
      demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}';`;
      demoCodesImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}?raw';`;
    });

    return source;
  },
  render({ source, file, md }) {
    const demoDefsStr = Object.keys(demoImports)
      .map((key) => demoImports[key])
      .join('\n');
    const demoCodesDefsStr = Object.keys(demoCodesImports)
      .map((key) => demoCodesImports[key])
      .join('\n');

    const sfc = mdToReact({
      md,
      file,
      source,
      demoDefsStr,
      demoCodesDefsStr,
    });

    return sfc;
  },
};
