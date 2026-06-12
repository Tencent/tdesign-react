import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import mdToReact from './md-to-react';

const __dirname = dirname(fileURLToPath(import.meta.url));

let demoImports = {};
let demoCodesImports = {};

export default {
  before({ source, file }) {
    const resourceDir = path.dirname(file);
    const reg = file.match(/packages\/components\/([\w-]+)\/(\w+-?\w+)\.?(\w+-?\w+)?\.md/);

    const fileName = reg && reg[0];
    const componentName = reg && reg[1];
    const localeName = reg && reg[3];

    demoImports = {};
    demoCodesImports = {};
    // 统一换成 common 公共文档内容
    if (fileName && source.includes(':: BASE_DOC ::')) {
      const localeDocPath = path.resolve(__dirname, `../../../${fileName}`);
      const defaultDocPath = path.resolve(
        __dirname,
        `../../../../common/docs/web/api/${localeName ? `${componentName}.${localeName}` : componentName}.md`,
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
    // 只匹配独立行的 {{ }} 模式，避免影响普通代码块中的内容
    source = source.replace(/^[ \t]*\{\{\s+(.+?)\s+\}\}[ \t]*$/gm, (demoStr, demoFileName) => {
      const tsxDemoPath = path.resolve(resourceDir, `./_example/${demoFileName}.tsx`);

      if (!fs.existsSync(tsxDemoPath)) {
        console.log('\x1B[36m%s\x1B[0m', `${componentName} 组件需要实现 _example/${demoFileName}.tsx 示例!`);
        return '\n<h3>DEMO (🚧建设中）...</h3>';
      }

      return `\n::: demo _example/${demoFileName} ${componentName}\n:::\n`;
    });

    source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
      const jsxDemoPath = `_example-js/${relativeDemoPath.split('/')?.[1]}`;
      const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
      const demoDefName = `Demo${demoPathOnlyLetters}`;
      const demoJsxCodeDefName = `Demo${demoPathOnlyLetters}JsxCode`;
      const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
      demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}';`;
      demoCodesImports[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}?raw';`;
      if (fs.existsSync(path.resolve(resourceDir, `${jsxDemoPath}.jsx`)))
        demoCodesImports[demoJsxCodeDefName] = `import ${demoJsxCodeDefName} from './${jsxDemoPath}?raw'`;
      else demoCodesImports[demoJsxCodeDefName] = `import ${demoJsxCodeDefName} from './${relativeDemoPath}?raw'`;
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
