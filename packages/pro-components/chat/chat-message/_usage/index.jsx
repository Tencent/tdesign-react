/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';

import { ChatMessage } from '@tdesign-react/chat';

import configProps from './props.json';

const message = {
  content: [
    {
      type: 'text',
      data: '牛顿第一定律是否适用于所有参考系？',
    },
    {
      id: '11111',
      role: 'assistant',
      status: 'pending',
    },
  ],
};

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: 'ChatMessage', value: 'ChatMessage' }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    setRenderComp(
      <div style={{ width: '600px' }}>
        <ChatMessage
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          datetime="今天16:38"
          name="TDesignAI"
          role="user"
          {...message}
          {...changedProps}
        />
        <ChatMessage
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          datetime="今天16:38"
          name="TDesignAI"
          role="assistant"
          status="pending"
          {...changedProps}
        />
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
