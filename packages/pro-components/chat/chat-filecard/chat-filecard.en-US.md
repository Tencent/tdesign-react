:: BASE_DOC ::

## API
### Filecard Props

name | type | default | description | required
-- | -- | -- | -- | --
item |  Object | - | TS类型：TdAttachmentItem。[类型定义](./attachments?tab=api#tdattachmentitem-类型说明) | Y
removable | Boolean | true | 是否显示删除按钮 | N
onRemove | Function | - | 附件移除时的回调函数。TS类型：`(item:  TdAttachmentItem) => void` | N
disabled | Boolean | false | 禁用状态 | N
imageViewer | Boolean | true | 图片预览开关 | N
cardType | String  | file | 卡片类型。可选项：file/image | N
