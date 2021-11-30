
### Notification Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
children | TNode | - | 自定义内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
closeBtn | TNode | undefined | 关闭按钮，可以自定义。值为 true 显示默认关闭按钮，值为 false 不显示关闭按钮。值类型为 string 则直接显示值，如：“关闭”。值类型为 TNode，则表示呈现自定义按钮示例。TS 类型：`string | boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 自定义内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示 | N
footer | TNode | - | 用于自定义底部内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
icon | TElement | - | 自定义图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
theme | String | info | 消息类型。可选值：info/success/warning/error。TS 类型：`NotificationThemeList`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/notification/index.ts) | N
title | TNode | - | 标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
onCloseBtnClick | Function |  | 点击关闭按钮时触发。`(context: { e: MouseEvent }) => {}` | N
onDurationEnd | Function |  | 计时结束时触发。`() => {}` | N


### NotificationOptions
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
attach | String / Function | 'body' | 指定消息通知挂载的父节点。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
offset | Array | - | 相对于 placement 的偏移量，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string | number>` | N
placement | String | top-right | 消息弹出位置。可选值：top-left/top-right/bottom-left/bottom-right。TS 类型：`NotificationPlacementList`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/notification/index.ts) | N
zIndex | Number | 6000 | 自定义层级 | N
TdNotificationProps | - | - | 继承 `TdNotificationProps` 中的全部 API | N


### this.$notification
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
theme | String | info | 消息类型。可选值：info/success/warning/error。TS 类型：`NotificationThemeList`
options | Object | - | 消息通知内容。TS 类型：`NotificationOptions`


### this.$notification.info
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | 消息通知内容。TS 类型：`NotificationInfoOptions`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/notification/index.ts)

插件返回值：`Promise<NotificationInstance>`


### this.$notification.warning
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | 消息通知内容。TS 类型：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`


### this.$notification.error
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | 消息通知内容。TS 类型：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`


### this.$notification.success
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | 消息通知内容。TS 类型：`NotificationInfoOptions`

插件返回值：`Promise<NotificationInstance>`


### this.$notification.close
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | 该插件参数为 $Notification.info() 等插件执行后的返回值。示例：`const msg = $Notification.info({}); $Notification.close(msg)`。TS 类型：`Promise<NotificationInstance>`


### this.$notification.closeAll
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
- | Object | - | -