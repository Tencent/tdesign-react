import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'tdesign-react/loading';
import Select from 'tdesign-react/select';
import ConfigProvider from 'tdesign-react/config-provider';
import siteConfig from '../site.config.js';
import { getRoute } from './utils';
// import locale from 'tdesign-react/locale/en_US';
import packageJson from '@/package.json';

const lazyDemo = lazy(() => import('./components/Demo'));

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const historyVersion = [];
const versionOptions = [
  { value: packageJson.version, label: packageJson.version },
  ...historyVersion.map((v) => ({ value: v, label: v })),
];

function Components(props) {
  const tdHeaderRef = useRef();
  const tdDocAsideRef = useRef();
  const tdDocContentRef = useRef();
  const tdDocSearch = useRef();
  const [version] = useState(packageJson.version);

  const docRoutes = getRoute(siteConfig.docs, []);
  const [renderRouter] = useState(renderRoutes(docRoutes));

  function renderRoutes(docRoutes) {
    return docRoutes.map((nav, i) => {
      const LazyCom = lazy(nav.component);

      return <Route key={i} path={nav.path} component={() => <LazyCom {...props} />} />;
    });
  }

  function changeVersion(version) {
    if (version === packageJson.version) return;
    location.href = `//preview-${version}-tdesign-react.surge.sh`;
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
  }, []);

  return (
    <ConfigProvider /* locale={locale} */>
      <td-doc-layout>
        <td-header ref={tdHeaderRef} slot="header">
          <td-doc-search slot="search" ref={tdDocSearch} />
        </td-header>
        <td-doc-aside ref={tdDocAsideRef} title="React for Web">
          {historyVersion.length ? (
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
  const Router = process.env.NODE_ENV === 'preview' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <Switch>
        <Redirect exact from="/react" to="/react/components/overview" />
        <Redirect exact from="/react/components" to="/react/components/overview" />
        <Route path="/react/components/*" component={Components} />
        <Suspense fallback={<Loading text="拼命加载中..." loading />}>
          <Route path="/react/demos/:componentName/:demoName" component={lazyDemo} /> 
        </Suspense>
        <Redirect from="*" to="/react/components/overview" />
        {/* TODO: 404 */}
      </Switch>
    </Router>
  );
}

export default App;
