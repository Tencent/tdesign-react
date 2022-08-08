:: BASE_DOC ::

## API

### Message Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
closeBtn | TNode | undefined | Typescript：`string | boolean | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
duration | Number | 3000 | \- | N
icon | TNode | true | Typescript：`boolean | TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | info | options：info/success/warning/error/question/loading。Typescript：`MessageThemeList` `type MessageThemeList = 'info' | 'success' | 'warning' | 'error' | 'question' | 'loading'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts) | N
onCloseBtnClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/> | N
onDurationEnd | Function |  | TS 类型：`() => void`<br/> | N

### MessageOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
offset | Array | - | Typescript：`Array<string | number>` | N
placement | String | top | options：center/top/left/right/bottom/top-left/top-right/bottom-left/bottom-right。Typescript：`MessagePlacementList` `type MessagePlacementList = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts) | N
zIndex | Number | 5000 | \- | N
`MessageProps` | \- | - | \- | N

### message 或 MessagePlugin

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
theme | String | - | required。Typescript：`MessageThemeList`
message | String / Object | - | required。Typescript：`string | MessageOptions`
duration | Number | 3000 | \-

### message.info 或 MessagePlugin.info

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions` `type MessageInfoOptions = Omit<MessageOptions, 'theme'>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/message/type.ts)
duration | Number | 3000 | \-

### message.error 或 MessagePlugin.error

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions`
duration | Number | 3000 | \-

### message.warning 或 MessagePlugin.warning

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions`
duration | Number | 3000 | \-

### message.success 或 MessagePlugin.success

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions`
duration | Number | 3000 | \-

### message.loading 或 MessagePlugin.loading

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions`
duration | Number | 3000 | \-

### message.question 或 MessagePlugin.question

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | String / Object | - | required。Typescript：`string | MessageInfoOptions`
duration | Number | 3000 | \-

### message.closeAll 或 MessagePlugin.closeAll

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
\- | \- | - | \-

### message.config 或 MessagePlugin.config

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
message | Object | - | required。Typescript：`MessageOptions`
