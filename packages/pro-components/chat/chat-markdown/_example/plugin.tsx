import React, { useState } from 'react';
import { Space, Switch } from 'tdesign-react';
import { ChatMarkdown } from '@tdesign-react/aigc';
// 公式能力引入，可参考cherryMarkdown示例
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

const mdContent = `
---

## 块级公式

$$
E=mc^2
$$

## 行内公式
这是一个行内公式 $\\sqrt{3x-1}+(1+x)^2$
`;

const MarkdownExample = () => {
  const [hasKatex, setHasKatex] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(1);

  // 切换公式插件
  const handleKatexChange = (checked: boolean) => {
    setHasKatex(checked);
    setRerenderKey((prev) => prev + 1);
  };

  return (
    <Space direction="vertical">
      <Space>
        <strong>动态加载插件：</strong>
        <Space align="center">
          <span>公式</span>
          <Switch size="large" value={hasKatex} onChange={handleKatexChange} />
        </Space>
      </Space>
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
    </Space>
  );
};

export default MarkdownExample;
