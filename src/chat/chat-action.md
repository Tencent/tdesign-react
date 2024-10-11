:: BASE_DOC ::

## API
### ChatAction Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
isGood | Boolean | false | 是否点赞。 | N
isBad | Boolean | false | 是否点踩。 | N
content | String | - | 要复制的内容。 | N
disabled | Boolean | false | 操作按钮是否可点击。 | N
operationBtn | Array | ['replay', 'copy', 'good', 'bad'] | 操作按钮配置项，`可配置操作按钮选项和顺序`
onOperation | Function | (value:string, context: { e: MouseEvent }) => void | 点击点赞，点踩，复制，重新生成按钮 | N

### ChatAction Events

名称 | 参数 | 描述 | 说明 | 必传
-- | -- | -- | -- | --
operation | (value:string, context: { e: MouseEvent; }) => void | 点击点赞，点踩，复制，重新生成按钮 | N