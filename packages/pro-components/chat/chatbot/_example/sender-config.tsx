import React, { useRef, useState } from 'react';
import {
  ChatBot,
  SSEChunkData,
  AIMessageContent,
  ChatServiceConfig,
  type TdChatbotApi,
  type TdAttachmentItem,
  type TdChatSenderActionName,
} from '@tdesign-react/chat';
import { MessagePlugin, Button, Space } from 'tdesign-react';
import type { UploadFile } from 'tdesign-react';

/**
 * 输入配置示例
 * 
 * 本示例展示如何通过 senderProps 配置输入框的基础行为。
 * senderProps 会透传给内部的 ChatSender 组件，用于控制输入框的功能和交互。
 * 
 * 配置内容包括：
 * - 输入框基础配置（占位符、自动高度等）
 * - 附件上传配置（文件类型、附件展示等）
 * - 输入事件回调（输入、聚焦、失焦等）
 * 
 * 学习目标：
 * - 掌握 senderProps 的常用配置项
 * - 了解如何处理附件上传
 * - 学会处理输入事件
 * 
 * 相关文档：
 * - ChatSender 组件详细文档：https://tdesign.tencent.com/react-aigc/components/chat-sender
 */
export default function SenderConfig() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [files, setFiles] = useState<TdAttachmentItem[]>([]);

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
    stream: true,
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      return {
        type: 'markdown',
        data: rest?.msg || '',
      };
    },
  };

  // 输入框配置
  const senderProps = {
    // 基础配置
    placeholder: '请输入您的问题...（支持 Shift+Enter 换行）',
    // 输入框配置，透传Textarea组件的属性
    textareaProps: {
      maxlength: 10,
    },
    // 操作按钮
    actions: ['attachment', 'send'] as TdChatSenderActionName[], // 显示附件按钮和发送按钮
    // 附件配置
    attachmentsProps: {
      items: files, // 附件列表
      overflow: 'scrollX', // 附件溢出时横向滚动
    },
    // 上传配置
    uploadProps: {
      accept: '.pdf,.docx,.txt,.md', // 允许的文件类型
    },
    // 事件回调
    onChange: (e: CustomEvent<string>) => {
      console.log('输入内容:', e.detail);
    },
    onFocus: (e: CustomEvent<string>) => {
      console.log('输入框获得焦点');
    },
    onBlur: (e: CustomEvent<string>) => {
      console.log('输入框失去焦点');
    },
    onFileSelect: (e: CustomEvent<File[]>) => {
      console.log('选择文件:', e.detail);
      // 添加新文件并模拟上传进度
      const newFile: TdAttachmentItem = {
        name: e.detail[0].name,
        size: e.detail[0].size,
        status: 'progress' as UploadFile['status'],
        description: '上传中',
      };

      setFiles((prev) => [newFile, ...prev]);
      
      // 模拟上传完成
      setTimeout(() => {
        setFiles((prevState) =>
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
        MessagePlugin.success(`文件 ${newFile.name} 上传成功`);
      }, 1000);
    },
    onFileRemove: (e: CustomEvent<TdAttachmentItem[]>) => {
      console.log('移除文件后的列表:', e.detail);
      setFiles(e.detail);
      MessagePlugin.info('文件已移除');
    },
  };

  // 快捷指令列表
  const quickPrompts = [
    '介绍一下 TDesign',
    '如何使用 Chatbot 组件？',
    '有哪些内容类型？',
    '如何自定义样式？',
  ];

  return (
    <div>
      {/* 快捷指令区域 */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>快捷指令：</div>
        <Space size="small" breakLine>
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              size="small"
              variant="outline"
              onClick={() => {
                chatRef.current?.addPrompt(prompt);
              }}
            >
              {prompt}
            </Button>
          ))}
        </Space>
      </div>

      {/* 聊天组件 */}
      <div style={{ height: '400px' }}>
        <ChatBot ref={chatRef} senderProps={senderProps} chatServiceConfig={chatServiceConfig} />
      </div>
    </div>
  );
}
