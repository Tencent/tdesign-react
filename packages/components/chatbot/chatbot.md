---
title: Chatbot 智能对话
description: 智能对话聊天组件，适用于需要快速集成智能客服、问答系统等的AI应用
isComponent: true
usage: { title: '', description: '' }
spline: navigation
---

## 基本用法
### 标准化集成
组件内置状态管理，SSE解析，自动处理消息内容渲染与交互逻辑，可开箱即用快速集成实现标准聊天界面。本示例演示了如何快速创建一个具备以下功能的智能对话组件：
  - 初始化预设消息
  - 预设消息内容渲染支持（markdown、搜索、思考、建议等）
  - 与服务端的SSE（Server-Sent Events）通信，支持流式消息响应
  - 自定义流式内容结构解析
  - 自定义请求参数处理
  - 常用消息操作处理及回调（复制、重试、点赞/点踩）
  - 支持手动触发填入prompt, 重新生成，发送消息等

{{ basic }}

### 组合式用法
可以通过 `useChat` Hook提供的对话引擎实例及状态控制方法，同时自行组合拼装`ChatList`，`ChatMessage`, `ChatSender`等组件集成聊天界面，适合需要深度定制组件结构和消息处理流程的场景
{{ hookComponent }}

## 自定义
如果组件内置的消息渲染方案不能满足需求，还可以通过**自定义消息结构解析逻辑和消息内容渲染组件**来实现更多渲染需求。以下示例给出了一个自定义实现图表渲染的示例，实现自定义渲染需要完成四步：
- 1、扩展自定义消息体类型
- 2、注册自定义渲染插槽规则
- 3、实现自定义渲染的组件，示例中使用了tvision-charts-react实现图表渲染
- 4、在onMessage回调中定义返回组件所需的数据结构，同时可以通过返回`strategy`来决定新内容块的追加策略，如果需要支持更灵活的合并策略则返回完整消息数组`AIMessageContent[]`

如果组件内置的几种操作 `TdChatItemActionName` 不能满足需求，示例中同时给出了**自定义消息操作区**的方法，可以自行实现更多操作。

{{ custom }}


## 场景化示例
以下再通过几个常见的业务场景，展示下如何使用 `Chatbot` 组件

### 代码助手
{{ code }}

### 多模态交付
{{ multimedia }}

### 自主任务规划
{{ agent }}


## API
### Chatbot Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
block | Boolean | false | 是否为块级元素 | N
children | TNode | - | 按钮内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
content | TNode | - | 按钮内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | false | 禁用状态 | N
form | String | undefined | 原生的form属性，支持用于通过 form 属性触发对应 id 的 form 的表单事件 | N
ghost | Boolean | false | 是否为幽灵按钮（镂空按钮） | N
href | String | - | 跳转地址。href 存在时，按钮标签默认使用 `<a>` 渲染；如果指定了 `tag` 则使用指定的标签渲染 | N
icon | TElement | - | 按钮内部图标，可完全自定义。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
loading | Boolean | false | 是否显示为加载状态 | N
shape | String | rectangle | 按钮形状，有 4 种：长方形、正方形、圆角长方形、圆形。可选项：rectangle/square/round/circle | N
size | String | medium | 组件尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
suffix | TElement | - | 右侧内容，可用于定义右侧图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
tag | String | - | 渲染按钮的 HTML 标签，默认使用标签 `<button>` 渲染，可以自定义为 `<a>` `<div>` 等。透传全部 HTML 属性，如：`href/target/data-*` 等。⚠️ 禁用按钮 `<button disabled>`无法显示 Popup 浮层信息，可通过修改 `tag=div` 解决这个问题。可选项：button/a/div | N
theme | String | - | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success | N
type | String | button | 按钮类型。可选项：submit/reset/button | N
variant | String | base | 按钮形式，基础、线框、虚线、文字。可选项：base/outline/dashed/text | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发 | N
