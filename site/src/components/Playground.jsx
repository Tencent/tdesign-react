import React from 'react';
import { HashRouter, Routes, Navigate, Route, useLocation, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Button from 'tdesign-react/button';
import 'tdesign-react/style/index.js';

const demoFiles = import.meta.globEager('../../../src/**/_example/*.jsx');
const demoObject = {};
const componentList = new Set();
Object.keys(demoFiles).forEach((key) => {
  const match = key.match(/([\w-]+)._example.([\w-]+).jsx/);
  const [, componentName, demoName] = match;

  componentList.add(componentName);
  demoObject[`${componentName}/${demoName}`] = demoFiles[key].default;
  if (demoObject[componentName]) {
    demoObject[componentName].push(demoName);
  } else {
    demoObject[componentName] = [demoName];
  }
});

function Demos() {
  const location = useLocation();
  const match = location.pathname.match(/\/demos\/([\w-]+)\/?([\w-]+)?/);
  const [, componentName] = match;
  const demoList = demoObject[componentName];

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ul>
        {[...componentList].map((com) => (
          <li key={com}>
            <Link
              to={{
                pathname: `/demos/${com}`,
              }}
            >
              <Button style={{ fontSize: 18 }} variant="text">
                {com}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        {demoList.map((demoName) => (
          <div
            key={demoName}
            style={{
              padding: 24,
              margin: 24,
              height: 'fit-content',
              display: 'inline-block',
              verticalAlign: 'top',
              border: '1px dashed var(--td-border-level-2-color)',
            }}
          >
            <h2>{demoName}</h2>
            {demoObject[`${componentName}/${demoName}`]()}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/demos/*" element={<Demos />} />
        <Route path="*" element={<Navigate replace to="/demos/button" />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
