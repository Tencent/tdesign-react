import React from 'react';
import { MessagePlugin, Space, Button } from 'tdesign-react';
import { ChatActionBar } from '@tdesign-react/chat';
import { HeartIcon, UserIcon } from 'tdesign-icons-react';

const ChatActionBarExample = () => {
  const onActions = (name, data) => {
    console.log('消息事件触发：', name, data);
  };

  const customActions = [
    // 1. 使用 ChatActionBar 提供的预设项
    'good',
    'bad',

    // 2. 通过直接传入 React Element 来自定义 icon 图标：
    <HeartIcon key="heart" size="16px" onClick={() => MessagePlugin.success('点击了喜欢')} />,

    // 3. 自定义带文本的按钮样式
    <div
      key="text-btn"
      style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}
      onClick={() => MessagePlugin.info('前往用户界面')}
    >
      <UserIcon size="16px" />
      <span style={{ marginLeft: 4 }}>用户</span>
    </div>,

    // 4. 通过添加 ignoreWrapper 属性，来完全自定义样式的按钮（不继承默认样式）
    <Button
      key="custom-btn"
      size="small"
      variant="text"
      // @ts-ignore
      ignoreWrapper
      onClick={() => MessagePlugin.info('自定义按钮的样式')}
    >
      自定义按钮的样式
    </Button>,
  ];

  return (
    <Space>
      <ChatActionBar actionBar={customActions} handleAction={onActions} />
    </Space>
  );
};

export default ChatActionBarExample;
