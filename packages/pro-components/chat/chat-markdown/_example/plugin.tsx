import React, { useState } from 'react';
import { Space, Switch } from 'tdesign-react';
import { ChatMarkdown } from '@tdesign-react/aigc';
import mdContent from './mock.md?raw';
// 公式能力引入，可参考cherryMarkdown示例
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

const MarkdownExample = () => {
  const [hasKatex, setHasKatex] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(1);

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
        options={{
          engine: {
            syntax: hasKatex
              ? {
                  mathBlock: {
                    engine: 'katex',
                  },
                  inlineMath: {
                    engine: 'katex',
                  },
                }
              : undefined,
          },
        }}
      />
      <Space direction="vertical">
        <div style={{ width: '100px' }}>动态加载插件</div>
        <Space align="center">
          <span>公式</span>
          <Switch size="large" value={hasKatex} onChange={handleKatexChange} />
        </Space>
      </Space>
    </Space>
  );
};

export default MarkdownExample;
