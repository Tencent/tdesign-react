---
title: ChatLoading 对话加载
description: 适用于 Chat 对话场景下的加载组件
isComponent: true
usage: { title: '', description: '' }
spline: navigation
---

### 加载组件

{{ base }}

### 带文案描述的加载组件

{{ text }}

## API
### ChatLoading Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
animation | String | moving | 动画效果。可选项：skeleton/moving/gradient/dots/circle | N
text | TNode | - | 加载提示文案。TS类型：`string / TNode` | N
