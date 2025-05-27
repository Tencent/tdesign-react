:: BASE_DOC ::

## API
### ChatSender Props

name | type | default | description | required
-- | -- | -- | -- | --
placeholder | String | - | 输入框占位文本 | N
disabled | Boolean | false | 是否禁用组件 | N
value | String | - | 输入框内容(受控) | N
defaultValue | String | - | 输入框默认内容(非受控) | N
loading | Boolean | false | 是否显示加载状态 | N
autosize | Object | `{ minRows: 2 }` | 输入框自适应高度配置 | N
actions | Array/Function/Boolean | - | 操作按钮配置 | N
attachmentsProps | Object | `{ items: [], overflow: 'scrollX' }` | 附件配置 | N
textareaProps | Object | - | 输入框额外属性 | N
uploadProps | Object | - | 文件上传属性 | N
onFileSelect | Function | - | 文件选择事件 | N
onFileRemove | Function | - | 文件移除事件 | N
onSend | Function | - | 发送消息事件。参数：`{ value: string, attachments: TdAttachmentItem[] }` | N
onStop | Function | - | 停止发送事件 | N
onChange | Function | - | 输入内容变化事件 | N
onFocus | Function | - | 输入框聚焦事件 | N
onBlur | Function | - | 输入框失焦事件 | N
onAction | Function | - | 操作按钮点击事件。参数：`{ action: string, index: number }` | N

### 插槽

| 插槽名 | 说明 |
|--------|------|
| header | 顶部自定义内容 |
| inner-header | 输入区域顶部内容 |
| prefix | 输入框前缀内容 |
| footer-left | 底部左侧区域 |
| actions | 操作按钮区域 |
