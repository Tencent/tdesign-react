---
title: Attachments 附件列表
description: 附件列表
isComponent: true
usage: { title: '', description: '' }
spline: aigc
---

## 基础用法

{{ base }}


## API
### Attachments Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
items | Array  | - | 附件列表。TS类型：`TdAttachmentItem[]`。[类型定义](./chat-filecard?tab=api#tdattachmentitem-类型说明) | Y
removable | Boolean | true | 是否显示删除按钮 | N
overflow | String | wrap | 文件列表超出时样式。可选项：wrap/scrollX/scrollY | N
imageViewer | Boolean | true | 图片预览开关 | N
onFileClick | Function | - | 点击文件卡片时的回调，TS类型：`(event: CustomEvent<TdAttachmentItem>) => void;` | N
onRemove | Function | - | 附件移除时的回调函数。 TS类型：`(event: CustomEvent<TdAttachmentItem>) => void` | N
