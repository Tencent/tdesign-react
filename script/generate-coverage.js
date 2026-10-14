// TODO: move test into packages/tdesign-react
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');

const DomParser = require('dom-parser');

const parser = new DomParser();

const OUTPUT_PATH = 'packages/tdesign-react/site/test-coverage.js';

const COMPONENT_COVERAGE_PATH = /^tdesign-react\/packages\/components\/([a-z0-9][a-z0-9-]*)$/;

function resolveCwd(...args) {
  args.unshift(process.cwd());
  return path.join(...args);
}

function getPublishedComponentDirNames() {
  const indexPath = resolveCwd('packages/components/index.ts');
  const content = fs.readFileSync(indexPath, 'utf8');
  const dirs = new Set();
  const exportPattern = /export\s+\*\s+from\s+['"]\.\/([^'"]+)['"]/g;
  let match = exportPattern.exec(content);
  while (match) {
    dirs.add(match[1]);
    match = exportPattern.exec(content);
  }
  return dirs;
}

function formatObjectKey(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${String(key).replace(/'/g, "\\'")}'`;
}

function serializeCoverage(resultCoverage) {
  const keys = Object.keys(resultCoverage).sort((a, b) => a.localeCompare(b));
  const blocks = keys.map((key) => {
    const metrics = resultCoverage[key];
    return `  ${formatObjectKey(key)}: {
    statements: '${metrics.statements}',
    branches: '${metrics.branches}',
    functions: '${metrics.functions}',
    lines: '${metrics.lines}',
  }`;
  });

  return `export default {\n${blocks.join(',\n')},\n};\n`;
}

function formatWithPrettier(filePath) {
  execSync(`npx prettier --write --single-quote "${filePath}"`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

fs.readFile(resolveCwd('test/coverage/index.html'), 'utf8', (err, html) => {
  if (err) {
    console.log('please execute npm run test:unit-coverage first!', err);
    return;
  }

  const dom = parser.parseFromString(html);
  const tds = dom.getElementsByTagName('td');
  const size = 10;
  const groups = Math.ceil(tds.length / size);

  const resultCoverage = {};
  const componentDirNames = getPublishedComponentDirNames();

  for (let i = 0; i < groups; i++) {
    const item = tds.slice(i * size, (i + 1) * size);
    const dataVal = item[0]?.getAttribute('data-value');
    if (!dataVal) continue;

    const match = dataVal.match(COMPONENT_COVERAGE_PATH);
    if (!match) continue;

    const dirName = match[1];
    if (!componentDirNames.has(dirName)) continue;

    const key = camelCase(dirName);
    resultCoverage[key] = {
      statements: `${item[2].getAttribute('data-value')}%`,
      branches: `${item[4].getAttribute('data-value')}%`,
      functions: `${item[6].getAttribute('data-value')}%`,
      lines: `${item[8].getAttribute('data-value')}%`,
    };
  }

  const outPath = resolveCwd(OUTPUT_PATH);
  fs.writeFileSync(outPath, serializeCoverage(resultCoverage));
  formatWithPrettier(outPath);
  console.log('successful re-generate coverage');
});
