---
title: 核心功能特性
order: 2
group:
  title: 概述
  order: 1
description: TDesign Chat 智能对话组件库核心功能特性详解
spline: ai
---

# TDesign Chat 核心功能特性

## 引言

TDesign Chat 是专为 AI 应用场景设计的智能对话组件库。此次更新涵盖多个平台：React 版本正式发布，Vue3 版本完成重大升级，微信小程序版本首次推出。组件库支持桌面端和移动端场景，可满足从快速原型开发到复杂企业级 AI 应用的不同需求。

## 桌面端：功能完备的 AI 应用开发方案

### 核心功能特性升级

TDesign Chat Web 端完成了架构层面的全面重构。相比之前仅支持 Vue 框架的原子化 UI 渲染组件，新版本在以下方面实现了显著提升：

**架构层面：**
- 基于 Web Components 标准重构底层 UI 层，实现对 React、Vue 等主流框架的统一支持
- 抽象出独立的 ChatEngine 对话引擎，实现业务逻辑与 UI 框架解耦，提升代码复用性
- 集成完整对话逻辑，适配业界 AG-UI 协议标准

**使用模式：**
- 保留原子化组件的灵活性，新增高度封装的 ChatBot 一体化组件
- 提供标准集成模式（快速接入）和组合式模式（深度定制）两种开发方式
- 简化接入流程，从手动组装多个原子组件优化为三行代码即可完成基础集成

新版本通过以下四个方面的核心特性，为开发者提供从快速集成到深度定制的完整能力支持：

## 开箱即用的 ChatBot 组件

TDesign Chat 提供了高度封装的 `ChatBot` 一体化组件，让您无需关注复杂的实现细节，即可快速构建专业级AI聊天应用。

### 零配置快速启动

只需三行核心代码，即可拥有功能完整的智能对话界面：

```jsx
import { ChatBot } from '@tdesign-react/chat';

const chatServiceConfig = {
  endpoint: 'https://your-ai-service.com/chat',
  stream: true,
};

export default () => <ChatBot chatServiceConfig={chatServiceConfig} />;
```

**开箱即得的完整能力：**

- ✅ **消息收发管理**：自动处理用户输入、消息发送、AI响应接收的完整流程
- ✅ **流式打字效果**：内置SSE流式传输支持，实现逐字显示的流畅体验
- ✅ **智能状态控制**：自动管理加载、流式传输、错误等各种状态
- ✅ **消息历史管理**：支持消息历史记录、回填、持久化
- ✅ **自动滚动定位**：智能滚动到最新消息，优化长对话阅读体验
- ✅ **附件上传支持**：内置文件、图片等附件上传和预览能力
- ✅ **响应式布局**：自适应各种屏幕尺寸，移动端友好

### 丰富的内置消息类型

ChatBot 内置了多种常见的AI交互消息类型，无需额外开发即可使用：

| 消息类型 | 说明 | 适用场景 |
|---------|------|---------|
| **Markdown文本** | 支持富文本、代码高亮、表格等 | 通用文本回复 |
| **思考过程** | 展示AI推理过程 | 增强可解释性 |
| **建议问题** | 推荐相关问题引导对话 | 提升用户体验 |
| **搜索内容** | 展示搜索结果和引用来源 | RAG检索增强 |
| **附件消息** | 文件、图片等附件展示 | 多模态交互 |
| **工具调用** | 展示工具调用过程和结果 | Agent工具链 |

### 极简集成体验

相比传统方案需要自行实现消息管理、UI渲染、状态控制等复杂逻辑，ChatBot 将这些能力全部内置，让您专注于业务逻辑本身：

```jsx
// 传统方案：需要自行管理状态、消息、UI等
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const handleSend = async (text) => {
  setLoading(true);
  // 手动处理消息添加、请求发送、响应解析...
};
// 还需要实现消息列表、输入框、加载状态等UI组件...

// TDesign Chat：一行代码搞定
<ChatBot chatServiceConfig={config} />
```

---

## 高度可定制化能力

在提供开箱即用便利性的同时，TDesign Chat 也为深度定制场景提供了完整的扩展能力。

### 丰富的插槽机制

ChatBot 预留了多个关键位置的插槽，支持灵活注入自定义内容：

```jsx
<ChatBot
  chatServiceConfig={config}
  // 头部插槽：添加标题、操作按钮等
  headerSlot={<CustomHeader />}
  // 消息插槽：自定义消息渲染
  messageSlot={(message) => <CustomMessage message={message} />}
  // 输入框插槽：扩展输入能力
  senderSlot={<CustomSender />}
  // 底部插槽：添加免责声明、反馈等
  footerSlot={<CustomFooter />}
/>
```

**核心插槽位置：**

- **headerSlot**：聊天界面顶部，适合放置标题、清空对话、设置等功能
- **messageSlot**：消息渲染区域，可完全自定义消息展示样式和交互
- **senderSlot**：输入发送区域，可扩展语音输入、快捷指令等能力
- **footerSlot**：界面底部，适合放置免责声明、反馈入口等信息
- **emptySlot**：空状态展示，可自定义欢迎语、引导信息等

### 组合式开发模式（React 框架内）

当需要在 React 项目中自定义 UI 布局结构时，可以使用组合式开发模式。通过 `useChat` Hook 获取对话引擎实例和实时消息数据，自由组合内置的独立 UI 组件或完全自定义渲染：

```jsx
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';

function CustomChatUI() {
  // useChat Hook 返回对话引擎实例和响应式消息数据
  const { chatEngine, messages, status } = useChat({
    chatServiceConfig: { endpoint: '/api/chat', stream: true },
  });

  return (
    <div className="my-custom-layout">
      {/* 自定义头部 */}
      <MyHeader onClear={() => chatEngine.clearMessages()} />
      
      {/* 消息列表 - 可使用内置组件或完全自定义 */}
      <ChatList>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </ChatList>
      
      {/* 自定义侧边栏 */}
      <MySidebar messages={messages} />
      
      {/* 输入区域 */}
      <ChatSender
        loading={status === 'streaming'}
        onSend={(e) => chatEngine.sendUserMessage({ 
          params: { prompt: e.detail.value } 
        })}
      />
    </div>
  );
}
```

**适用场景：**
- 在 React 项目中需要自定义整体布局结构
- 需要在聊天界面中集成其他业务组件（如侧边栏、工具栏等）
- 希望复用内置 UI 组件但调整组合方式

### ChatEngine SDK 逻辑层复用（跨框架场景）

`ChatEngine` 是独立于 UI 框架的纯 JavaScript 对话引擎，封装了完整的对话管理逻辑。它可以脱离 React 组件独立使用，适合跨框架集成或完全自定义 UI 的场景：

```jsx
import { ChatEngine } from '@tdesign-react/chat';

// 创建对话引擎实例
const chatEngine = new ChatEngine({
  endpoint: '/api/chat',
  stream: true,
  protocol: 'agui',
});

// 监听消息更新
chatEngine.on('messagesUpdate', (messages) => {
  console.log('消息更新:', messages);
  // 使用任意UI框架渲染消息
});

// 发送消息
await chatEngine.sendUserMessage({
  params: { prompt: '你好' },
  content: [{ type: 'text', data: '你好' }],
});

// 中止对话
chatEngine.abortChat();

// 清空消息
chatEngine.clearMessages();
```

**ChatEngine 核心能力：**

- **消息状态管理**：自动维护消息列表、状态变更
- **流式数据处理**：内置 SSE/Fetch 流式解析
- **协议适配转换**：支持自定义协议和 AG-UI 标准协议
- **事件驱动架构**：通过事件监听实现 UI 与逻辑解耦
- **请求生命周期管理**：自动处理请求、重试、中止等

**适用场景：**
- 在 Vue、Angular 等非 React 框架中复用对话逻辑
- 使用其他 UI 库（如 Ant Design、Element Plus）实现完全自定义的界面
- 将对话能力集成到现有复杂业务系统中
- 在 Node.js 服务端或 Electron 等环境中使用对话能力

---

### 三种定制模式对比

| 定制模式 | 使用方式 | 框架依赖 | 定制程度 | 适用场景 |
|---------|---------|---------|---------|---------|
| **插槽定制** | ChatBot + 插槽 | React | 低 | 在标准界面基础上局部定制 |
| **组合式开发** | useChat + 组件组合 | React | 中 | React 项目中自定义布局结构 |
| **ChatEngine SDK** | 纯 JS 引擎 | 无 | 高 | 跨框架、完全自定义 UI、服务端 |

---

## 基于 Cherry Markdown 渲染引擎

TDesign Chat 内置集成了腾讯开源的 [Cherry Markdown](https://github.com/Tencent/cherry-markdown) 作为核心渲染引擎，为AI生成内容提供强大的富文本展示能力。

### 为什么选择 Cherry Markdown

Cherry Markdown 是专为现代Web应用设计的高性能Markdown编辑器和渲染引擎，具有以下优势：

- **🚀 高性能渲染**：采用增量渲染机制，即使长文本也能流畅展示
- **🎨 丰富语法支持**：支持GFM标准、数学公式、流程图、代码高亮等
- **🔧 高度可扩展**：提供完整的插件机制，支持自定义语法
- **📱 移动端友好**：响应式设计，触摸操作优化
- **🎯 专为中文优化**：更好的中文排版和字体渲染

### 开箱即用的强大能力

无需任何配置，即可享受Cherry Markdown带来的丰富渲染能力：

```jsx
import { ChatMarkdown } from '@tdesign-react/chat';

// 自动渲染各种复杂内容
<ChatMarkdown content={`
# AI助手回复

这是一段包含**粗体**、*斜体*、\`代码\`的文本。

## 代码示例
\`\`\`javascript
function hello() {
  console.log('Hello, TDesign Chat!');
}
\`\`\`

## 数学公式
行内公式：$E=mc^2$

块级公式：
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## 表格展示
| 功能 | 支持度 |
|------|--------|
| 代码高亮 | ✅ |
| 数学公式 | ✅ |
| 流程图 | ✅ |
`} />
```

### 灵活的主题定制

支持通过配置项自定义渲染样式和主题：

```jsx
<ChatMarkdown
  content={markdownText}
  options={{
    // 主题配置
    theme: 'dark', // 支持 light/dark 主题
    // 代码高亮主题
    codeBlockTheme: 'github',
    // 自定义样式
    themeSetting: {
      mainColor: '#1890ff',
      codeBlockColor: '#f5f5f5',
    },
  }}
/>
```

### 自定义语法扩展

基于 Cherry 的插件机制，可以轻松扩展自定义语法：

```jsx
import { ChatMarkdown, MarkdownEngine } from '@tdesign-react/chat';

// 自定义脚注语法：[ref:1|标题|摘要|链接]
const footnoteHook = MarkdownEngine.createSyntaxHook(
  'footnote',
  MarkdownEngine.constants.HOOKS_TYPE_LIST.SEN,
  {
    makeHtml(str) {
      return str.replace(
        /\[ref:(\d+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/g,
        (match, id, title, summary, link) => `
          <div class="footnote">
            <sup>[${id}]</sup>
            <a href="${link}" target="_blank">${title}</a>
            <p>${summary}</p>
          </div>
        `
      );
    },
  }
);

// 使用自定义语法
<ChatMarkdown
  content="参考文献：[ref:1|Cherry Markdown|强大的Markdown引擎|https://github.com/Tencent/cherry-markdown]"
  customSyntax={[footnoteHook]}
/>
```

### 按需加载插件

为了优化打包体积，组件默认只加载核心插件。可以按需引入额外能力：

```jsx
// 引入数学公式支持
import 'katex/dist/katex.min.css';
import 'katex/dist/katex.min.js';

// 引入流程图支持
import 'mermaid/dist/mermaid.min.js';

<ChatMarkdown
  content={content}
  options={{
    engine: {
      syntax: {
        mathBlock: { engine: 'katex' },
        mermaid: { engine: 'mermaid' },
      },
    },
  }}
/>
```

---

## 适配业界通用 AG-UI 协议

TDesign Chat 内置了对 **AG-UI（Agent User Interaction Protocol）** 标准协议的完整支持，让您的AI应用能够无缝对接符合该协议的各类Agent服务。

### 什么是 AG-UI 协议

AG-UI 是专为AI Agent与前端应用交互设计的标准化协议，定义了统一的事件流规范，覆盖对话生命周期、消息传输、工具调用、状态同步等完整交互流程。

**核心优势：**

- **统一标准**：一套前端代码适配所有遵循AG-UI的后端服务
- **功能完整**：支持流式传输、工具调用、状态管理等高级能力
- **易于扩展**：标准化的扩展点，便于添加新功能
- **生产就绪**：经过大规模实践验证的成熟协议

### 一键启用 AG-UI 支持

只需简单配置 `protocol: 'agui'`，即可开启AG-UI协议支持：

```jsx
import { ChatBot } from '@tdesign-react/chat';

export default () => (
  <ChatBot
    chatServiceConfig={{
      endpoint: '/api/agui/chat',
      protocol: 'agui', // 启用AG-UI协议
      stream: true,
    }}
  />
);
```

组件会自动处理AG-UI协议定义的16种标准事件类型：

| 事件类型 | 自动处理能力 |
|---------|-------------|
| **RUN_STARTED/FINISHED/ERROR** | 对话生命周期管理，自动显示加载状态 |
| **TEXT_MESSAGE_START/CONTENT/END** | 流式文本消息解析和渲染 |
| **THINKING_START/END** | 思考过程展示，增强AI可解释性 |
| **TOOL_CALL_START/ARGS/END/RESULT** | 工具调用过程可视化 |
| **STATE_SNAPSHOT/DELTA** | 前后端状态自动同步 |
| **MESSAGES_SNAPSHOT** | 消息历史自动回填 |

### 标准化的工具调用

AG-UI协议定义了完整的工具调用生命周期，TDesign Chat 提供了专用Hook来注册和管理工具组件：

```jsx
import { ChatBot, useAgentToolcall } from '@tdesign-react/chat';

function ChatWithTools() {
  // 注册工具渲染组件
  useAgentToolcall('weather_query', ({ toolCall }) => (
    <div className="weather-tool">
      <h4>🌤️ 天气查询</h4>
      <p>城市：{toolCall.args.city}</p>
      {toolCall.result && <p>结果：{toolCall.result}</p>}
    </div>
  ));

  useAgentToolcall('database_search', ({ toolCall }) => (
    <div className="search-tool">
      <h4>🔍 数据库搜索</h4>
      <p>查询：{toolCall.args.query}</p>
      {toolCall.status === 'running' && <Spin />}
      {toolCall.result && <SearchResults data={toolCall.result} />}
    </div>
  ));

  return <ChatBot chatServiceConfig={{ protocol: 'agui', ... }} />;
}
```

当后端Agent发送工具调用事件时，组件会自动匹配并渲染对应的工具组件：

```js
// 后端发送的AG-UI事件流
data: {"type": "TOOL_CALL_START", "toolCallId": "tool_001", "toolCallName": "weather_query"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tool_001", "delta": "{\"city\":\"北京\"}"}
data: {"type": "TOOL_CALL_END", "toolCallId": "tool_001"}
data: {"type": "TOOL_CALL_RESULT", "toolCallId": "tool_001", "content": "北京今日晴，22°C"}
```

### 状态同步机制

AG-UI协议支持前后端状态共享，TDesign Chat 提供了 `useAgentState` Hook来订阅和管理状态：

```jsx
import { ChatBot, useAgentState } from '@tdesign-react/chat';

function ChatWithState() {
  // 订阅AG-UI状态事件
  const { state, updateState } = useAgentState();

  return (
    <div>
      {/* 显示Agent共享的状态 */}
      <div className="agent-state">
        当前任务进度：{state.progress}%
        处理状态：{state.status}
      </div>
      
      <ChatBot chatServiceConfig={{ protocol: 'agui', ... }} />
    </div>
  );
}
```

后端通过 `STATE_SNAPSHOT` 和 `STATE_DELTA` 事件推送状态更新：

```js
// 完整状态快照
data: {"type": "STATE_SNAPSHOT", "state": {"progress": 0, "status": "started"}}

// 增量状态更新（基于JSON Patch RFC 6902）
data: {"type": "STATE_DELTA", "delta": [
  {"op": "replace", "path": "/progress", "value": 50}
]}
```

### 历史消息回填

AG-UI协议支持通过 `MESSAGES_SNAPSHOT` 事件回填历史消息，组件提供了转换工具：

```jsx
import { ChatBot, AGUIAdapter } from '@tdesign-react/chat';

// 从后端获取的AG-UI格式历史消息
const aguiHistory = [
  { role: 'user', content: [{ type: 'text', text: '你好' }] },
  { role: 'assistant', content: [{ type: 'text', text: '您好！' }] },
];

// 转换为组件所需格式
const messages = AGUIAdapter.convertHistoryMessages(aguiHistory);

<ChatBot
  defaultMessages={messages}
  chatServiceConfig={{ protocol: 'agui', ... }}
/>
```

### 协议扩展与自定义

即使使用AG-UI协议，仍然可以通过 `onMessage` 回调自定义事件处理：

```jsx
<ChatBot
  chatServiceConfig={{
    protocol: 'agui',
    endpoint: '/api/chat',
    onMessage: (chunk) => {
      // 自定义处理特定事件
      if (chunk.type === 'CUSTOM_EVENT') {
        return {
          type: 'custom',
          data: processCustomEvent(chunk),
        };
      }
      // 返回null使用内置AG-UI解析
      return null;
    },
  }}
/>
```

---

## 总结

TDesign Chat 通过四大核心特性，为AI应用开发提供了完整的解决方案：

1. **开箱即用的 ChatBot**：零配置快速启动，内置完整功能，极简集成体验
2. **高度可定制化**：丰富插槽、组合式开发、ChatEngine SDK逻辑复用，满足各种定制需求
3. **Cherry Markdown 引擎**：强大的富文本渲染能力，支持代码、公式、图表等复杂内容
4. **AG-UI 协议支持**：无缝对接标准化Agent服务，内置工具调用、状态管理等高级能力

无论您是要快速搭建原型，还是构建复杂的企业级AI应用，TDesign Chat 都能提供合适的解决方案。

立即开始您的AI聊天应用开发之旅！查看[快速上手指南](/react-aigc/docs/getting-started)了解更多。
