const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const camelCase = require('camelcase');
const DomParser = require('dom-parser');

const parser = new DomParser();
const result = {};
const EXAMPLE_FILE = '/Example';
const DECIMAL = 2;

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
    console.log(`👍successful re-generate ${type} coverage`);
    return JSON.stringify(result, null, 2);
  } catch (err) {
    console.error(`未能生成${type}覆盖率报告`, err);
  }
}

function calculate(start, end) {
  try {
    return `${(((start / end) || 0) * 100).toFixed(DECIMAL)}%`;
  } catch (err) {
    return '0%';
  }
}

// 格式化处理value，四舍五入保留两位小数
function formatValue(value) {
  const [start, end] = value.split('/');
  return calculate(start, end);
}

function formatCoverageResult(result) {
  return result.map((coverageOld) => {
    let coverage = coverageOld;

    try {
      coverage = JSON.parse(coverage);
    } catch (err) {
      console.error(err);
      return;
    }

    const statistics = {};

    coverage = Object.entries(coverage).reduce((covs, [keyPath, value]) => {
      const newCovs = covs;
      newCovs[keyPath] = formatValue(value);

      // EXAMPLE_FILE直接保留返回
      if (keyPath.endsWith(EXAMPLE_FILE)) {
        return newCovs;
      }

      const [root, sub] = keyPath.split('/');

      // 根文件
      if (!sub) {
        statistics[keyPath] = value;
        return newCovs;
      }

      const preValue = statistics[root];
      // 根文件存在子目录
      if (preValue) {
        const [preStart, preEnd] = preValue.split('/').map(item => Number(item));
        const [start, end] = value.split('/').map(item => Number(item));
        statistics[root] = `${preStart + start} / ${preEnd + end}`;
        newCovs[root] = calculate((preStart + start), (preEnd + end));
        delete newCovs[keyPath];
        return newCovs;
      }

      return newCovs;
    }, {});

    return JSON.stringify(coverage);
  });
}

function getTypeName(result) {
  let type = 'unit';
  if (!result[0]) {
    if (result[1]) {
      type = 'e2e';
    } else if (result[2]) {
      type = 'ssr';
    } else {
      type = '';
    }
  }

  return type;
}

const coverageExec = exec('npm run test:coverage', async () => {
  let result = await Promise.all([
    generateReportJson('test/unit/coverage/index.html', 'unit'),
    generateReportJson('test/e2e/cy-report/coverage/lcov-report/index.html', 'e2e'),
    generateReportJson('test/ssr/coverage/index.html', 'ssr'),
  ]);

  result = formatCoverageResult(result);
  const [resultunit = '{}', resulte2e = '{}', resultssr = '{}'] = result;
  const finalRes = `module.exports = { unit: ${resultunit}, e2e: ${resulte2e}, ssr: ${resultssr}}`;

  fs.writeFileSync(resolveCwd('site/test-coverage.js'), finalRes);

  const type = getTypeName(result);
  type && console.log(`已成功生成${type} 覆盖率报告，请于site/test-coverage.js查看`);
});

let data = 0;
coverageExec.stdout.on('data', () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  data += 1;

  process.stdout.write(data % 2 ? '努力生成中💪...' : '再耐心等一下⌛️...');
});
