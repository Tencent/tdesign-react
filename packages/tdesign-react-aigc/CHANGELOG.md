---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.1.0 `2026-09-11`

### 🚀 Features

- 底层 Web Components 从 `tdesign-web-components` 迁移到 `@tdesign/web-components-chat` @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
- `ChatEngine`: 
  - 新增生成式 UI，内置 json-render Catalog/Registry、自定义组件、Action 与数据绑定；支持通过 AG-UI Activity 流式渲染，并内置 A2UI v0.9 适配 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
  - 兼容最新版本的 AG-UI 协议 reasoning 相关字段 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
  - 支持 reasoning 与 markdown 内容的多重增量更新 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))

### 🐞 Bug Fixes

- `ChatMarkdown`: 修复引用块内列表缩进丢失导致样式重叠 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
- `ChatSender`: 修复中文输入法拼音组合阶段按 Enter 误发送 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))

## 🌈 1.0.2 `2026-02-05`

### 🚀 Features

- `ChatEngine`: 
  - 支持AG-UI Activity-Snapshot/Delta事件的适配，新增useAgentActivity注册hook，并增加示例 @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
  - 增加在无 UI 场景下使用 ChatEngine 事件总线机制，并增加示例 @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
  - ToolCallRender 增加错误边界处理 @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
  - AG-UI协议下几个Delta事件，支持自动初始化接收无Snapshot情况下SSE Chunk流 @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
  - Immutable JSON Patch 性能优化，并支持append操作用来追加字符串 @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
- `ChatMarkdown`: 大幅优化依赖CherryMarkdown造成的打包体积膨胀问题，**不再内置highlight代码块样式高亮**，需要业务自行引入配置 @LzhengH @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))
- `ChatSender`: 支持readyToSend可以接管发送前校验  @LzhengH ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))

## 🌈 1.0.0 `2025-11-20`

- Release 1st version
