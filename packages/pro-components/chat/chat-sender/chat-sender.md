:: BASE_DOC ::

## API
### ChatSender Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
placeholder | String | - | 输入框占位文本 | N
disabled | Boolean | false | 是否禁用组件 | N
value | String | - | 输入框内容(受控) | N
defaultValue | String | - | 输入框默认内容(非受控) | N
loading | Boolean | false | 是否显示加载状态 | N
autosize | Object | `{ minRows: 2 }` | 输入框自适应高度配置 | N
actions | Array/Boolean | - | 操作按钮配置，TS 类型：`<'attachment' \| 'send'>[]` | N
attachmentsProps | Object | `{ items: [], overflow: 'scrollX' }` | 附件配置透传`ChatAttachment`，详见[ChatAttachment](https://tdesign.tencent.com/react-chat/components/attachments?tab=api) | N
textareaProps | Object | - | 输入框额外属性，部分透传`Textarea`，TS 类型：`Partial<Omit<TdTextareaProps, 'value' \| 'defaultValue' \| 'placeholder' \| 'disabled' \| 'autosize'>>`，详见[TdTextareaProps](https://tdesign.tencent.com/react/components/textarea?tab=api) | N
uploadProps | Object | - | 文件上传属性，TS 类型：`{ accept: string; multiple: boolean; }` | N
onSend | Function | - | 发送消息事件。TS 类型：`(e: CustomEvent<TdChatSenderParams>) => ChatRequestParams | void` | N
onStop | Function | - | 停止发送事件，TS 类型：`(e: CustomEvent<string>) => void` | N
onChange | Function | - | 输入内容变化事件，TS 类型：`(e: CustomEvent<string>) => void` | N
onFocus | Function | - | 输入框聚焦事件，TS 类型：`(e: CustomEvent<string>) => void` | N
onBlur | Function | - | 输入框失焦事件，TS 类型：`(e: CustomEvent<string>) => void` | N
onFileSelect | Function | - | 文件选择事件，TS 类型：`(e: CustomEvent<TdAttachmentItem[]>) => void` | N
onFileRemove | Function | - | 文件移除事件，TS 类型：`(e: CustomEvent<TdAttachmentItem[]>) => void` | N


### 插槽

| 插槽名 | 说明 |
|--------|------|
| header | 顶部自定义内容 |
| inner-header | 输入区域顶部内容 |
| input-prefix | 输入框前方区域 |
| textarea | 输入框替换 |
| footer-prefix | 底部左侧区域 |
| actions | 操作按钮区域 |
