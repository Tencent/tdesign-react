import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'tdesign-mobile-react/button';

export const jsxDemoFiles = import.meta.glob('../../src/**/_example/*.jsx', { eager: true });
export const tsxDemoFiles = import.meta.glob('../../src/**/_example/*.tsx', { eager: true });

const demoObject = {};

function handleDemoComponents(allDemoFiles, ext) {
  const regexp = new RegExp(`([\\w-]+)._example.([\\w-]+).${ext}`);
  Object.keys(allDemoFiles).forEach((key) => {
    const match = key.match(regexp);
    const [, componentName, demoName] = match;

    demoObject[`${componentName}/${demoName}`] = allDemoFiles[key].default;
    if (demoObject[componentName]) {
      demoObject[componentName].push(demoName);
    } else {
      demoObject[componentName] = [demoName];
    }
  });
}

handleDemoComponents(jsxDemoFiles, 'jsx');
handleDemoComponents(tsxDemoFiles, 'tsx');

export default function Demo() {
  const location = useLocation();
  const match = location.pathname.match(/\/mobile-react\/demos\/([\w-]+)\/?([\w-]+)?/);
  const [, componentName, demoName] = match;
  const demoList = demoObject[componentName];
  const demoFunc = demoObject[`${componentName}/${demoName}`];

  return demoFunc ? (
    demoFunc()
  ) : (
    <ul style={{ margin: '48px 200px' }}>
      {demoList.map((demoName) => (
        <li key={demoName}>
          <Link to={`/mobile-react/demos/${componentName}/${demoName}`}>
            <Button style={{ fontSize: 18 }} variant="text">
              {demoName}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
