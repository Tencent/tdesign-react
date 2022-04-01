const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const config = require('./config.js');

const renderUsageStr = (compStrMap) =>
  `/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from 'react';
import BaseUsage, { useConfigChange } from '@site/src/components/BaseUsage';
import jsxToString from 'jsx-to-string';
${compStrMap.configStr}
${compStrMap.importStr}

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  ${compStrMap.usageStr}

  const jsxStr = jsxToString(renderComp);

  return (
    <BaseUsage code={jsxStr} configList={configList} onConfigChange={onConfigChange}>
      {renderComp}
    </BaseUsage>
  );
} 
`;
// 自动化生成 live demo 脚本
function genUsage() {
  for (let name of Object.keys(config)) {
    try {
      const fileFolderPath = path.resolve(__dirname, `../../src/${name}/usage`);
      fs.mkdirSync(fileFolderPath);
    } catch {}

    try {
      const data = renderUsageStr(config[name]);
      const filePath = path.resolve(__dirname, `../../src/${name}/usage/index.jsx`);
      fs.writeFileSync(filePath, prettier.format(data, { parser: 'babel', tabWidth: 2 }));
    } catch (err) {
      console.error(`${name} usage 组件生成失败...`, err);
    }
    console.log(`${name} usage 组件生成成功...`);
  }
}

genUsage();
