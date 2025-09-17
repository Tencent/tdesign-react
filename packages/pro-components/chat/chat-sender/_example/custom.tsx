import { TdAttachmentItem } from 'tdesign-web-components';
import React, { useRef, useState, useEffect } from 'react';
import { EnterIcon, InternetIcon, AttachIcon, CloseIcon, ArrowUpIcon, StopIcon } from 'tdesign-icons-react';
import { ChatSender } from '@tdesign-react/chat';
import { Space, Button, Tag, Dropdown, Tooltip, UploadFile } from 'tdesign-react';
import { useDynamicStyle } from '../../_util/useDynamicStyle';

const options = [
  {
    content: '帮我写作',
    value: 1,
    placeholder: '输入你要撰写的主题',
  },
  {
    content: '图像生成',
    value: 2,
    placeholder: '说说你的创作灵感',
  },
  {
    content: '网页摘要',
    value: 3,
    placeholder: '输入你要解读的网页地址',
  },
];

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const senderRef = useRef(null);
  const [files, setFiles] = useState<TdAttachmentItem[]>([]);
  const [scene, setScene] = useState(1);
  const [showRef, setShowRef] = useState(true);
  const [activeR1, setR1Active] = useState(false);
  const [activeSearch, setSearchActive] = useState(false);

  // 这里是为了演示样式修改不影响其他Demo，实际项目中直接设置css变量到:root即可
  useDynamicStyle(senderRef, {
    '--td-text-color-placeholder': '#DFE2E7',
    '--td-chat-input-radius': '6px',
  });

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
    setFiles([]);
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
    // 添加新文件并模拟上传进度
    const newFile = {
      ...e.detail[0],
      name: e.detail[0].name,
      status: 'progress' as UploadFile['status'],
      description: '上传中',
    };

    setFiles((prev) => [newFile, ...prev]);

    setTimeout(() => {
      setFiles((prevState) =>
        prevState.map((file) =>
          file.name === newFile.name
            ? {
                ...file,
                url: 'https://tdesign.gtimg.com/site/avatar.jpg',
                status: 'success',
              }
            : file,
        ),
      );
    }, 1000);
  };

  const switchScene = (data) => {
    setScene(data.value);
  };

  const onRemoveRef = () => {
    setShowRef(false);
  };

  const onAttachmentsRemove = (e: CustomEvent<TdAttachmentItem[]>) => {
    setFiles(e.detail);
  };

  return (
    <ChatSender
      ref={senderRef}
      value={inputValue}
      placeholder={options.filter((item) => item.value === scene)[0].placeholder}
      loading={loading}
      autosize={{ minRows: 2 }}
      onChange={handleChange}
      onSend={handleSend}
      onStop={handleStop}
      onFileSelect={onFileSelect}
      onFileRemove={onAttachmentsRemove}
      uploadProps={{
        accept: 'image/*',
      }}
      attachmentsProps={{
        items: files,
      }}
    >
      {/* 自定义输入框上方区域，可用来引用内容或提示场景 */}
      {showRef && (
        <div slot="inner-header">
          <Space
            style={{
              width: '100%',
              marginBottom: '12px',
              padding: '4px 6px',
              background: '#f3f3f3',
              borderRadius: 4,
              boxSizing: 'border-box',
              justifyContent: 'space-between',
            }}
          >
            <Space size="small">
              <EnterIcon size="14px" style={{ color: 'rgba(0, 0, 0, 0.26)' }} />
              <span style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.4)' }}>引用一段文字</span>
            </Space>
            <div style={{ marginLeft: 'auto', width: '16px' }} onClick={onRemoveRef}>
              <CloseIcon size="14px" style={{ color: 'rgba(0, 0, 0, 0.26)' }} />
            </div>
          </Space>
        </div>
      )}
      {/* 自定义输入框底部区域slot，可以增加模型选项 */}
      <div slot="footer-prefix">
        <Space align="center" size={'small'}>
          <Tooltip content="只支持上传图片，总大小不超过20M">
            <Button shape="round" variant="outline" size="small" icon={<AttachIcon />} onClick={onAttachClick} />
          </Tooltip>
          <Button
            variant="outline"
            shape="round"
            theme={activeR1 ? 'primary' : 'default'}
            size="small"
            onClick={() => setR1Active(!activeR1)}
          >
            R1.深度思考
          </Button>
          <Button
            variant="outline"
            theme={activeSearch ? 'primary' : 'default'}
            icon={<InternetIcon />}
            size="small"
            shape="round"
            onClick={() => setSearchActive(!activeSearch)}
          >
            联网查询
          </Button>
        </Space>
      </div>
      {/* 自定义输入框左侧区域slot，可以用来触发工具场景切换 */}
      <div slot="input-prefix">
        <Dropdown options={options} onClick={switchScene} trigger="click" style={{ padding: 0 }}>
          <Tag shape="round" variant="light" color="#0052D9" style={{ marginRight: 4, cursor: 'pointer' }}>
            {options.filter((item) => item.value === scene)[0].content}
          </Tag>
        </Dropdown>
      </div>
      {/* 自定义提交区域slot */}
      <div slot="actions">
        {!loading ? (
          <Button
            shape="circle"
            disabled={inputValue === ''}
            icon={<ArrowUpIcon size={24} />}
            onClick={handleSend}
            style={{ opacity: inputValue ? '1' : '0.5' }}
          ></Button>
        ) : (
          <Button shape="circle" icon={<StopIcon size={32} />} onClick={handleStop}></Button>
        )}
      </div>
    </ChatSender>
  );
};

export default ChatSenderExample;
