/* eslint-disable */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import camelCase from 'camelcase';
import { compileUsage, getGitTimestamp } from '../../src/_common/docs/compile';

import testCoverage from '../test-coverage';

import { transformSync } from '@babel/core';

export default async function mdToReact(options) {
  const mdSegment = await customRender(options);
  const { demoDefsStr, demoCodesDefsStr } = options;

  let coverage = {};
  if (mdSegment.isComponent) {
    coverage = testCoverage[camelCase(mdSegment.componentName)] || {};
  }

  const reactSource = `
    import React, { useEffect, useRef, useState, useMemo } from 'react';\n
    import { useLocation, useNavigate } from 'react-router-dom';
    import Prismjs from 'prismjs';
    import 'prismjs/components/prism-bash.js';
    import Stackblitz from '@components/stackblitz/index.jsx';
    import Codesandbox from '@components/codesandbox/index.jsx';
    ${demoDefsStr}
    ${demoCodesDefsStr}
    ${mdSegment.usage.importStr}

    function useQuery() {
      return new URLSearchParams(useLocation().search);
    }

    export default function TdDoc() {
      const tdDocHeader = useRef();
      const tdDocTabs = useRef();

      const isComponent = ${mdSegment.isComponent};

      const location = useLocation();
      const navigate = useNavigate();

      const query = useQuery();
      const [tab, setTab] = useState(query.get('tab') || 'demo');

      const lastUpdated = useMemo(() => {
        if (tab === 'design') return ${mdSegment.designDocLastUpdated};
        return ${mdSegment.lastUpdated};
      }, [tab]);

      useEffect(() => {
        tdDocHeader.current.docInfo = {
          title: \`${mdSegment.title}\`,
          desc:  \`${mdSegment.description}\`
        }

        if (isComponent) {
          tdDocTabs.current.tabs = ${JSON.stringify(mdSegment.tdDocTabs)};
        }

        document.title = \`${mdSegment.title} | TDesign\`;

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
                platform="web"
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
                  <td-contributors platform="web" framework="react" component-name="${
                    mdSegment.componentName
                  }" ></td-contributors>
                </div>
                <div style={isShow('api')} name="API" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
                  mdSegment.apiMd,
                )} }}></div>
                <div style={isShow('design')} name="DESIGN" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
                  mdSegment.designMd,
                )} }}></div>
              </>
            ) : <div name="DOC" className="${mdSegment.docClass}">${mdSegment.docMd.replace(
    /class=/g,
    'className=',
  )}</div>
          }
          <div style={{ marginTop: 48 }}>
            <td-doc-history time={lastUpdated} key={lastUpdated}></td-doc-history>
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
    presets: [require('@babel/preset-react')],
    plugins: [[require('@babel/plugin-transform-typescript'), { isTSX: true }]],
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
async function customRender({ source, file, md }) {
  let { content, data } = matter(source);
  const lastUpdated = (await getGitTimestamp(file)) || Math.round(fs.statSync(file).mtimeMs);
  // console.log('data', data);
  const isEn = file.endsWith('en-US.md');
  // md top data
  const pageData = {
    spline: '',
    toc: true,
    title: '',
    description: '',
    isComponent: false,
    tdDocHeader: true,
    tdDocTabs: !isEn ? DEFAULT_TABS : DEFAULT_EN_TABS,
    apiFlag: /#+\s*API/,
    docClass: '',
    lastUpdated,
    designDocLastUpdated: lastUpdated,
    ...data,
  };

  // md filename
  const reg = file.match(/src\/(\w+-?\w+)\/(\w+-?\w+)\.?(\w+-?\w+)?\.md/);
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
    componentName,
    usage: { importStr: '' },
    docMd: '<td-doc-empty></td-doc-empty>',
    demoMd: '<td-doc-empty></td-doc-empty>',
    apiMd: '<td-doc-empty></td-doc-empty>',
    designMd: '<td-doc-empty></td-doc-empty>',
  };

  // 渲染 live demo
  if (pageData.usage && pageData.isComponent) {
    const usageObj = compileUsage({
      componentName,
      usage: pageData.usage,
      demoPath: path.posix.resolve(__dirname, `../../src/${componentName}/_usage/index.jsx`),
    });
    if (usageObj) {
      mdSegment.usage = usageObj;
      demoMd = `${usageObj.markdownStr} ${demoMd}`;
    }
  }

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

  // 设计指南内容 不展示 design Tab 则不解析
  if (pageData.isComponent && pageData.tdDocTabs.some((item) => item.tab === 'design')) {
    const designDocPath = path.resolve(__dirname, `../../src/_common/docs/web/design/${componentName}.md`);

    if (fs.existsSync(designDocPath)) {
      const designDocLastUpdated =
        (await getGitTimestamp(designDocPath)) || Math.round(fs.statSync(designDocPath).mtimeMs);
      mdSegment.designDocLastUpdated = designDocLastUpdated;

      const designMd = fs.readFileSync(designDocPath, 'utf-8');
      mdSegment.designMd = md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${designMd}`).html;
    } else {
      console.log(`[vite-plugin-tdoc]: 未找到 ${designDocPath} 文件`);
    }
  }

  return mdSegment;
}
