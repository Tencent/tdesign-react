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
组件内置了`markdown-it`作为markdown解析引擎，可以通过配置项`options`来定制解析规则。同时为了减小打包体积，我们只默认加载了部分必要插件，如果需要加载更多插件，可以通过`pluginConfig`属性来选择性开启，目前支持动态加载`code代码块`和`katex公式`插件。

{{ plugin }}

<!-- ## 自定义渲染

{{ custom }} -->

## API
### ChatMarkdown Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String | - | 需要渲染的 Markdown 内容 | N
role | String | - | 发送者角色，影响样式渲染 | N
options | MarkdownIt.Options | - | Markdown 解析器基础配置。TS类型：`{ html: true, breaks: true, typographer: true }` | N
pluginConfig | Array | - | 插件配置数组。TS类型：`[ { preset: 'code', enabled: false }, { preset: 'katex', enabled: false } ]` | N
