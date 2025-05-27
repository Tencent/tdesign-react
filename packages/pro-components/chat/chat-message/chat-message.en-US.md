:: BASE_DOC ::

## API
### ChatMessage Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actions | Array/Function/Boolean | - | 操作按钮配置项，可配置操作按钮选项和顺序。数组可选项：replay/copy/good/bad/goodActived/badActived/share  | N
name | String | - | 发送者名称 | N
avatar | String/JSX.Element | - | 发送者头像 | N
datetime | String | - | 消息发送时间 | N
message | Object | - | 消息内容对象。类型定义见 `Message` | Y
placement | String | left | 消息位置。可选项：left/right | N
role | String | - | 发送者角色 | N
variant | String | text | 消息变体样式。可选项：base/outline/text | N
chatContentProps | Object | - | 消息内容属性配置。类型支持见 `chatContentProps` | N
handleActions | Object | - | 操作按钮处理函数 | N
animation | String | skeleton | 加载动画类型。可选项：skeleton/moving/gradient/circle | N

### Message 消息对象结构
```typescript
interface Message {
  id: string; // 消息ID
  role: string; // 发送者角色
  status?: 'complete' | 'stop' | 'error'; // 消息状态
  content: Array<{
    type: string; // 内容类型
    data: any; // 内容数据
    status?: string; // 内容状态
    slotName?: string; // 插槽名称
  }>;
}
```

### chatContentProps 内容类型支持
- 文本消息 (`text`)
- Markdown 消息 (`markdown`)
- 搜索消息 (`search`)
- 建议消息 (`suggestion`)
- 思考状态 (`thinking`)
- 图片消息 (`image`)
- 附件消息 (`attachment`)

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| chat_message_action | `{ action: string, data: object }` | 操作按钮点击事件 |

### 插槽

| 插槽名 | 说明 |
|--------|------|
| actionbar | 自定义操作栏 |