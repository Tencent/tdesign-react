---
title: ChatSender 对话输入
description: 用于构建智能对话场景下的输入框组件
isComponent: true
usage: { title: '', description: '' }
spline: navigation
---

## 基础用法

受控进行输入/发送等状态管理
{{ base }}


## 附件输入
支持选择附件及展示附件列表，受控进行文件数据管理，示例中模拟了文件上传流程
{{ attachment }}


## 自定义
通过植入具名插槽来实现输入框的自定义，内置支持的扩展位置包括：

输入框上方区域`header`，输入框内头部区域`inner-header`，可输入区域前置部分`prefix`，输入框底部左侧区域`footer-left`，输入框底部操作区域`actions`

同时示例中演示了通过`CSS变量覆盖`实现样式定制

{{ custom }}

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