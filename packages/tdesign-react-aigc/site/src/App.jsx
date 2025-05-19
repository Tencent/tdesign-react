import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Navigate, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import semver from 'semver';
import Loading from '@tdesign/components/loading';

import packageJson from '../../package.json';
import * as siteConfig from '../site.config';
import { getRoute, filterVersions } from './utils';

const LazyDemo = lazy(() => import('./components/Demo'));

const isDev = import.meta.env.DEV;

const { docs, enDocs } = JSON.parse(JSON.stringify(siteConfig.default).replace(/component:.+/g, ''));

const docsMap = {
  zh: docs,
  en: enDocs,
};

const registryUrl = 'https://service-edbzjd6y-1257786608.hk.apigw.tencentcs.com/release/npm/versions/tdesign-react';
const currentVersion = packageJson.version.replace(/\./g, '_');

const docRoutes = [...getRoute(siteConfig.default.docs, []), ...getRoute(siteConfig.default.enDocs, [])];
const renderRouter = docRoutes.map((nav, i) => {
  const LazyCom = lazy(nav.component);

  return (
    <Route
      key={i}
      path={nav.path.replace('/react-aigc/', '')}
      element={
        <Suspense fallback={<Loading text="拼命加载中..." loading />}>
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
  const tdDocSearch = useRef();

  useEffect(() => {
    tdHeaderRef.current.framework = 'react';
    tdDocSearch.current.docsearchInfo = { indexName: 'tdesign_doc_react' };
    const isEn = window.location.pathname.endsWith('en');
    tdDocAsideRef.current.routerList = isEn ? docsMap.en : docsMap.zh;

    tdDocAsideRef.current.onchange = ({ detail }) => {
      if (window.location.pathname === detail) return;
      tdDocContentRef.current.pageStatus = 'hidden';
      navigate(detail);
      requestAnimationFrame(() => {
        tdDocContentRef.current.pageStatus = 'show';
        window.scrollTo(0, 0);
      });
    };

    if (isDev) return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.querySelector('td-stats')?.track?.();
  }, [location]);

  return (
    <>
      <td-doc-layout>
        <td-header ref={tdHeaderRef} slot="header">
          <td-doc-search slot="search" ref={tdDocSearch} />
        </td-header>
        <td-doc-aside ref={tdDocAsideRef} title="TDesign AIGC for React" />

        <td-doc-content ref={tdDocContentRef}>
          <Outlet />
          <td-doc-footer slot="doc-footer"></td-doc-footer>
        </td-doc-content>
      </td-doc-layout>
      <td-theme-generator />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/react-aigc/getting-started" />} />
        <Route exact path="/react-aigc" element={<Navigate replace to="/react-aigc/getting-started" />} />
        <Route
          path="/react-aigc/demos/*"
          element={
            <Suspense fallback={<Loading text="拼命加载中..." loading />}>
              <LazyDemo />
            </Suspense>
          }
        />
        <Route path="/react-aigc/*" element={<Components />}>
          {renderRouter}
        </Route>
        <Route path="*" element={<Navigate replace to="/react-aigc/getting-started" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
