const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

function migrateReactDeps(path) {
  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  const React19Deps = {
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
  Object.keys(React19Deps).forEach((dep) => {
    if (pkg.dependencies && pkg.dependencies[dep] !== undefined) {
      pkg.dependencies[dep] = React19Deps[dep];
    }
    if (pkg.devDependencies && pkg.devDependencies[dep] !== undefined) {
      pkg.devDependencies[dep] = React19Deps[dep];
    }
  });
  Object.keys(peerDependencies).forEach((dep) => {
    if (pkg.peerDependencies && pkg.peerDependencies[dep] !== undefined) {
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

// function setTestEnv(path) {
//   const pkg = JSON.parse(readFileSync(path, 'utf8'));
//   pkg.scripts = {
//     ...pkg.scripts,
//     test: 'cross-env REACT_19=true vitest run && pnpm run test:snap',
//     'test:ui': 'vitest --ui',
//     'test:snap': 'cross-env NODE_ENV=test-snap REACT_19=true vitest run',
//     'test:snap-update': 'cross-env NODE_ENV=test-snap REACT_19=true vitest run -u',
//     'test:update': 'cross-env REACT_19=true vitest run -u && pnpm run test:snap-update',
//   };
//   writeFileSync(path, JSON.stringify(pkg, null, 2));
// }

function resolveCwd(...args) {
  args.unshift(process.cwd());
  return path.join(...args);
}

function run() {
  migrateReactDeps(resolveCwd('package.json'));
  migrateReactDeps(resolveCwd('packages/tdesign-react/site/package.json'));
  migrateMdToReact(resolveCwd('packages/tdesign-react/site/plugin-tdoc/md-to-react.js'));
  // setTestEnv(resolveCwd('package.json'));
}

run();
