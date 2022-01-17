import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'tdesign-react/loading';
import Select from 'tdesign-react/select';
import ConfigProvider from 'tdesign-react/config-provider';
import siteConfig from '../site.config.js';
import { getRoute, filterVersions } from './utils';
// import locale from 'tdesign-react/locale/en_US';
import packageJson from '@/package.json';

const LazyDemo = lazy(() => import('./components/Demo'));

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const registryUrl = 'https://mirrors.tencent.com/npm/tdesign-react';
const currentVersion = packageJson.version.replace(/\./g, '_');

function Components(props) {
  const tdHeaderRef = useRef();
  const tdDocAsideRef = useRef();
  const tdDocContentRef = useRef();
  const tdDocSearch = useRef();

  const [versionOptions, setVersionOptions] = useState([]);
  const [version] = useState(currentVersion);

  const docRoutes = getRoute(siteConfig.docs, []);
  const [renderRouter] = useState(renderRoutes(docRoutes));

  function renderRoutes(docRoutes) {
    return docRoutes.map((nav, i) => {
      const LazyCom = lazy(nav.component);

      return <Route key={i} path={nav.path} component={() => <LazyCom {...props} />} />;
    });
  }

  function changeVersion(version) {
    if (version === currentVersion) return;
    const historyUrl = `//${version}-tdesign-react.surge.sh`;
    window.open(historyUrl, '_blank');
  }

  function initHistoryVersions() {
    fetch(registryUrl).then(res => res.json()).then(res => {
      const options = [];
      const versions = filterVersions(Object.keys(res.versions).filter(v => !v.includes('alpha')), 1);

      versions.forEach(v => {
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
        props.history.push(detail);
      });
      requestAnimationFrame(() => {
        tdDocContentRef.current.pageStatus = 'show';
        window.scrollTo(0, 0);
      });
    };

    initHistoryVersions();
  }, []);

  return (
    <ConfigProvider /* locale={locale} */>
      <td-doc-layout>
        <td-header ref={tdHeaderRef} slot="header">
          <td-doc-search slot="search" ref={tdDocSearch} />
        </td-header>
        <td-doc-aside ref={tdDocAsideRef} title="React for Web">
          {versionOptions.length ? (
            <div slot="extra">
              <Select value={version} options={versionOptions} onChange={changeVersion} />
            </div>
          ) : null}
        </td-doc-aside>

        <td-doc-content ref={tdDocContentRef}>
          <Suspense fallback={<Loading text="拼命加载中..." loading />}>{renderRouter}</Suspense>
          <td-doc-footer slot="doc-footer"></td-doc-footer>
        </td-doc-content>
      </td-doc-layout>
    </ConfigProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/react/overview" />
        <Redirect exact from="/react" to="/react/overview" />
        <Suspense fallback={<Loading text="拼命加载中..." loading />}>
          <Route path="/react/:docName" component={(props) => {
            if (props.match.params.docName === 'demos') return <LazyDemo {...props} />;
            return <Components {...props} />;
          }} />
        </Suspense>
        <Redirect from="*" to="/react/overview" />
        {/* TODO: 404 */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
