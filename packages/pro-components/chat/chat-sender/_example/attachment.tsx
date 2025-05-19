import React, { useState } from 'react';
import type { UploadFile } from 'tdesign-react';
import { ChatSender, TdAttachmentItem } from '@tdesign-react/aigc';

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('输入内容');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<TdAttachmentItem[]>([
    {
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      name: 'word-file.docx',
      size: 222222,
    },
    {
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
  ]);

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

  const onAttachmentsRemove = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onAttachmentsRemove', e);
    setFiles(e.detail);
  };

  const onAttachmentsSelect = (e: CustomEvent<File[]>) => {
    // 添加新文件并模拟上传进度
    const newFile = {
      ...e.detail[0],
      size: e.detail[0].size,
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
                description: `${Math.floor(newFile.size / 1024)}KB`,
              }
            : file,
        ),
      );
    }, 1000);
  };

  return (
    <ChatSender
      value={inputValue}
      placeholder="请输入内容"
      loading={loading}
      actions={['attachment', 'send']}
      attachmentsProps={{
        items: files,
        overflow: 'scrollX',
      }}
      onFileSelect={onAttachmentsSelect}
      onFileRemove={onAttachmentsRemove}
      onChange={handleChange}
      onSend={handleSend}
      onStop={handleStop}
    />
  );
};

export default ChatSenderExample;
