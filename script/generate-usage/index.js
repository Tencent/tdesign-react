const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const config = require('./config.js');

const renderUsageStr = (compStrMap) =>
  `/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';
${compStrMap.importStr}

export default function Usage() {
  ${compStrMap.configStr}
  const { changedProps, onConfigChange } = useConfigChange(configList);

  ${compStrMap.panelStr}
  const { panel, onPanelChange } = usePanelChange(panelList);
  
  const [renderComp, setRenderComp] = useState();
  ${compStrMap.usageStr}

  const jsxStr = useMemo(() => {
    if (!renderComp) return '';
    return jsxToString(renderComp);
  }, [renderComp]);

  return (
    <BaseUsage
      code={jsxStr}
      panelList={panelList}
      configList={configList}
      onPanelChange={onPanelChange}
      onConfigChange={onConfigChange}
    >
      {renderComp}
    </BaseUsage>
  );
} 
`;
// 自动化生成 live demo 脚本
function genUsage() {
  for (let name of Object.keys(config)) {
    try {
      const fileFolderPath = path.resolve(__dirname, `../../src/${name}/_usage`);
      fs.mkdirSync(fileFolderPath);
    } catch {}

    try {
      const data = renderUsageStr(config[name]);
      const filePath = path.resolve(__dirname, `../../src/${name}/_usage/index.jsx`);
      fs.writeFileSync(filePath, prettier.format(data, { parser: 'babel', tabWidth: 2 }));
    } catch (err) {
      console.error(`${name} usage 组件生成失败...`, err);
    }
    console.log(`${name} usage 组件生成成功...`);
  }
}

genUsage();
