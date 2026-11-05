import React, { useState } from 'react';
import { ChatActionBar } from '@tdesign-react/chat';

const ActionBarExample = () => {
  const [comment, setComment] = useState<string>('');

  const handleActions = (name, data) => {
    console.log(name, data);
    setComment(name);
  };

  return (
    <ChatActionBar
      comment={comment}
      copyText="它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。"
      actionBar={['replay', 'copy', 'good', 'bad', 'share']}
      handleAction={handleActions}
    />
  );
};

export default ActionBarExample;
