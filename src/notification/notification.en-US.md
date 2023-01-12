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

name | params | default | description
-- | -- | -- | --
theme | String | info | required。options：info/success/warning/error。Typescript：`NotificationThemeList`
options | Object | - | required。Typescript：`NotificationOptions`

### notification.info 或 NotificationPlugin.info

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions` `type NotificationInfoOptions = Omit<NotificationOptions, 'theme'>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/notification/type.ts)

插件返回值：`Promise<NotificationInstance>`

### notification.warning 或 NotificationPlugin.warning

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.error 或 NotificationPlugin.error

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.success 或 NotificationPlugin.success

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`

### notification.close 或 NotificationPlugin.close

name | params | default | description
-- | -- | -- | --
options | Object | - | required。Typescript：`Promise<NotificationInstance>`

### notification.closeAll 或 NotificationPlugin.closeAll

name | params | default | description
-- | -- | -- | --
-- | \- | - | \-

### notification.config 或 NotificationPlugin.config

name | params | default | description
-- | -- | -- | --
notify | Object | - | required。Typescript：`NotificationOptions`
