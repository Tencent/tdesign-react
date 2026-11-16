:: BASE_DOC ::

## API
### ChatActionBar Props

name | type | default | description | required
-- | -- | -- | -- | --
actionBar | Array / Boolean | true | 操作按钮配置项，可配置操作按钮选项和顺序。数组可选项：replay/copy/good/bad/goodActived/badActived/share | N
onActions | Function | - | 操作按钮回调函数。TS类型：`Record<TdChatMessageActionName, (data?: any, callback?: Function) => void>` | N
message | Object | - | 对话数据信息 | N
tooltipProps | TooltipProps | - | [类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/tooltip/type.ts)  | N
