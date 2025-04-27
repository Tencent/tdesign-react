import React, { useState } from 'react';
import { EnterIcon, InternetIcon } from 'tdesign-icons-react';
import { ChatSender, Space, Button } from 'tdesign-react';

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('输入内容');
  const [loading, setLoading] = useState(false);

  // 输入变化处理
  const handleChange = (e) => {
    console.log('onChange', e.detail);
    setInputValue(e.detail);
  };

  // 发送处理
  const handleSend = () => {
    console.log('提交', { value: inputValue });
    setInputValue('');
    setLoading(true);
  };

  // 停止处理
  const handleStop = () => {
    console.log('停止');
    setLoading(false);
  };

  return (
    <ChatSender
      value={inputValue}
      placeholder="请输入内容"
      loading={loading}
      autosize={{ minRows: 2 }}
      onChange={handleChange}
      onSend={handleSend}
      onStop={handleStop}
    >
      {/* 自定义输入框上方区域，可用来引用内容或提示场景 */}
      <div slot="inner-header">
        <Space
          style={{
            width: '100%',
            marginBottom: '12px',
            padding: '4px 6px',
            background: '#f3f3f3',
            borderRadius: 4,
            boxSizing: 'border-box',
          }}
        >
          <Space align="start" size={'small'}>
            <EnterIcon size="14px" style={{ color: 'rgba(0, 0, 0, 0.26)' }} />
            <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.4)' }}>引用一段文字</span>
          </Space>
        </Space>
      </div>
      <div slot="footer-left">
        <Space align="center" size={'small'}>
          <Button variant="outline" shape="round">
            R1.深度思考
          </Button>
          <Button variant="outline" icon={<InternetIcon />} shape="round">
            联网查询
          </Button>
        </Space>
      </div>
    </ChatSender>
  );
};

export default ChatSenderExample;
