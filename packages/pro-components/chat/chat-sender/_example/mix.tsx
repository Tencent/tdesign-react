import React, { useState } from 'react';
import { CloseIcon, EnterIcon, SystemSumIcon } from 'tdesign-icons-react';
import { Button, Select, Tooltip } from 'tdesign-react';
import { ChatSender } from '@tdesign-react/chat';

import type { TdAttachmentItem } from '@tdesign-react/chat';

const selectOptions = [
  {
    label: '默认模型',
    value: 'default',
  },
  {
    label: 'Deepseek',
    value: 'deepseek-r1',
  },
  {
    label: '混元',
    value: 'hunyuan',
  },
];

const MixExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('default');
  const [isChecked, setIsChecked] = useState(false);
  const [showRef, setShowRef] = useState(true);
  const [filesList, setFilesList] = useState<TdAttachmentItem[]>([
    {
      key: '1',
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      key: '2',
      name: 'word-file.docx',
      size: 222222,
    },
    {
      key: '3',
      name: 'image-file.png',
      size: 333333,
    },
    {
      key: '4',
      name: 'pdf-file.pdf',
      size: 444444,
    },
  ]);

  const handleChange = (e) => {
    console.log('onChange', e.detail);
    setInputValue(e.detail);
  };

  // 模拟消息发送
  const handleSend = () => {
    if (loading) return;
    if (!inputValue) return;
    setInputValue('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const checkClick = () => {
    setIsChecked(!isChecked);
  };

  const onRemoveRef = () => {
    setShowRef(false);
  };

  const handleRemoveFile = (e: CustomEvent<TdAttachmentItem[]>) => {
    setFilesList(e.detail);
  };

  const handleUploadFile = (e: CustomEvent<TdAttachmentItem[]>) => {
    console.log('onFileSelect', e.detail);
    // 添加新文件并模拟上传进度
    const newFile = {
      ...e.detail[0],
      size: e.detail[0].size,
      name: e.detail[0].name,
      status: 'progress' as TdAttachmentItem['status'],
      description: '上传中',
    };

    setFilesList((prev) => [newFile, ...prev]);
    setTimeout(() => {
      setFilesList((prevState) =>
        prevState.map((file) =>
          file.name === newFile.name
            ? {
                ...file,
                url: 'https://tdesign.gtimg.com/site/avatar.jpg',
                status: 'success',
                description: `${Math.floor((newFile?.size || 0) / 1024)}KB`,
              }
            : file,
        ),
      );
    }, 1000);
  };

  return (
    <ChatSender
      value={inputValue}
      placeholder="请输入消息..."
      loading={loading}
      attachmentsProps={{
        items: filesList,
        overflow: 'scrollX',
      }}
      // 基于预设按钮自定义操作区
      actions={(preset) => preset.filter((item) => item.name === 'uploadImage' || item.name === 'uploadAttachment')}
      onChange={handleChange}
      onSend={handleSend}
      onFileSelect={handleUploadFile}
      onFileRemove={handleRemoveFile}
      // 自定义输入框上方区域，可用来引用内容或提示场景
      innerHeader={
        showRef ? (
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginBottom: 8,
              paddingBottom: 8,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--td-component-stroke)',
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <EnterIcon
                size="20px"
                style={{
                  color: 'var(--td-text-color-disabled)',
                  transform: 'scaleX(-1)',
                  padding: 6,
                }}
              />
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--td-text-color-placeholder)',
                  marginLeft: 4,
                  margin: 0,
                }}
              >
                “牛顿第一定律（惯性定律）仅适用于惯性参考系，而不适用于非惯性参考系。”
              </p>
            </div>
            <CloseIcon
              size="20px"
              style={{
                color: 'var(--td-text-color-disabled)',
                padding: 6,
                cursor: 'pointer',
              }}
              onClick={onRemoveRef}
            />
          </div>
        ) : null
      }
      // 自定义输入框底部区域，可以增加模型选项
      footerPrefix={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip content="切换模型">
            <Select
              value={selectValue}
              options={selectOptions}
              style={{
                width: 112,
                height: 'var(--td-comp-size-m)',
                marginRight: 8,
              }}
              onChange={(value) => setSelectValue(String(value))}
            />
          </Tooltip>
          <Button
            variant="outline"
            style={{
              width: 112,
              height: 'var(--td-comp-size-m)',
              borderRadius: 32,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(isChecked
                ? {
                    borderColor: 'var(--td-brand-color-focus)',
                    background: 'var(--td-brand-color-light)',
                    color: 'var(--td-text-color-brand)',
                  }
                : {}),
            }}
            onClick={checkClick}
          >
            <SystemSumIcon />
            <span style={{ marginLeft: 4 }}>深度思考</span>
          </Button>
        </div>
      }
    />
  );
};

export default MixExample;
