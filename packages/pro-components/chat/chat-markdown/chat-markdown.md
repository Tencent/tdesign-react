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
组件内置了`cherry-markdown`作为markdown解析引擎，可以通过配置项`options`来定制解析规则。同时为了减小打包体积，我们只默认加载了部分必要插件，如果需要加载更多插件，可以通过查看[cherry-markdown文档](https://github.com/Tencent/cherry-markdown/blob/dev/README.CN.md)配置开启，以下给出动态引入`katex公式`插件的示例。

{{ plugin }}

## 自定义事件
{{ event }}

## 自定义语法渲染
以下展示了如何基于`cherry createSyntaxHook`机制来实现自定义脚注，语法格式：**[ref:1|标题|摘要|链接]**, 更多更丰富的自定义语法功能和示例，可以参考[cherry-markdown自定义语法](https://github.com/Tencent/cherry-markdown/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E6%B3%95)

{{ footnote }}

## API
### ChatMarkdown Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | String | - | 需要渲染的 Markdown 内容 | N
role | String | - | 发送者角色，影响样式渲染 | N
options | MarkdownIt.Options | - | Markdown 解析器基础配置。TS类型：`{ html: true, breaks: true, typographer: true }` | N
pluginConfig | Array | - | 插件配置数组。TS类型：`[ { preset: 'code', enabled: false }, { preset: 'katex', enabled: false } ]` | N
