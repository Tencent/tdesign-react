/* eslint-disable */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import camelCase from 'camelcase';

import testCoverage from '../../../test-coverage';

import { transformSync } from '@babel/core';
import babelPresetReact from '@babel/preset-react';

export default function mdToReact(options) {
  const mdSegment = customRender(options);
  const { demoCodesDefsStr } = options;

  let coverage = '';
  if (mdSegment.isComponent) {
    coverage = testCoverage[camelCase(mdSegment.componentName)] || {};
  }

  const reactSource = `
    import React, { useEffect, useRef, useState } from 'react';\n
    import { useLocation, useNavigate } from 'react-router-dom';
    import Prismjs from 'prismjs';
    import 'prismjs/components/prism-bash.js';
    import Stackblitz from '@web/components/stackblitz/index.jsx';
    import Codesandbox from '@web/components/codeSandbox/index.jsx';

    ${demoCodesDefsStr}

    function useQuery() {
      return new URLSearchParams(useLocation().search);
    }

    export default function TdDoc() {
      const tdDocHeader = useRef();
      const tdDocTabs = useRef();
      const tdDocPhone = useRef();

      const isComponent = ${mdSegment.isComponent};

      const location = useLocation();
      const navigate = useNavigate();

      const query = useQuery();
      const [tab, setTab] = useState(query.get('tab') || 'demo');

      useEffect(() => {
        const completeUrl = window.location.origin + '${mdSegment.mobileUrl}';

        tdDocHeader.current.docInfo = {
          title: \`${mdSegment.title}\`,
          desc:  \`${mdSegment.description}\`
        }

        if (isComponent) {
          tdDocPhone.current.qrcodeUrl = completeUrl;
          tdDocTabs.current.tabs = ${JSON.stringify(mdSegment.tdDocTabs)};
        }
        Prismjs.highlightAll();
      }, []);

      useEffect(() => {
        if (!isComponent) return;

        const query = new URLSearchParams(location.search);
        const currentTab = query.get('tab') || 'demo';
        setTab(currentTab);
        tdDocTabs.current.tab = currentTab;

        tdDocTabs.current.onchange = ({ detail: currentTab }) => {
          setTab(currentTab);
          const query = new URLSearchParams(location.search);
          if (query.get('tab') === currentTab) return;
          navigate({ search: '?tab=' + currentTab });
        }
      }, [location])

      function isShow(currentTab) {
        return currentTab === tab ? { display: 'block' } : { display: 'none' };
      }

      return (
        <>
          ${
            mdSegment.tdDocHeader
              ? `<td-doc-header
                slot="doc-header"
                ref={tdDocHeader}
                spline="${mdSegment.spline}"
                platform="mobile"
              >
               ${
                 mdSegment.isComponent
                   ? `
                    <td-doc-badge style={{ marginRight: '10px' }} slot="badge" label="coverages: lines" message="${
                      coverage.lines || '0%'
                    }" />
                    <td-doc-badge style={{ marginRight: '10px' }} slot="badge" label="coverages: functions" message="${
                      coverage.functions || '0%'
                    }" />
                    <td-doc-badge style={{ marginRight: '10px' }} slot="badge" label="coverages: statements" message="${
                      coverage.statements || '0%'
                    }" />
                    <td-doc-badge style={{ marginRight: '10px' }} slot="badge" label="coverages: branches" message="${
                      coverage.branches || '0%'
                    }" />`
                   : ''
               }
              </td-doc-header>`
              : ''
          }
          {
            isComponent ? (
              <>
                <td-doc-tabs ref={tdDocTabs} tab={tab}></td-doc-tabs>
                <div style={isShow('demo')} name="DEMO">
                  ${mdSegment.demoMd.replace(/class=/g, 'className=')}

                  <td-doc-phone ref={tdDocPhone}>
                    <iframe src="${
                      mdSegment.mobileUrl
                    }" frameBorder="0" width="100%" height="100%" style={{ borderRadius: '0 0 6px 6px' }}></iframe>
                  </td-doc-phone>

                  <td-contributors platform="mobile" framework="react" component-name="${
                    mdSegment.componentName
                  }" ></td-contributors>
                </div>
                <div style={isShow('api')} name="API" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
                  mdSegment.apiMd,
                )} }}></div>
                <div style={isShow('design')} name="DESIGN" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
                  mdSegment.designMd,
                )}  }}></div>
              </>
            ) : <div name="DOC" className="${mdSegment.docClass}">${mdSegment.docMd.replace(
              /class=/g,
              'className=',
            )}</div>
          }
          <div style={{ marginTop: 48 }}>
            <td-doc-history time="${mdSegment.lastUpdated}"></td-doc-history>
          </div>
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
    presets: [babelPresetReact],
  });

  return { code: result.code, map: result.map };
}

const DEFAULT_TABS = [
  { tab: 'demo', name: '示例' },
  { tab: 'api', name: 'API' },
  { tab: 'design', name: '指南' },
];

const DEFAULT_EN_TABS = [
  { tab: 'demo', name: 'DEMO' },
  { tab: 'api', name: 'API' },
  { tab: 'design', name: 'Guideline' },
];

// 解析 markdown 内容
function customRender({ source, file, md }) {
  let { content, data } = matter(source);
  // console.log('data', data);
  const isEn = file.endsWith('en-US.md');

  // md top data
  const pageData = {
    spline: '',
    toc: false,
    title: '',
    description: '',
    isComponent: false,
    tdDocHeader: true,
    tdDocTabs: !isEn ? DEFAULT_TABS : DEFAULT_EN_TABS,
    apiFlag: /#+\s*API/i,
    docClass: '',
    lastUpdated: Math.round(fs.statSync(file).mtimeMs),
    ...data,
  };

  // md filename
  const reg = file.match(/([\w-]+)\.?([\w-]+)?\.md/);
  const componentName = reg && reg[1];

  // split md
  let [demoMd = '', apiMd = ''] = content.split(pageData.apiFlag);

  // fix table | render error
  demoMd = demoMd.replace(/`([^`\r\n]+)`/g, (str, codeStr) => {
    codeStr = codeStr.replace(/"/g, "'");
    return `<td-code text="${codeStr}"></td-code>`;
  });

  const mdSegment = {
    ...pageData,
    mobileUrl: '',
    componentName,
    docMd: '<td-doc-empty></td-doc-empty>',
    demoMd: '<td-doc-empty></td-doc-empty>',
    apiMd: '<td-doc-empty></td-doc-empty>',
    designMd: '<td-doc-empty></td-doc-empty>',
  };

  if (pageData.isComponent) {
    mdSegment.demoMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${demoMd.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
    mdSegment.apiMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${apiMd.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
  } else {
    mdSegment.docMd = md.render.call(
      md,
      `${pageData.toc ? '[toc]\n' : ''}${content.replace(/<!--[\s\S]+?-->/g, '')}`,
    ).html;
  }

  // 移动端路由地址
  // console.log('process.env', process.env);
  const prefix = process.env.NODE_ENV === 'development' ? `/mobile.html` : `/mobile-react/mobile.html`;
  mdSegment.mobileUrl = `${prefix}#/${componentName}`;

  // 设计指南内容 不展示 design Tab 则不解析
  if (pageData.isComponent && pageData.tdDocTabs.some((item) => item.tab === 'design')) {
    const designDocPath = path.resolve(__dirname, `../../../../src/_common/docs/mobile/design/${componentName}.md`);

    if (fs.existsSync(designDocPath)) {
      const designMd = fs.readFileSync(designDocPath, 'utf-8');
      mdSegment.designMd = md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${designMd}`).html;
    } else {
      // console.log(`[vite-plugin-tdoc]: 未找到 ${designDocPath} 文件`);
    }
  }

  return mdSegment;
}
