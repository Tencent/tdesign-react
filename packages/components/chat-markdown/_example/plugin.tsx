import { useState } from 'react';
import { Space, Switch, ChatMessage } from 'tdesign-react';
import mdContent from './mock.md?raw';

const MarkdownExample = () => {
  const [hasCode, setHasCode] = useState(false);
  const [hasKatex, setHasKatex] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(1);

  // 聊天项配置
  const itemProps = {
    variant: 'outline' as const,
    placement: 'left' as const,
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    actions: true,
    message: {
      id: '123',
      content: [
        {
          type: 'markdown' as const,
          data: mdContent,
        },
      ],
      status: 'complete' as const,
      role: 'assistant' as const,
    },
    chatContentProps: {
      markdown: {
        options: {
          html: true,
          breaks: true,
          typographer: true,
        },
        pluginConfig: [
          {
            preset: 'code',
            enabled: hasCode,
          },
          {
            preset: 'katex',
            enabled: hasKatex,
          },
        ],
      },
    },
  };

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
      <ChatMessage key={rerenderKey} {...itemProps} />
      <Space direction="vertical">
        <div style={{ width: '100px' }}>插件配置</div>
        <Space align="center">
          <span>代码块</span>
          <Switch size="large" checked={hasCode} onChange={handleCodeChange} />
        </Space>
        <Space align="center">
          <span>公式</span>
          <Switch size="large" checked={hasKatex} onChange={handleKatexChange} />
        </Space>
      </Space>
    </Space>
  );
};

export default MarkdownExample;
