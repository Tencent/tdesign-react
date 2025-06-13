const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

function migrateReactDeps(path) {
  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  const dependencies = {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@types/react-is': '^19.0.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    'react-router-dom': '^7.0.0',
    'react-is': '^19.0.0',
  };
  const peerDependencies = {
    react: '>=18.0.0',
    'react-dom': '>=18.0.0',
  };
  Object.keys(dependencies).forEach((dep) => {
    if (pkg.dependencies && Reflect.has(pkg.dependencies, dep)) {
      pkg.dependencies[dep] = dependencies[dep];
    }
    if (pkg.devDependencies && Reflect.has(pkg.devDependencies, dep)) {
      pkg.devDependencies[dep] = dependencies[dep];
    }
  });
  Object.keys(peerDependencies).forEach((dep) => {
    if (pkg.peerDependencies && Reflect.has(pkg.peerDependencies, dep)) {
      pkg.peerDependencies[dep] = peerDependencies[dep];
    }
  });
  writeFileSync(path, JSON.stringify(pkg, null, 2));
}

function migrateMdToReact(path) {
  let content = readFileSync(path, 'utf8');
  content = content.replace("'react-router-dom'", "'react-router'");
  writeFileSync(path, content);
}

function resolveCwd(...args) {
  args.unshift(process.cwd());
  return path.join(...args);
}

function run() {
  migrateReactDeps(resolveCwd('package.json'));
  migrateReactDeps(resolveCwd('packages/tdesign-react/package.json'));
  migrateReactDeps(resolveCwd('packages/tdesign-react/site/package.json'));
  migrateMdToReact(resolveCwd('packages/tdesign-react/site/plugin-tdoc/md-to-react.js'));
}

run();
