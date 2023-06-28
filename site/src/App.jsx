import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Navigate, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import Loading from 'tdesign-react/loading';
import ConfigProvider from 'tdesign-react/config-provider';
// import locale from 'tdesign-react/locale/zh_CN';
// import locale from 'tdesign-react/locale/en_US';
import siteConfig from '../site.config';
import { getRoute, filterVersions } from './utils';
import packageJson from '@/package.json';

const LazyDemo = lazy(() => import('./components/Demo'));

const { docs, enDocs } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const docsMap = {
  zh: docs,
  en: enDocs,
};

const registryUrl = 'https://mirrors.tencent.com/npm/tdesign-react';
const currentVersion = packageJson.version.replace(/\./g, '_');

const docRoutes = [...getRoute(siteConfig.docs, []), ...getRoute(siteConfig.enDocs, [])];
const renderRouter = docRoutes.map((nav, i) => {
  const LazyCom = lazy(nav.component);

  return (
    <Route
      key={i}
      path={nav.path.replace('/react/', '')}
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
          const nums = v.split('.');
          if (nums[0] === '0' && nums[1] < 21) return false;

          options.unshift({ label: v, value: v.replace(/\./g, '_') });
        });
        tdSelectRef.current.options = options;
      });
  }

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

    tdSelectRef.current.onchange = ({ detail }) => {
      const { value: version } = detail;
      if (version === currentVersion) return;

      const historyUrl = `https://${version}-tdesign-react.surge.sh`;
      window.open(historyUrl, '_blank');
      tdSelectRef.current.value = currentVersion;
    };

    initHistoryVersions();
  }, []);

  useEffect(() => {
    document.querySelector('td-stats')?.track?.();
  }, [location]);

  return (
    <ConfigProvider /* globalConfig={{ animation: { exclude: ['ripple'] }}} */>
      <td-doc-layout>
        <td-header ref={tdHeaderRef} slot="header">
          <td-doc-search slot="search" ref={tdDocSearch} />
        </td-header>
        <td-doc-aside ref={tdDocAsideRef} title="React for Web">
          <td-select ref={tdSelectRef} value={version} slot="extra"></td-select>
        </td-doc-aside>

        <td-doc-content ref={tdDocContentRef}>
          <Outlet />
          <td-doc-footer slot="doc-footer"></td-doc-footer>
        </td-doc-content>
      </td-doc-layout>
      <td-theme-generator />
    </ConfigProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/react/overview" />} />
        <Route exact path="/react" element={<Navigate replace to="/react/overview" />} />
        <Route
          path="/react/demos/*"
          element={
            <Suspense fallback={<Loading text="拼命加载中..." loading />}>
              <LazyDemo />
            </Suspense>
          }
        />
        <Route path="/react/*" element={<Components />}>
          {renderRouter}
        </Route>
        <Route path="*" element={<Navigate replace to="/react/overview" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
