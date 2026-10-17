:: BASE_DOC ::

## API
### ChatActionBar Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actionBar | TdChatActionsName[] \| boolean | true | 操作按钮配置项，可配置操作按钮选项和顺序。数组可选项：replay/copy/good/bad/share | N
handleAction | Function | - | 操作回调函数。TS类型：`(name: TdChatActionsName, data: any) => void` | N
comment | ChatComment | - | 用户反馈状态，可选项：'good'/'bad' | N
copyText | string | - | 复制按钮的复制文本 | N
tooltipProps | TooltipProps | - | tooltip的属性 [类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/tooltip/type.ts)  | N
