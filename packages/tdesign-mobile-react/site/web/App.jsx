import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import packageJson from '@/package.json';
import siteConfig from './site.config';
import { filterVersions, getRoute } from './utils';

const LazyDemo = lazy(() => import('./Demo'));

const { docs, enDocs } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const docsMap = {
  zh: docs,
  en: enDocs,
};

const registryUrl =
  'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/npm/versions/tdesign-mobile-react';
const currentVersion = packageJson.version.replace(/\./g, '_');

// eslint-disable-next-line import/no-named-as-default-member
const docRoutes = [...getRoute(siteConfig.docs, []), ...getRoute(siteConfig.enDocs, [])];
const renderRouter = docRoutes.map((nav, i) => {
  const LazyCom = lazy(nav.component);

  return (
    <Route
      key={i}
      path={nav.path.replace('/mobile-react/', '')}
      element={
        <Suspense fallback={<h2>拼命加载中...</h2>}>
          <LazyCom />
        </Suspense>
      }
    />
  );
});

function Components() {
  const location = useLocation();
  const navigate = useNavigate();

  const tdHeaderRef = useRef();
  const tdDocAsideRef = useRef();
  const tdDocContentRef = useRef();
  const tdSelectRef = useRef();
  const tdDocSearch = useRef();

  const [version] = useState(currentVersion);

  function initHistoryVersions() {
    fetch(registryUrl)
      .then((res) => res.json())
      .then((res) => {
        const options = [];
        const versions = filterVersions(Object.keys(res.versions));

        versions.forEach((v) => {
          options.unshift({ label: v, value: v.replace(/\./g, '_') });
        });

        tdSelectRef.current.options = options;
      })
      .catch((err) => {
        console.error('获取版本号异常', err);
      });
  }

  useEffect(() => {
    tdHeaderRef.current.framework = 'react';
    tdDocSearch.current.docsearchInfo = { indexName: 'tdesign_doc_react_mobile' };

    const isEn = window.location.pathname.endsWith('en');

    tdDocAsideRef.current.routerList = isEn ? docsMap.en : docsMap.zh;
    tdDocAsideRef.current.onchange = ({ detail }) => {
      if (location.pathname === detail) return;
      tdDocContentRef.current.pageStatus = 'hidden';
      requestAnimationFrame(() => {
        navigate(detail);
      });
      requestAnimationFrame(() => {
        const isComponent = /\/components\//.test(detail);
        tdDocContentRef.current.mobileBodyStyle = {
          paddingRight: isComponent ? '400px' : '',
        };
        tdDocContentRef.current.pageStatus = 'show';
        window.scrollTo(0, 0);
      });
    };

    tdSelectRef.current.onchange = ({ detail }) => {
      const { value: version } = detail;
      if (version === currentVersion) return;

      const historyUrl = `https://${version}-tdesign-mobile-react.surge.sh`;
      window.open(historyUrl, '_blank');
      tdSelectRef.current.value = currentVersion;
    };

    initHistoryVersions();
  }, [location, navigate]);

  return (
    <td-doc-layout>
      <td-header ref={tdHeaderRef} slot="header" platform="mobile">
        <div slot="search" style={{ display: 'flex', alignItems: 'center' }}>
          <td-doc-search ref={tdDocSearch} />
        </div>
      </td-header>
      <td-doc-aside ref={tdDocAsideRef} title="React for Mobile">
        <td-select ref={tdSelectRef} value={version} slot="extra"></td-select>
      </td-doc-aside>

      <td-doc-content ref={tdDocContentRef} platform="mobile">
        <Outlet />
        <td-doc-footer slot="doc-footer" platform="mobile"></td-doc-footer>
      </td-doc-content>

      {/* TODO: device 参数传递无效，待 tdesign-theme-generator 修复 */}
      {/* <td-theme-generator device="mobile" /> */}
    </td-doc-layout>
  );
}

function App() {
  useEffect(() => {
    const generator = document.createElement('td-theme-generator');
    generator.setAttribute('device', 'mobile');
    document.body.appendChild(generator);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/mobile-react/overview" />} />
        <Route exact path="/mobile-react" element={<Navigate replace to="/mobile-react/overview" />} />
        <Route
          path="/mobile-react/demos/*"
          element={
            <Suspense fallback={'拼命加载中...'}>
              <LazyDemo />
            </Suspense>
          }
        />
        <Route path="/mobile-react/*" element={<Components />}>
          {renderRouter}
        </Route>
        <Route path="*" element={<Navigate replace to="/mobile-react/overview" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
