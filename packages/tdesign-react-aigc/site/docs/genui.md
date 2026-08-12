---
title: 生成式UI
order: 5
group:
  title: 快速上手
  order: 3
---

## 什么是生成式 UI

**生成式 UI（Generative UI）** 是指由 AI/LLM 动态生成的用户界面。与传统的「AI 生成文本 → 前端渲染」不同，生成式 UI 让 AI 直接输出 UI 结构（JSON Schema），前端实时渲染为真实的交互组件。

```
传统模式：用户提问 → AI 生成文本回答 → 前端渲染 Markdown

生成式 UI：用户提问 → AI 生成 UI Schema → 前端渲染交互组件（表单、卡片、图表等）
```

### 典型应用场景

| 场景 | 说明 |
|------|------|
| **动态表单生成** | AI 根据用户需求生成数据收集表单，支持实时交互和提交 |
| **数据可视化** | AI 生成图表、仪表盘等数据展示组件 |
| **任务卡片** | AI 生成任务状态卡片、进度展示等业务组件 |
| **配置面板** | AI 根据上下文动态生成配置项和操作按钮 |

### 为什么需要约束 AI 生成

直接让 AI 生成任意代码存在严重问题：

| 问题 | 说明 |
|------|------|
| **安全风险** | AI 可能生成恶意代码或不安全的 HTML |
| **输出不可预测** | 不同提示可能产生完全不同的代码结构，难以稳定渲染 |
| **样式不一致** | 生成的 UI 可能与应用设计系统不符 |
| **无法交互** | 纯代码字符串难以绑定事件和状态 |

**解决方案：给 AI 一个「受约束的组件词汇表」**

- AI 只能使用预定义的组件（如 Card、Button、Input）
- 每个组件的 props 都有明确的类型约束
- 输出始终是可预测的 JSON Schema
- 前端使用预注册的 React 组件渲染


## 核心设计


### 特性亮点

#### 治理价值
- **AI 约束**：Catalog 确保 AI 只能在安全边界内创作
- **前端自由**：Registry 保持完全的渲染控制权
- **业务扩展**：通过 createCustomRegistry 灵活扩展业务组件

#### 核心特性

| 特性 | 说明 |
|------|------|
| **安全可控** | AI 只能生成 Catalog 中定义的组件，无法注入任意代码 |
| **输出可预测** | JSON 输出始终符合 Schema 约束，每次都能正确渲染 |
| **样式统一** | 使用 TDesign 组件库，保证 UI 风格一致 |
| **支持交互** | 通过 Action 机制处理按钮点击、表单提交等操作 |
| **流式增量更新** | 支持 ACTIVITY_SNAPSHOT（全量）和 ACTIVITY_DELTA（JSON Patch 增量） |
| **数据绑定** | 支持 valuePath 绑定表单数据，实现双向数据流 |
| **多协议支持** | 同时支持 json-render 和 A2UI 协议 |
| **自定义扩展** | 支持注册业务自定义组件，满足各类场景需求 |


### 双层架构

TDesign ChatEngine 基于 [json-render](https://json-render.dev/) 理念，采用 **Catalog（约束层）+ Registry（渲染层）** 的双层架构实现安全可控的生成式 UI。TDesign 内置 10+ 原子组件（容器和控件），结合自定义业务组件扩展，即可构建完整的业务 Registry：

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Catalog（约束层）                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐   │
│  │  组件 Props      │ │  Actions 白名单  │ │  类型验证            │   │
│  │  Schema 定义     │ │  定义           │ │  & 安全检查          │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────────┘   │
│                                                                     │
│  API: generateCatalogPrompt() → 生成 AI 系统提示词                   │
│                           ↓                                         │
│                    告诉 AI/LLM 可以生成什么                           │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                         AI 生成 JSON Schema
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        Registry（渲染层）                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐   │
│  │  内置 Registry   │ │  自定义扩展      │ │  createCustom       │   │
│  │  TDesign 组件    │ │  业务组件        │ │  Registry()         │   │
│  │  (10+ 原子组件)  │ │  (StatusCard等)  │ │                     │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────────┘   │
│                                                                     │
│  将 JSON Schema 渲染为真实 UI，处理用户交互（Action）                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 协议支持

TDesign Chat 的生成式 UI 基于 AG-UI 协议的 Activity 事件传输，同时支持两种 UI 描述协议：

### 原生 json-render 协议

直接使用 json-render 的 Schema 格式定义 UI 结构：

```json
{
  "root": "card_1",
  "elements": {
    "card_1": {
      "type": "Card",
      "props": { "title": "用户信息" },
      "children": ["input_name", "btn_submit"]
    },
    "input_name": {
      "type": "Input",
      "props": { "label": "姓名", "valuePath": "/form/name" }
    },
    "btn_submit": {
      "type": "Button",
      "props": { "children": "提交", "action": { "name": "submit" } }
    }
  }
}
```

**特点**：结构清晰、支持数据绑定（valuePath）、支持 Action 交互

### A2UI 协议

 [A2UI（Agent to UI）协议](https://a2ui.org/) 是 Google 提出的流式 UI 协议，核心特点是 **UI 结构与数据分离**：

```json
// 1. 创建画布
{"createSurface": {"surfaceId": "form_1", "catalogId": "..."}}

// 2. 更新组件结构（扁平化列表 + ID 引用）
{"updateComponents": {"surfaceId": "form_1", "components": [
  {"id": "root", "component": "Column", "children": ["name_field", "submit_btn"]},
  {"id": "name_field", "component": "TextField", "text": {"path": "/form/name"}},
  {"id": "submit_btn", "component": "Button", "child": "btn_label", "action": {"name": "submit"}},
  {"id": "btn_label", "component": "Text", "text": "提交"}
]}}

// 3. 更新数据模型
{"updateDataModel": {"surfaceId": "form_1", "path": "/form", "value": {"name": ""}}}
```

**特点**：
- 四种消息类型：`createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`
- 组件以邻接表形式定义，支持任意顺序发送
- 数据绑定：在 JSON Schema 中使用 path 对象语法，支持双向绑定
- 渐进式渲染：边接收边渲染

### 协议对比

| 维度 | json-render | A2UI |
|------|-------------|------|
| **结构** | 树形嵌套 | 扁平化邻接表 |
| **数据绑定** | valuePath 属性 | path 对象语法 |
| **更新方式** | JSON Patch | updateDataModel 消息 |
| **适用场景** | 一次性生成完整 UI | 流式渐进式生成 |

**TDesign ChatEngine 通过适配层统一处理两种协议**，开发者可根据后端实现选择合适的协议，详细的接入方式可以查看[API和示例文档](/react-chat/components/chat-engine#生成式ui)。

## 快速开始

### 三步接入

```tsx
import { useChat, useAgentActivity, generateCatalogPrompt } from '@tdesign-react/chat';
import { createJsonRenderActivityConfig, createCustomRegistry } from '@tdesign-react/chat';

// 步骤 1: 定义 Catalog（约束层）
const catalog = generateCatalogPrompt({
  name: 'my-dashboard',
  components: {
    StatusCard: {
      props: z.object({
        title: z.string(),
        status: z.enum(['success', 'warning', 'error']),
      }),
      description: '状态卡片组件',
    },
  },
  actions: {
    refresh: { description: '刷新数据' },
  },
});

// 步骤 2: 注册 Registry（渲染层）
const registry = createCustomRegistry({
  StatusCard: ({ element }) => (
    <div className={`status-{element.props.status}`}>
      {element.props.title}
    </div>
  ),
});

// 步骤 3: 配置 Activity
const config = createJsonRenderActivityConfig({
  activityType: 'json-render',
  registry,
  actionHandlers: {
    refresh: async () => { /* 处理刷新 */ },
  },
});

useAgentActivity(config);
```

### 数据流

```
1. 前端将 Catalog（系统提示词）发送给后端
2. 后端 AI 根据 Catalog 约束生成 JSON Schema
3. 后端通过 AG-UI 的 ACTIVITY_SNAPSHOT/DELTA 事件流式传输
4. 前端 json-render 引擎解析 Schema
5. Registry 查找组件实现并渲染
6. 用户交互触发 Action → actionHandlers 处理
```


完整的 API 说明、示例代码和最佳实践，请参考：

- [ChatEngine 生成式 UI 章节](/react-chat/components/chat-engine#生成式ui) - 完整示例和 API 文档
- [AG-UI 协议集成](/react-chat/docs/agui) - AG-UI 协议和 Activity 事件说明

### 后端对接要点

后端需要通过 AG-UI 协议的 Activity 事件输出 UI Schema：

```javascript
// 全量快照
data: {"type": "ACTIVITY_SNAPSHOT", "messageId": "ui_1", "activityType": "json-render", "content": {
  "root": "card_1",
  "elements": { /* json-render schema */ }
}}

// 增量更新（JSON Patch）
data: {"type": "ACTIVITY_DELTA", "messageId": "ui_1", "activityType": "json-render", "patch": [
  {"op": "replace", "path": "/elements/card_1/props/title", "value": "更新后的标题"}
]}
```

**关键点**：
- `activityType` 需要与前端 `createJsonRenderActivityConfig` 中配置的一致
- 增量更新使用 JSON Patch（RFC 6902）格式
- 建议将前端的 Catalog（系统提示词）传给后端，确保 AI 生成符合约束的 Schema
