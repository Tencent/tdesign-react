import React, { useState } from 'react';
import { Space, Switch, ChatMessage, ChatMarkdown } from 'tdesign-react';
import mdContent from './mock.md?raw';

const MarkdownExample = () => {
  const [hasCode, setHasCode] = useState(false);
  const [hasKatex, setHasKatex] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(1);

  // 切换代码块插件
  const handleCodeChange = (checked: boolean) => {
    setHasCode(checked);
    setRerenderKey((prev) => prev + 1);
  };

  // 切换公式插件
  const handleKatexChange = (checked: boolean) => {
    setHasKatex(checked);
    setRerenderKey((prev) => prev + 1);
  };

  return (
    <Space>
      {/* 通过key强制重新挂载组件 */}
      <ChatMarkdown
        key={rerenderKey}
        content={mdContent}
        pluginConfig={[
          {
            preset: 'code',
            enabled: hasCode,
          },
          {
            preset: 'katex',
            enabled: hasKatex,
          },
        ]}
        options={{
          html: true,
          breaks: true,
          typographer: true,
        }}
      />
      <Space direction="vertical">
        <div style={{ width: '100px' }}>动态加载插件</div>
        <Space align="center">
          <span>代码块</span>
          <Switch size="large" value={hasCode} onChange={handleCodeChange} />
        </Space>
        <Space align="center">
          <span>公式</span>
          <Switch size="large" value={hasKatex} onChange={handleKatexChange} />
        </Space>
      </Space>
    </Space>
  );
};

export default MarkdownExample;
