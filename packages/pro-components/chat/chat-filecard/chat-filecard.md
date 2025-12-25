---
title: FileCard 文件缩略卡片
description: 文件缩略卡片
isComponent: true
usage: { title: '', description: '' }
spline: aigc
---

## 基础用法

{{ base }}


## API
### Filecard Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
item |  Object | - | TS类型：TdAttachmentItem。[类型定义](attachments?tab=api#tdattachmentitem-类型说明) | Y
removable | Boolean | true | 是否显示删除按钮 | N
disabled | Boolean | false | 禁用状态 | N
imageViewer | Boolean | true | 图片预览开关 | N
cardType | String  | file | 卡片类型。可选项：file/image | N
onRemove | Function | - | 卡片移除时的回调函数。TS类型：`(event: CustomEvent<TdAttachmentItem>) => void` | N
onFileClick | Function | - | 卡片点击时的回调函数。 TS类型：`(event: CustomEvent<TdAttachmentItem>) => void` | N

## TdAttachmentItem 类型说明
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
fileType | String | - | 文件类型，可选值：'image'/'video'/'audio'/'pdf'/'doc'/'ppt'/'txt' | N
description | String | - | 文件描述信息 | N
extension | String | - | 文件扩展名 | N
(继承属性) | UploadFile | - | 包含 `name`, `size`, `status` 等基础文件属性 | N
