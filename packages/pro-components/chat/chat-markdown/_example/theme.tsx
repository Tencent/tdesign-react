import React, { useState } from 'react';
import { Space, Switch } from 'tdesign-react';
import { ChatMarkdown } from '@tdesign-react/chat';
// 公式能力引入，可参考cherryMarkdown示例
import 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';

const mdContent = `
---

## 代码块主题设置演示

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 输出: 55
\`\`\`

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`
`;

const MarkdownExample = () => {
  const [codeBlockTheme, setCodeBlockTheme] = useState<'light' | 'dark'>('light');
  const [rerenderKey, setRerenderKey] = useState(1);

  // 切换代码块主题
  const handleCodeThemeChange = (checked: boolean) => {
    setCodeBlockTheme(checked ? 'dark' : 'light');
    setRerenderKey((prev) => prev + 1);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Space align="center">
          <span>代码块主题切换：</span>
          <Switch size="large" value={codeBlockTheme === 'dark'} onChange={handleCodeThemeChange} />
        </Space>
      </Space>
      {/* 通过key强制重新挂载组件 */}
      <ChatMarkdown
        key={rerenderKey}
        content={mdContent}
        options={{
          themeSettings: {
            // 代码块主题设置, 默认是'light'
            codeBlockTheme,
          },
        }}
      />
    </Space>
  );
};

export default MarkdownExample;
