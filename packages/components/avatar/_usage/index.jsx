/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';

import { Avatar } from 'tdesign-react';
import configProps from './props.json';

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: 'avatar', value: 'avatar' }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const defaultProps = { image: 'https://tdesign.gtimg.com/site/avatar.jpg' };
  useEffect(() => {
    setRenderComp(<Avatar {...defaultProps} {...changedProps} />);
  }, [changedProps]);

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
