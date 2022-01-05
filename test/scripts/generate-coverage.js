const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const camelCase = require('camelcase');
const DomParser = require('dom-parser');

const parser = new DomParser();
const result = {};

const resolveCwd = (...args) => {
  args.unshift(process.cwd());
  return path.join(...args);
};

exec(`npm run test:coverage`, (err, stdout, stderr) => {
  // if (err) {
  //   console.error(err);
  // }
  fs.readFile(resolveCwd('test/unit/coverage/lcov-report/index.html'), 'utf8', (err, html) => {
    if (err) {
      console.error('未能生成单测覆盖率报告', err);
      return;
    }

    const dom = parser.parseFromString(html);
    const tds = dom.getElementsByTagName('td');

    let key = '';
    let value = '';

    Array.from(tds).forEach((item, index) => {
      const col = index % 10;

      if (col === 0) {
        const [, name] = item.getAttribute('data-value').split('src/');
        name && (key = camelCase(name));
      } else if (col === 8) {
        value = `${item.getAttribute('data-value')}%`;
      } else if (col === 9) {
        result[key] = value;
      }
    });

    const finalRes = `module.exports = { unit: ${JSON.stringify(result, null, 2)}}`;
    fs.writeFileSync(resolveCwd('site/test-coverage.js'), finalRes);
    console.log('successful re-generate coverage');

  });
});
