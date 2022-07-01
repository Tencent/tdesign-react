const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const camelCase = require('camelcase');
const DomParser = require('dom-parser');

const parser = new DomParser();
const result = {};
const EXAMPLE_FILE = '/Example';
const ALL_KEY = 'all';
const DECIMAL = 2;

const resolveCwd = (...args) => {
  args.unshift(process.cwd());
  return path.join(...args);
};

const coveragePath = resolveCwd('site/test-coverage.js');

const calculate = (start, end) => {
  try {
    return `${(((start / end) || 0) * 100).toFixed(DECIMAL)}%`;
  } catch (err) {
    return '0%';
  }
}

// 格式化处理 value，四舍五入保留两位小数
const formatValue = (value) => {
  const [start, end] = value.split('/');
  return calculate(start, end);
}

const generateReportJson = async (filepath, type) => {
  try {
    const html = await fs.readFileSync(filepath, 'utf8');
    const dom = parser.parseFromString(html);
    // 提取表格中各个子组件覆盖率 td
    const tds = dom.getElementsByTagName('td');

    // 提取总体行覆盖率
    let allPercent = 0;
    const fraction = dom.getElementsByClassName('fraction');
    if (fraction.length > 0) {
      allPercent = fraction[fraction.length - 1].textContent;
    }
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
    result[ALL_KEY] = allPercent || 0;
    console.log(`\n 已完成 ${type} coverage产出`);
    return JSON.stringify(result, null, 2);
  } catch (err) {
    console.error(`\n 未能生成${type}覆盖率报告，将延用现有数据`, err);
  }
}

const formatCoverageResult = (result) => result.map((coverageOld) => {
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

    // EXAMPLE_FILE 直接保留返回
    if (keyPath.endsWith(EXAMPLE_FILE) || keyPath === ALL_KEY) {
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
})

const coverageExec = exec('npm run test:coverage', async () => {
  let result = await Promise.all([
    generateReportJson('test/unit/coverage/index.html', 'unit'),
    // generateReportJson('test/e2e/cy-report/coverage/lcov-report/index.html', 'e2e'),
    // generateReportJson('test/ssr/coverage/index.html', 'ssr'),
  ]);
  result = formatCoverageResult(result);
  const originalCoverage = await fs.readFileSync(coveragePath, 'utf8'); // 如果解析失败，有上一次生成的结果文件兜底
  const { unit = {}, e2e = {}, ssr = {} } = JSON.parse(originalCoverage.replace('export default ', ''));
  const [resultunit = JSON.stringify(unit), resulte2e = JSON.stringify(e2e), resultssr = JSON.stringify(ssr)] = result;
  const finalRes = `export default {
      "unit": ${resultunit}, 
      "e2e": ${resulte2e}, 
      "ssr": ${resultssr}
    }`;

  fs.writeFileSync(coveragePath, finalRes);
  console.log('👍覆盖率报告解析完毕，请于 site/test-coverage.js 查看');
});

let data = 0;
coverageExec.stdout.on('data', () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  data += 1;

  process.stdout.write(data % 2 ? '努力生成中💪...' : '再耐心等一下⌛️...');
});
