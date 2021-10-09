import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import siteConfig from '../site.config.js';
import { getRoute, getContributors } from './utils';
import DemoList, { demoFiles } from './DemoList';
import { Loading, Select } from '@tencent/tdesign-react';
import packageJson from '@/package.json';

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const historyVersion = ['0.13.0'];
const versionOptions = [
  { value: packageJson.version, label: packageJson.version },
  ...historyVersion.map((v) => ({ value: v, label: v })),
];

function renderDemoRoutes() {
  if (process.env.NODE_ENV === 'development') {
    return Object.keys(demoFiles).map((key, i) => {
      const match = key.match(/([\w-]+)._example.([\w-]+).jsx/);
      const componentName = match[1];
      const demoName = match[2];

      return <Route key={key} path={`/react/demos/${componentName}/${demoName}`} component={demoFiles[key].default} />;
    });
  }
  return [];
}

function Components(props) {
  const tdHeaderRef = useRef();
  const tdDocAsideRef = useRef();
  const tdDocContentRef = useRef();
  const tdDocSearch = useRef();
  const [version, setVersion] = useState(packageJson.version);

  const docRoutes = getRoute(siteConfig.docs, []);
  const [renderRouter] = useState(renderRoutes(docRoutes));

  function renderRoutes(docRoutes) {
    return docRoutes.map((nav, i) => {
      const LazyCom = lazy(nav.component);

      return (
        <Route
          key={i}
          path={nav.path}
          component={() => <LazyCom {...props} contributors={getContributors(nav.name) || []} docType={nav.docType} />}
        />
      );
    });
  }

  function changeVersion(version) {
    if (version === packageJson.version) return;
    location.href = `https://tdesign.cdn-go.cn/tdesign-web-react/${version}/`;
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
    <td-doc-layout>
      <td-header ref={tdHeaderRef} slot="header">
        <td-doc-search slot="search" ref={tdDocSearch} />
        <div slot="links">
          <Select style={{ width: 100 }} value={version} options={versionOptions} onChange={changeVersion} />
        </div>
      </td-header>
      <td-doc-aside ref={tdDocAsideRef} slot="doc-aside" title="React for Web"></td-doc-aside>

      <td-doc-content ref={tdDocContentRef} slot="doc-content">
        <Suspense fallback={<Loading text="拼命加载中..." loading />}>
          {renderRouter}
        </Suspense>
        <td-doc-footer slot="doc-footer"></td-doc-footer>
      </td-doc-content>
    </td-doc-layout>
  );
}

function App() {
  const Router = process.env.NODE_ENV === 'staging' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <Switch>
        <Redirect exact from="/react" to="/react/components/button" />
        <Redirect exact from="/react/components" to="/react/components/button" />
        <Route path="/react/components/*" component={Components} />
        {renderDemoRoutes()}
        <Route path="/react/demos/:componentName" component={DemoList} />
        <Redirect from="*" to="/react/components/button" />
        {/* TODO: 404 */}
      </Switch>
    </Router>
  );
}

export default App;
