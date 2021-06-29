import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import siteConfig from '../site.config.js';
import dynamic from './utils/dynamic';
import { getRoute, getContributors } from './utils/index';

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

function Components(props) {
  const componentName = props.match.params['0'];
  const isComponentPath = !['install', 'changelog'].includes(componentName);

  const tdHeaderRef = useRef();
  const tdDocAsideRef = useRef();
  const tdDocContentRef = useRef();

  const docRoutes = getRoute(siteConfig.docs, []);
  const [renderRouter] = useState(renderRoutes(docRoutes));

  function renderRoutes(docRoutes) {
    return docRoutes.map((nav, i) => (
      <Route
        key={i}
        path={nav.path}
        component={dynamic(nav.component, {
          contributors: getContributors(nav.name) || [],
          isComponent: !['install', 'changelog'].includes(nav.name),
        })}
      ></Route>
    ));
  }

  useEffect(() => {
    tdHeaderRef.current.framework = 'react';
    tdDocAsideRef.current.routerList = routerList;
    tdDocAsideRef.current.onchange = ({ detail }) => {
      if (location.pathname === detail) return;
      props.history.push(detail);
      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    tdDocContentRef.current.isComponent = isComponentPath;
  }, [isComponentPath]);

  return (
    <td-doc-layout>
      <td-header ref={tdHeaderRef} slot="header"></td-header>
      <td-doc-aside ref={tdDocAsideRef} slot="doc-aside" title="React For Web">
        <td-doc-platforms slot="platforms"></td-doc-platforms>
      </td-doc-aside>

      <td-doc-content ref={tdDocContentRef} slot="doc-content">
        {renderRouter}
        <td-doc-footer slot="doc-footer"></td-doc-footer>
      </td-doc-content>
    </td-doc-layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/react" to="/react/components/button" />
        <Redirect exact from="/react/components" to="/react/components/button" />
        <Route path="/react/components/*" component={withRouter(Components)} />
        {/* <Route path="/demos/:componentName" component={DemoList} /> */}
        <Redirect from="*" to="/react/components/button" />
        {/* TODO: 404 */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
