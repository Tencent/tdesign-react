:: BASE_DOC ::

## API

### SwipeCell Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
content | TNode | - | 操作项以外的内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | 是否禁用滑动 | N
left | TNode | - | 左侧滑动操作项。所有行为同 `right`。TS 类型：`Array<SwipeActionItem> \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
opened | Boolean / Array | false | 操作项是否呈现为打开态，值为数组时表示分别控制左右滑动的展开和收起状态。TS 类型：`boolean \| Array<boolean>` | N
right | TNode | - | 右侧滑动操作项。有两种定义方式，一种是使用数组，二种是使用插槽。`right.text` 表示操作文本，`right.className` 表示操作项类名，`right.style` 表示操作项样式，`right.onClick` 表示点击操作项后执行的回调函数。示例：`[{ text: '删除', style: 'background-color: red', onClick: () => {} }]`。TS 类型：`Array<SwipeActionItem> \| TNode` `interface SwipeActionItem {text: string; className?: string; style?: Styles; sure?: string \| TNode; onClick?: () => void; [key: string]: any }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/swipe-cell/type.ts) | N
onChange | Function |  | TS 类型：`(value: string) => void`<br/>菜单展开或者收回后将菜单的状态传递给父组件，值为数组时表示分别控制左右滑动的展开和收起状态 | N
onClick | Function |  | TS 类型：`(action: SwipeActionItem, source: SwipeSource) => void`<br/>操作项点击时触发（插槽写法组件不触发，业务侧自定义内容和事件）。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/swipe-cell/type.ts)。<br/>`type SwipeSource = 'left' \| 'right'`<br/> | N
onDragend | Function |  | TS 类型：`() => void`<br/>滑动结束事件 | N
onDragstart | Function |  | TS 类型：`() => void`<br/>滑动开始事件 | N

### SwipeCellInstanceFunctions 组件实例方法

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
showSure | `(sure: string \| TNode, onClick?: SwipeActionItem['onClick'])` | `void` | 显示二次确认内容的函数。参数: `sure` 表示二次确认的具体内容，同 content; `onClick` 表示点击二次确认内容时执行的回调。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)
