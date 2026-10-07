---
title: ChatMarkdown 消息内容
description: Markdown格式的消息内容
isComponent: true
usage: { title: '', description: '' }
spline: aigc
---

## 基础用法

{{ base }}

## 配置项及加载插件
组件内置了`cherry-markdown`作为markdown解析引擎，可以通过配置项`options`来定制解析规则。同时为了减小打包体积，我们只默认加载了部分必要插件，如果需要加载更多插件，可以通过 Cherry 的 `options.engine.syntax` 配置加载 `katex` 公式插件。

{{ plugin }}

<!-- ## 自定义渲染

{{ custom }} -->

## API
### ChatMarkdown Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String | - | 需要渲染的 Markdown 内容 | N
options | Object | - | Cherry Markdown 解析配置。TS类型：`TdChatContentMDOptions` | N
