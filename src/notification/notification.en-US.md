:: BASE_DOC ::

## API

### Notification Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeBtn | TNode | undefined | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
duration | Number | 3000 | \- | N
footer | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
icon | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | info | options：info/success/warning/error。Typescript：`NotificationThemeList` `type NotificationThemeList = 'info' \| 'success' \| 'warning' \| 'error'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/notification/type.ts) | N
title | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
onCloseBtnClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onDurationEnd | Function |  | Typescript：`() => void`<br/> | N

### NotificationOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
offset | Array | - | Typescript：`Array<string \| number>` | N
placement | String | top-right | options：top-left/top-right/bottom-left/bottom-right。Typescript：`NotificationPlacementList` `type NotificationPlacementList = 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/notification/type.ts) | N
zIndex | Number | 6000 | \- | N
`NotificationProps` | \- | - | \- | N

### notification 或 NotificationPlugin

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
theme | String | info | required。options：info/success/warning/error。Typescript：`NotificationThemeList`
options | Object | - | required。Typescript：`NotificationOptions`

### notification.info 或 NotificationPlugin.info

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions` `type NotificationInfoOptions = Omit<NotificationOptions, 'theme'>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/notification/type.ts)

插件返回值：`Promise<NotificationInstance>`

### notification.warning 或 NotificationPlugin.warning

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.error 或 NotificationPlugin.error

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.success 或 NotificationPlugin.success

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.close 或 NotificationPlugin.close

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`Promise<NotificationInstance>`

### notification.closeAll 或 NotificationPlugin.closeAll

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
-- | \- | - | \-

### notification.config 或 NotificationPlugin.config

这是一个插件函数，参数形式为顺序参数（形如：(a, b, c)），而非对象参数（形如：({ a, b, c })）。顺序参数如下，

name | params | default | description
-- | -- | -- | --
notify | Object | - | required。Typescript：`NotificationOptions`
