/* eslint-disable indent */
/* eslint-disable no-param-reassign */
import path from 'path';
import fs from 'fs';
import { transformSync } from '@babel/core';

let demoImports = {};
let demoCodes = {};

export default function transforms() {
  return {
    before(source, id) {
      const resouceDir = path.dirname(id);
      const reg = id.match(/src\/(\w+-?\w+)\/\w+\.md/);
      const name = reg && reg[1];
      demoImports = {};
      demoCodes = {};

      // 统一换成 iwiki 文档内容
      if (name && source.includes(':: BASE_DOC ::')) {
        const docPath = path.resolve(__dirname, `../../common/docs/web/api/${name}.md`);
        if (fs.existsSync(docPath)) {
          const baseDoc = fs.readFileSync(docPath, 'utf-8');
          source = source.replace(':: BASE_DOC ::', baseDoc);
        } else {
          console.error(`未找到 ${docPath} 文件`);
        }
      }

      // 替换成对应 demo 文件
      source = source.replace(/\{\{\s+(.+)\s+\}\}/g, (demoStr, demoFileName) => {
        demoFileName = demoFileName.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
        const demoPath = path.resolve(resouceDir, `./_example/${demoFileName}.jsx`);
        if (!fs.existsSync(demoPath)) return '\n<h3>DEMO (🚧建设中）...</h3>';

        return `\n::: demo _example/${demoFileName} ${name}\n:::\n`;
      });

      if (source.includes(':: BASE_PROPS ::')) {
        const apiDoc = fs.readFileSync(path.resolve(resouceDir, './api.md'), 'utf-8');
        source = source.replace(':: BASE_PROPS ::', apiDoc);
      }

      source.replace(/:::\s*demo\s+([\\/.\w-]+)/g, (demoStr, relativeDemoPath) => {
        const demoPathOnlyLetters = relativeDemoPath.replace(/[^a-zA-Z\d]/g, '');
        const demoDefName = `Demo${demoPathOnlyLetters}`;
        const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;
        demoImports[demoDefName] = `import ${demoDefName} from './${relativeDemoPath}';`;
        demoCodes[demoCodeDefName] = `import ${demoCodeDefName} from './${relativeDemoPath}?raw';`;
      });

      return source;
    },
    after(_, id, renderInfo, md) {
      const reg = id.match(/src\/(\w+-?\w+)\/\w+\.md/);
      const name = reg && reg[1];

      // 新增设计指南内容
      let designMd = '';
      let designResult = '';
      const designDocPath = path.resolve(__dirname, `../../common/docs/web/design/${name}.md`);

      if (fs.existsSync(designDocPath)) {
        designMd = fs.readFileSync(designDocPath, 'utf-8');
      } else {
        designMd = '<h3>文档 (🚧建设中）...</h3>';
      }

      designResult = md.render(`\${toc}\r\n${designMd}`);

      const demoDefsStr = Object.keys(demoImports)
        .map((key) => demoImports[key])
        .join('\n');
      const demoCodesStr = Object.keys(demoCodes)
        .map((key) => demoCodes[key])
        .join('\n');

      const { title, description, content, api } = renderInfo;

      const reactSource = `
        import React, { useEffect, useRef, useState } from 'react';\n
          ${demoDefsStr}
          ${demoCodesStr}

          export default function TdDoc(props) {
            const tdDocHeader = useRef();
            const tdDocTabs = useRef();
            const { isComponent, contributors } = props;
            const [tab, setTab] = useState('demo');

            useEffect(() => {
              tdDocHeader.current.contributors = contributors;
              tdDocHeader.current.docInfo = {
                title: \`${title}\`,
                desc:  \`${description}\`.split(/<br\\s*\\/?>/g)
              }
              if (tdDocTabs.current) {
                tdDocTabs.current.onchange = ({ detail: currentTab }) => setTab(currentTab);
              }
            }, []);

            function isShow(currentTab) {
              return currentTab === tab ? { display: 'block' } : { display: 'none' };
            }

            return (
              <>
                <td-doc-header slot="doc-header" ref={tdDocHeader}></td-doc-header>
                {
                  isComponent ? (
                    <>
                      <td-doc-tabs ref={tdDocTabs} tab={tab}></td-doc-tabs>
                      <div style={isShow('demo')} name="DEMO">${content.replace(/class=/g, 'className=')}</div>
                      <div style={isShow('api')} name="API" dangerouslySetInnerHTML={{ __html: \`${api}\` }}></div>
                      <div style={isShow('design')} name="DESIGN" dangerouslySetInnerHTML={{ __html: \`${designResult}\` }}></div>
                    </>
                  ) : <div name="DOC">${content.replace(/class=/g, 'className=')}</div>
                }
              </>
            )
          }
        `;
      const result = transformSync(reactSource, {
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        generatorOpts: {
          decoratorsBeforeExport: true,
        },
        presets: [require('@babel/preset-react')],
      });

      return { code: result.code, map: result.map };
    },
  };
}
