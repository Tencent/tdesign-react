:: BASE_DOC ::

## API
### Message Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
closeBtn | TNode | undefined | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
duration | Number | 3000 | \- | N
icon | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | info | options：info/success/warning/error/question/loading。Typescript：`MessageThemeList` `type MessageThemeList = 'info' \| 'success' \| 'warning' \| 'error' \| 'question' \| 'loading'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts) | N
onClose | Function |  | Typescript：`(context: { trigger: 'close-click' \| 'duration-end', e?: MouseEvent }) => void`<br/>close message event | N
onCloseBtnClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onDurationEnd | Function |  | Typescript：`() => void`<br/> | N

### MessageOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
className | String | - | HTMLElement class | N
offset | Array | - | Typescript：`Array<string \| number>` | N
placement | String | top | options：center/top/left/right/bottom/top-left/top-right/bottom-left/bottom-right。Typescript：`MessagePlacementList` `type MessagePlacementList = 'center' \| 'top' \| 'left' \| 'right' \| 'bottom' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts) | N
style | Object | - | CSS style。Typescript：`CSSProperties` | N
zIndex | Number | 5000 | \- | N
`MessageProps` | \- | - | \- | N

### message 或 MessagePlugin

name | params | default | description
-- | -- | -- | --
theme | String | - | required。Typescript：`MessageThemeList`
message | String / Object | - | required。Typescript：`string \| MessageOptions`
duration | Number | 3000 | \-

### message.info 或 MessagePlugin.info

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions` `type MessageInfoOptions = Omit<MessageOptions, 'theme'>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts)
duration | Number | 3000 | \-

### message.error 或 MessagePlugin.error

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions`
duration | Number | 3000 | \-

### message.warning 或 MessagePlugin.warning

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions`
duration | Number | 3000 | \-

### message.success 或 MessagePlugin.success

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions`
duration | Number | 3000 | \-

### message.loading 或 MessagePlugin.loading

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions`
duration | Number | 3000 | \-

### message.question 或 MessagePlugin.question

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string \| MessageInfoOptions`
duration | Number | 3000 | \-

### message.closeAll 或 MessagePlugin.closeAll

name | params | default | description
-- | -- | -- | --
\- | \- | - | \-

### message.config 或 MessagePlugin.config

name | params | default | description
-- | -- | -- | --
message | Object | - | required。Typescript：`MessageOptions`
