import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Navigate, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import Loading from 'tdesign-react/loading';
import Select from 'tdesign-react/select';
import ConfigProvider from 'tdesign-react/config-provider';
// import locale from 'tdesign-react/locale/zh_CN';
// import locale from 'tdesign-react/locale/en_US';
import siteConfig from '../site.config';
import { getRoute, filterVersions } from './utils';
import packageJson from '@/package.json';

const LazyDemo = lazy(() => import('./components/Demo'));

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const registryUrl = 'https://mirrors.tencent.com/npm/tdesign-react';
const currentVersion = packageJson.version.replace(/\./g, '_');

const docRoutes = getRoute(siteConfig.docs, []);
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
  const tdDocSearch = useRef();

  const [versionOptions, setVersionOptions] = useState([]);
  const [version] = useState(currentVersion);

  function changeVersion(version) {
    if (version === currentVersion) return;
    const historyUrl = `//${version}-tdesign-react.surge.sh`;
    window.open(historyUrl, '_blank');
  }

  function initHistoryVersions() {
    fetch(registryUrl)
      .then((res) => res.json())
      .then((res) => {
        const options = [];
        const versions = filterVersions(
          Object.keys(res.versions).filter((v) => !v.includes('alpha')),
          1,
        );

        versions.forEach((v) => {
          const nums = v.split('.');
          if (nums[0] === '0' && nums[1] < 21) return false;

          options.unshift({ label: v, value: v.replace(/\./g, '_') });
        });
        setVersionOptions(options);
      });
  }

  useEffect(() => {
    tdHeaderRef.current.framework = 'react';
    tdDocSearch.current.docsearchInfo = { indexName: 'tdesign_doc_react' };
    tdDocAsideRef.current.routerList = routerList;
    tdDocAsideRef.current.onchange = ({ detail }) => {
      if (location.pathname === detail) return;
      tdDocContentRef.current.pageStatus = 'hidden';
      requestAnimationFrame(() => {
        navigate(detail);
      });
      requestAnimationFrame(() => {
        tdDocContentRef.current.pageStatus = 'show';
        window.scrollTo(0, 0);
      });
    };

    initHistoryVersions();
  }, [location, navigate]);

  return (
    <ConfigProvider /* globalConfig={{ locale, animation: { exclude: ['ripple'] }}} */>
      <td-doc-layout>
        <td-header ref={tdHeaderRef} slot="header">
          <td-doc-search slot="search" ref={tdDocSearch} />
        </td-header>
        <td-doc-aside ref={tdDocAsideRef} title="React for Web">
          {versionOptions.length ? (
            <div slot="extra">
              <Select popupProps={{ zIndex: 800 }} value={version} options={versionOptions} onChange={changeVersion} />
            </div>
          ) : null}
        </td-doc-aside>

        <td-doc-content ref={tdDocContentRef}>
          <Outlet />
          <td-doc-footer slot="doc-footer"></td-doc-footer>
        </td-doc-content>
      </td-doc-layout>
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
