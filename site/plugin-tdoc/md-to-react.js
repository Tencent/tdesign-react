/* eslint-disable */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// import camelCase from 'camelcase';

// import testCoverage from '../test-coverage';

import { transformSync } from '@babel/core';

export default function mdToReact(options) {
  const mdSegment = customRender(options);
  const { demoDefsStr, demoCodesDefsStr } = options;

  // let coverage = '';
  // if (mdSegment.isComponent) {
  //   coverage = testCoverage[camelCase(mdSegment.componentName)] || '0%';
  // }

  const reactSource = `
    import React, { useEffect, useRef, useState } from 'react';\n
    import { useLocation } from 'react-router-dom';
    import Prismjs from 'prismjs';
    import 'prismjs/components/prism-bash.js';
    import Codesandbox from '@components/Codesandbox';
    ${demoDefsStr}
    ${demoCodesDefsStr}

    function useQuery() {
      return new URLSearchParams(useLocation().search);
    }

    export default function TdDoc() {
      const tdDocHeader = useRef();
      const tdDocTabs = useRef();

      const isComponent  = ${mdSegment.isComponent};

      const location = useLocation();

      const query = useQuery();
      const [tab, setTab] = useState(query.get('tab') || 'demo');

      useEffect(() => {
        tdDocHeader.current.docInfo = {
          title: \`${mdSegment.title}\`,
          desc:  \`${mdSegment.description}\`
        }

        if (isComponent) {
          tdDocTabs.current.tabs = ${JSON.stringify(mdSegment.tdDocTabs)};
        } else {
        }
        Prismjs.highlightAll();

        document.querySelector('td-doc-content').initAnchorHighlight();

        return () => {
          document.querySelector('td-doc-content').resetAnchorHighlight();
        };
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
          props.history.push({ search: '?tab=' + currentTab });
        }
      }, [location])

      function isShow(currentTab) {
        return currentTab === tab ? { display: 'block' } : { display: 'none' };
      }

      return (
        <>
          ${
            mdSegment.tdDocHeader &&
              `<td-doc-header
                slot="doc-header"
                ref={tdDocHeader}
                spline="${mdSegment.spline}"
              ></td-doc-header>`
          }
          {
            isComponent ? (
              <>
                <td-doc-tabs ref={tdDocTabs} tab={tab}></td-doc-tabs>
                <div style={isShow('demo')} name="DEMO">
                  ${mdSegment.demoMd.replace(/class=/g, 'className=')}
                  <td-contributors platform="web" framework="react" component-name="${mdSegment.componentName}" ></td-contributors>
                </div>
                <div style={isShow('api')} name="API" dangerouslySetInnerHTML={{ __html: \`${mdSegment.apiMd}\` }}></div>
                <div style={isShow('design')} name="DESIGN" dangerouslySetInnerHTML={{ __html: \`${mdSegment.designMd}\` }}></div>
              </>
            ) : <div name="DOC">${mdSegment.docMd.replace(/class=/g, 'className=').replace(/tabindex/g, 'tabIndex')}</div>
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
}

const DEAULT_TABS = [
  { tab: 'demo', name: '示例' },
  { tab: 'api', name: 'API' },
  { tab: 'design', name: '指南' },
];

// 解析 markdown 内容
function customRender({ source, file, md }) {
  const { content, data } = matter(source);
  // console.log('data', data);

  // md top data
  const pageData = {
    spline: '',
    toc: true,
    title: '',
    description: '',
    isComponent: false,
    tdDocHeader: true,
    tdDocTabs: DEAULT_TABS,
    apiFlag: /#+\s*API\n/i,
    ...data,
  };

  // md filename
  const reg = file.match(/src\/(\w+-?\w+)\/(\w+-?\w+)\.md/);
  const componentName = reg && reg[1];

  // split md
  const [demoMd = '', apiMd = ''] = content.split(pageData.apiFlag);

  const mdSegment = {
    ...pageData,
    componentName,
    docMd: md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${content.replace(/<!--[\s\S]+?-->/g, '')}`).html,
    demoMd: md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${demoMd.replace(/<!--[\s\S]+?-->/g, '')}`).html,
    apiMd: md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${apiMd.replace(/<!--[\s\S]+?-->/g, '')}`).html,
    designMd: '<td-doc-empty></td-doc-empty>',
  };

  // 设计指南内容 不展示 design Tab 则不解析
  if (pageData.isComponent && pageData.tdDocTabs.some((item) => item.tab === 'design')) {
    const designDocPath = path.resolve(__dirname, `../../src/_common/docs/web/design/${componentName}.md`);

    if (fs.existsSync(designDocPath)) {
      const designMd = fs.readFileSync(designDocPath, 'utf-8');
      mdSegment.designMd = md.render.call(md, `${pageData.toc ? '[toc]\n' : ''}${designMd}`).html;
    } else {
      console.log(`[vite-plugin-tdoc]: 未找到 ${designDocPath} 文件`);
    }
  }

  return mdSegment;
}
