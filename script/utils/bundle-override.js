// 处理 mono repo 改动后的产物路径问题 后续和vue-next 复用同个build utils 后移除

const glob = require('glob');
const { readFile, writeFile, existsSync } = require('fs-extra');
const { dirname, posix } = require('path');

function getWorkspaceRoot() {
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(`${dir}/pnpm-workspace.yaml`)) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error('Could not find workspace root');
}

async function bundlePathOverride() {
  const a = getWorkspaceRoot();
  const esmPath = posix.resolve(a, 'packages/tdesign-react/esm/**/style/index.js');
  const files = glob.sync(esmPath);

  files.forEach(async (filePath) => {
    const content = await readFile(filePath, 'utf8');
    writeFile(filePath, content.replace(/..\/..\/..\/common/g, '../../common'), 'utf8');
  });
}

bundlePathOverride();
