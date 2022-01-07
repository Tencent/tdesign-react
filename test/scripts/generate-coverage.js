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

const generateReportJson = async (filepath, type) => {
  try {
    const html = await fs.readFileSync(filepath, 'utf8');
    const dom = parser.parseFromString(html);
    const tds = dom.getElementsByTagName('td');

    let key = '';
    Array.from(tds).forEach((item, index) => {
      const col = index % 10;
      if (col === 0) {
        const [, name] = item.getAttribute('data-value').split('src/');
        name && (key = camelCase(name));
      } else if (col === 9) {
        if (key !== '')
          result[key] = item.innerHTML;
      }
    });
    console.log(`successful re-generate ${type} coverage`);
    return JSON.stringify(result, null, 2);
  } catch (err) {
    console.error(`未能生成${type}覆盖率报告`, err);
  }
}

exec('npm run test:coverage', async (err, stdout, stderr) => {
  const [resultunit = '{}', resulte2e = '{}', resultssr = '{}'] = await Promise.all([
    generateReportJson('test/unit/coverage/index.html', 'unit'),
    generateReportJson('test/e2e/cy-report/coverage/lcov-report/index.html', 'e2e'),
    generateReportJson('test/ssr/coverage/index.html', 'ssr'),
  ]);
  const finalRes = `module.exports = { unit: ${resultunit}, e2e: ${resulte2e}, ssr: ${resultssr}}`;
  fs.writeFileSync(resolveCwd('site/test-coverage.js'), finalRes);
  console.log(`已成功生成${resultunit !== '{}' ? ' unit ' : resulte2e !== '{}' ? ' e2e ' : resultssr !== '{}' ? ' ssr ' : ''} 覆盖率报告，请于site/test-coverage.js查看`);
});
