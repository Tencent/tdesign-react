import React from 'react';
import { MessagePlugin, Space } from 'tdesign-react';
import { ChatActionBar } from '@tdesign-react/chat';
import { HeartIcon } from 'tdesign-icons-react';

const ChatActionBarExample = () => {
  const onActions = (name, data) => {
    console.log('消息事件触发：', name, data);
  };

  const customIconActions = [
    // 预设项
    'good',

    // 自定项，可传自定义icon图标，也可以通过onClick覆盖onAction的事件回调
    <HeartIcon size="16px" onClick={() => MessagePlugin.success('点赞')} key="custom-icon" />,
  ];

  return (
    <Space>
      <ChatActionBar comment="good" copyText="这是一段文字" handleAction={onActions} />
      <ChatActionBar actionBar={customIconActions} handleAction={onActions} />
    </Space>
  );
};

export default ChatActionBarExample;
