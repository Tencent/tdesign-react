---
title: ChatActionBar 对话操作栏
description: 对话操作栏
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
actionBar | Array / Boolean | true | 操作按钮配置项，可配置操作按钮选项和顺序。数组可选项：replay/copy/good/bad/goodActived/badActived/share | N
onActions | Function | - | 操作按钮回调函数。TS类型：`Record<TdChatItemActionName, (data?: any, callback?: Function) => void>` | N
presetActions | Array | - | 预制按钮。TS类型：`Record<{name: TdChatItemActionName, render: TNode, condition?: (message: ChatMessagesData) => boolean;}>` | N
message | Object | - | 对话数据信息 | N
tooltipProps | TooltipProps | - | [类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/tooltip/type.ts)  | N
