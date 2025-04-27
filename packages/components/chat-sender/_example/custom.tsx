import React, { useRef, useState } from 'react';
import { EnterIcon, InternetIcon, AttachIcon } from 'tdesign-icons-react';
import { ChatSender, Space, Button, Tag } from 'tdesign-react';

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('输入内容');
  const [loading, setLoading] = useState(false);
  const senderRef = useRef(null);

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

  const onAttachClick = () => {
    // senderRef.current?.focus();
    senderRef.current?.selectFile();
  };

  const onFileSelect = (e: CustomEvent<File[]>) => {
    console.log('===selectfile', e.detail);
  };

  return (
    <ChatSender
      ref={senderRef}
      value={inputValue}
      placeholder="请输入问题，Enter发送"
      loading={loading}
      autosize={{ minRows: 2 }}
      onChange={handleChange}
      onSend={handleSend}
      onStop={handleStop}
      onFileSelect={onFileSelect}
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
      {/* 自定义输入框底部区域slot，可以增加模型选项 */}
      <div slot="footer-left">
        <Space align="center" size={'small'}>
          <Button shape="round" variant="outline" size="small" icon={<AttachIcon />} onClick={onAttachClick} />
          <Button variant="outline" shape="round" size="small">
            R1.深度思考
          </Button>
          <Button variant="outline" icon={<InternetIcon />} size="small" shape="round">
            联网查询
          </Button>
        </Space>
      </div>
      {/* 自定义输入框左侧区域slot，实现触发附件上传 */}
      <div slot="prefix">
        <Tag shape="round" variant="light" color="#0052D9" style={{ marginRight: 4 }} onClick={onAttachClick}>
          AI编程
        </Tag>
      </div>
    </ChatSender>
  );
};

export default ChatSenderExample;
