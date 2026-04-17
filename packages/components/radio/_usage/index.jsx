/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';

import { Radio } from 'tdesign-react';

import RadioConfigProps from './radio-props.json';
import RadioGroupConfigProps from './radio-group-props.json';

export default function Usage() {
  const [configList, setConfigList] = useState(RadioConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: 'Radio', value: 'radio', config: RadioConfigProps },
    {
      label: 'RadioGroup',
      value: 'radioGroup',
      config: RadioGroupConfigProps,
    },
  ];

  const radioOptions = ['选项一', '选项二', '选项三', '选项四'];

  const panelMap = {
    radio: <Radio {...changedProps}>单选框</Radio>,
    radioGroup: <Radio.Group options={radioOptions} defaultValue="选项一" {...changedProps} />,
  };

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    const currentPanel = panelList.find((p) => p.value === panel);
    if (currentPanel && currentPanel.config) {
      setConfigList(currentPanel.config);
    }
  }, [panel]);

  useEffect(() => {
    setRenderComp(panelMap[panel]);
  }, [changedProps, panel]);

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
