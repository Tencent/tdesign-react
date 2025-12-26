import React from 'react';
import { Space } from 'tdesign-react';
import { ChatActionBar } from '@tdesign-react/chat';
import { useDynamicStyle } from '../../_util/useDynamicStyle';

const ChatActionBarExample = () => {
  const barRef = React.useRef(null);

  // 这里是为了演示样式修改不影响其他Demo，实际项目中直接设置css变量到:root即可
  useDynamicStyle(barRef, {
    '--td-chat-item-actions-list-border': 'none',
    '--td-chat-item-actions-list-bg': 'none',
    '--td-chat-item-actions-item-hover-bg': '#f3f3f3',
  });

  const onActions = (name, data) => {
    console.log('消息事件触发：', name, data);
  };

  return (
    <Space>
      <ChatActionBar
        ref={barRef}
        comment="good"
        copyText="这是一段文字"
        handleAction={onActions}
        tooltipProps={{
          theme: 'light',
          showArrow: false,
        }}
      ></ChatActionBar>
    </Space>
  );
};

export default ChatActionBarExample;
