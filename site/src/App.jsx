import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Components from './pages/Components';
// import DemoList from './pages/demo-list';

import './App.less';
import '../../common/style/web/index.less';
import '../../common/style/web/docs.less';
import '../../common/style/site/index.less';
import './demo.less';

// const demoReq = import.meta.glob('../../src/**/_example/*.jsx');

class App extends React.PureComponent {
  // renderDemoRoutes() {
  //   if (process.env.NODE_ENV === 'development') {
  //     return Object.keys(demoReq).map((key, i) => {
  //       const match = key.match(/([\w-]+)._example.([\w-]+).jsx/);
  //       const [, componentName, demoName] = match;
  //       return <Route key={i} path={`/_example/${componentName}/${demoName}`} component={demoReq[key]()} />;
  //     });
  //   }
  //   return [];
  // }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/react" to="/react/components/button" />
          <Redirect exact from="/react/components" to="/react/components/button" />
          <Route path="/react/components/*" component={Components} />
          {/* {this.renderDemoRoutes()} */}
          {/* <Route path="/demos/:componentName" component={DemoList} /> */}
          <Redirect from="*" to="/react/components/button" />
          {/* TODO: 404 */}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
