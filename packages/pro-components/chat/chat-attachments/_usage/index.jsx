/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';

import { ChatAttachments } from '@tdesign-react/aigc';
import configProps from './props.json';

const filesList = [
  {
    name: 'excel-file.xlsx',
    size: 111111,
  },
  {
    name: 'word-file.docx',
    size: 222222,
  },
  {
    name: 'image-file.png',
    size: 333333,
    url: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  {
    name: 'pdf-file.pdf',
    size: 444444,
  },
  {
    name: 'ppt-file.pptx',
    size: 555555,
  },
  {
    name: 'video-file.mp4',
    size: 666666,
  },
  {
    name: 'audio-file.mp3',
    size: 777777,
  },
  {
    name: 'zip-file.zip',
    size: 888888,
  },
  {
    name: 'markdown-file.md',
    size: 999999,
    description: 'Custom description',
  },
  {
    name: 'word-markdown-file.doc',
    size: 99899,
    status: 'progress',
    percent: 50,
  },
];

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: 'chatAttachments', value: 'chatAttachments' }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    setRenderComp(
      <div style={{ width: '600px' }}>
        <ChatAttachments items={filesList} {...changedProps} />
      </div>,
    );
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
