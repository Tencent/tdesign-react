---
title: Chatbot 智能对话
description: 智能对话聊天组件，适用于需要快速集成智能客服、问答系统等的AI应用
isComponent: true
spline: navigation
---

{{ basic }}

### 组合式用法
可以通过 `useChat` Hook提供的对话引擎实例及状态控制方法，同时自行组合拼装`ChatList`，`ChatMessage`, `ChatSender`等组件集成聊天界面，适合需要深度定制组件结构和消息处理流程的场景
{{ hookComponent }}

## 自定义
如果组件内置的消息渲染方案不能满足需求，还可以通过自定义**消息结构解析逻辑**和**消息内容渲染组件**来实现更多渲染需求。以下示例给出了一个自定义实现图表渲染的示例，实现自定义渲染需要完成**四步**，概括起来就是：**扩展类型，准备组件，解析数据，植入插槽**：
- 1、扩展自定义消息体type类型
- 2、实现自定义渲染的组件，示例中使用了tvision-charts-react实现图表渲染
- 3、在onMessage回调中定义返回组件所需的数据结构，同时可以通过返回`strategy`来决定新内容块的追加策略，如果需要支持更灵活的合并策略则返回完整消息数组`AIMessageContent[]`
- 4、在render函数中遍历消息内容数组，植入自定义消息体渲染插槽，需保证slot名在list中的唯一性

如果组件内置的几种操作 `TdChatItemActionName` 不能满足需求，示例中同时给出了**自定义消息操作区**的方法，可以自行实现更多操作。

{{ custom }}


## 场景化示例
以下再通过几个常见的业务场景，展示下如何使用 `Chatbot` 组件

### 代码助手
通过使用tdesign开发登录框组件的案例，演示了使用Chatbot搭建简单的代码助手场景，该示例你可以了解到如何按需开启**markdown渲染代码块**，如何**自定义实现代码预览**
{{ code }}

### 文档理解
以下案例演示了使用Chatbot搭建简单的文件理解应用，通过该示例你可以了解到如何**使用附件区域**，同时演示了**附件类型的内容渲染**
{{ research }}

### 图像生成
以下案例演示了使用Chatbot搭建简单的图像生成应用，通过该示例你可以了解到如何**自定义输入框操作区域**，同时演示了**自定义生图内容渲染**
{{ image }}

### 任务规划
以下案例模拟了使用Chatbot搭建任务规划型智能体应用，分步骤依次执行并输出结果，通过该示例你可以了解到如何**自定义消息内容合并策略**，同时演示了**自定义任务流程渲染**
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
