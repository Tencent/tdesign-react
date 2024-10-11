:: BASE_DOC ::

## API
### ChatInput Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
stopDisabled | Boolean | false | 中止按钮是否可点击。等流式数据全部返回结束置为false，`注意跟textLoading的控制时机不是同一个` | N
suffixIcon | String / Slot / Function | - | 发送按钮扩展。 | N
placeholder | String | - | 输入框默认文案。 | N
disabled | Boolean | false | 输入框是否可以输入内容  | N
onSend | Function | (value:string, context: { e: MouseEvent \| KeyboardEvent }) => void | 点击消息发送。 | N
onStop | Function | (value:string, context: { e: MouseEvent }) => void | 点击消息终止。 | N
onChange | Function | (value:string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent }) => void | 输入框值发生变化时触发 | N
### ChatInput Events

名称 | 参数 | 描述 | 说明 | 必传
-- | -- | -- | -- | --
send | (value:string, context: { e: MouseEvent }) => void |点击消息发送。 | N
stop | (value:string, context: { e: MouseEvent }) => void |点击消息终止。 | N
change | (value:string, context: { e: InputEvent \| MouseEvent \| KeyboardEvent }) => void |输入框值发生变化时触发 | N
