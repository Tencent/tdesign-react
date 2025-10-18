---
title: ChatActionBar 对话操作栏
description: 对话消息操作栏
isComponent: true
usage: { title: '', description: '' }
spline: aigc
---

## 基础用法

{{ base }}

## 样式调整
支持通过css变量修改样式，
支持通过`tooltipProps`属性设置提示浮层的样式

{{ style }}

## 自定义

目前仅支持有限的自定义，包括调整顺序，展示指定项

{{ custom }}



## API
### ChatActionBar Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actionBar | TdChatActionsName[] \| boolean | true | 操作按钮配置项，可配置操作按钮选项和顺序。数组可选项：replay/copy/good/bad/share | N
handleAction | Function | - | 操作回调函数。TS类型：`(name: TdChatActionsName, data: any) => void` | N
comment | ChatComment | - | 用户反馈状态，可选项：'good'/'bad' | N
copyText | string | - | 复制按钮的复制文本 | N
tooltipProps | TooltipProps | - | tooltip的属性 [类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/tooltip/type.ts)  | N
