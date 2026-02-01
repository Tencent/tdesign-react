import React, { useState } from 'react';
import { MessagePlugin, Space } from 'tdesign-react';
import { ChatActionBar } from '@tdesign-react/chat';
import type { ChatActionBarAction } from '@tdesign-react/chat';
import { HeartFilledIcon, HeartIcon } from 'tdesign-icons-react';

const ChatActionBarExample = () => {
  const [isCustomActionActive, setIsCustomActionActive] = useState(false);

  const onActions = (name, data) => {
    console.log('触发自定义事件：', name, data);
  };

  const handleHeartClick = () => {
    setIsCustomActionActive((prev) => !prev);
    MessagePlugin.success(isCustomActionActive ? '取消' : '点赞');
    console.log('自定义按钮状态:', isCustomActionActive ? '取消' : '点赞');
  };

  const customIconActions: ChatActionBarAction[] = [
    // ChatActionBar提供的预设项
    'good',
    'share',

    // 自定项：可传自定义icon、通过onClick定义事件回调
    isCustomActionActive ? (
      <HeartFilledIcon
        size="16px"
        color="var(--td-brand-color)"
        onClick={handleHeartClick}
        key="custom-heart-icon-active"
      />
    ) : (
      <HeartIcon size="16px" onClick={handleHeartClick} key="custom-heart-icon-inactive" />
    ),
  ];

  return (
    <Space>
      <ChatActionBar actionBar={customIconActions} handleAction={onActions} />
    </Space>
  );
};

export default ChatActionBarExample;
