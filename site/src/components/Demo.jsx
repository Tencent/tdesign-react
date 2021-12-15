import React from 'react';

export const demoFiles = import.meta.globEager('../../../src/**/_example/*.jsx');

const demoObject = {};
Object.keys(demoFiles).forEach((key) => {
  const match = key.match(/([\w-]+)._example.([\w-]+).jsx/);
  const [, componentName, demoName] = match;

  demoObject[`${componentName}/${demoName}`] = demoFiles[key].default;
});

export default function Demo(props) {
  const { location } = props;
  const match = location.pathname.match(/\/react\/demos\/([\w-]+)\/([\w-]+)/);
  const [, componentName, demoName] = match;
  const demoFunc = demoObject[`${componentName}/${demoName}`];
  console.log('%c 所有 demo 路径参考: \n', 'color: #0052d9;', demoObject);

  return demoFunc ? demoFunc() : <h1>请输入正确的 demo 路径，例如：/react/demos/:componentName/:demoName</h1>;
}
