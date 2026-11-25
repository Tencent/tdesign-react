// 处理 mono repo 改动后的产物路径问题 后续和vue-next 复用同个build utils 后移除
// 支持桌面端与移动端：通过命令行参数指定包名，默认 tdesign-react
// 用法：node script/utils/bundle-override.js [tdesign-react|tdesign-mobile-react]

const glob = require('glob');
const { readFile, writeFile, existsSync } = require('fs-extra');
const { dirname, posix } = require('path');

const pkgName = process.argv[2] || 'tdesign-react';

function getWorkspaceRoot() {
  let dir = process.cwd();
  while (dir !== '/') {
    if (existsSync(posix.resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error('Could not find workspace root');
}

async function bundlePathOverride() {
  const workspaceRoot = getWorkspaceRoot();
  const esmPath = posix.resolve(workspaceRoot, `packages/${pkgName}/esm/**/style/index.js`);
  const files = glob.sync(esmPath);

  const stylePathReg = new RegExp(`packages/${pkgName}/esm/style`);
  files.forEach(async (filePath) => {
    const content = await readFile(filePath, 'utf8');
    const isStylePath = stylePathReg.test(filePath);
    if (!isStylePath) writeFile(filePath, content.replace(/..\/..\/..\/common/g, '../../common'), 'utf8');
    else writeFile(filePath, content.replace(/..\/..\/common/g, '../common'), 'utf8');
  });
}

bundlePathOverride();
