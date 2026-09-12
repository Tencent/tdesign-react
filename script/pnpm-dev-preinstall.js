const { execSync } = require('child_process');

function initSubmodule() {
  if (process.env.CI) {
    return;
  }
  try {
    execSync('git submodule update --init', { stdio: 'inherit' });
    console.info('子模块初始化成功');
  } catch (error) {
    console.error(`子模块初始化失败: ${error.message}`);
  }
}

initSubmodule();
