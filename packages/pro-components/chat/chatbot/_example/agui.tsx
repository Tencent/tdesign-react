import React from 'react';
import { ChatBot, ChatServiceConfig } from '@tdesign-react/chat';

/**
 * AG-UI 协议示例
 * 
 * 本示例展示如何使用 AG-UI 协议快速接入聊天服务。
 * AG-UI 是一种标准化的 AI 对话协议，当后端服务符合该协议时，
 * 前端无需编写 onMessage 进行数据转换，大大简化了接入流程。
 * 可以通过查看网络输出的数据流来了解协议格式。
 * 
 * 对比说明：
 * - 自定义协议：需要配置 onMessage 进行数据转换（参考 service-config 示例）
 * - AG-UI 协议：只需设置 protocol: 'agui'，无需 onMessage
 */
export default function AguiProtocol() {
  // AG-UI 协议配置（最简化）
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-simple',
    // 开启流式传输
    stream: true,
    // 使用 AG-UI 协议（无需 onMessage）
    protocol: 'agui',
  };

  return (
    <div style={{ maxHeight: '400px' }}>
      <ChatBot chatServiceConfig={chatServiceConfig} />
    </div>
  );
}
