:: BASE_DOC ::

## API
### ChatAttachments Props

name | type | default | description | required
-- | -- | -- | -- | --
items | Array  | - | 附件列表。TS类型：TdAttachmentItem[]。[类型定义](?tab=api#tdattachmentitem-类型说明) | Y
onRemove | Function | - | 附件移除时的回调函数。 TS类型：`(item:  TdAttachmentItem) => void \| undefined` | N
removable | Boolean | true | 是否显示删除按钮 | N
overflow | String | wrap | 文件列表超出时样式。可选项：wrap/scrollX/scrollY | N
imageViewer | Boolean | true | 图片预览开关 | N

## TdAttachmentItem 类型说明
name | type | default | description | required
-- | -- | -- | -- | --
description | String | - | 文件描述信息 | N
extension | String | - | 文件扩展名 | N
(继承属性) | UploadFile | - | 包含 `name`, `size`, `status` 等基础文件属性 | N