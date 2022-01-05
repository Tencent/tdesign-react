const fs = require('fs');
const path = require('path');
const camelCase = require('camelcase');

const DomParser = require('dom-parser');

const parser = new DomParser();
const result = {};

const resolveCwd = (...args) => {
  args.unshift(process.cwd());
  return path.join(...args);
};

fs.readFile(resolveCwd('test/unit/coverage/index.html'), 'utf8', (err, html) => {
  if (err) {
    console.log('please execute npm run test:coverage frist!', err);
    return;
  }
  if (!err) {
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

    const finalRes = `module.exports = ${JSON.stringify(result, null, 2)}`;
    fs.writeFileSync(resolveCwd('site/test-coverage.js'), finalRes);
    console.log('successful re-generate coverage');
  }
});
