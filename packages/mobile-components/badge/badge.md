:: BASE_DOC ::

## API

### Badge Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 徽标内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
color | String | - | 颜色 | N
content | TNode | - | 徽标内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
count | TNode | 0 | 徽标右上角内容。可以是数字，也可以是文字。如：'new'/3/99+。TS 类型：`string \| number \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
dot | Boolean | false | 是否为红点 | N
maxCount | Number | 99 | 封顶的数字值 | N
offset | Array | - | 设置状态点的位置偏移，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string \| number>` | N
shape | String | circle | 徽标形状，其中 ribbon 和 ribbon-right 等效。可选项：circle/square/bubble/ribbon/ribbon-right/ribbon-left/triangle-right/triangle-left | N
showZero | Boolean | false | 当数值为 0 时，是否展示徽标 | N
size | String | medium | 尺寸。可选项：medium/large | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-badge-basic-height | 16px | -
--td-badge-basic-padding | 4px | -
--td-badge-basic-width | 16px | -
--td-badge-bg-color | @error-color | -
--td-badge-border-radius | 2px | -
--td-badge-bubble-border-radius | 10px 10px 10px 1px | -
--td-badge-content-text-color | @text-color-primary | -
--td-badge-dot-size | 8px | -
--td-badge-font | @font-mark-extraSmall | -
--td-badge-large-font | @font-mark-small | -
--td-badge-large-height | 20px | -
--td-badge-large-padding | 5px | -
--td-badge-text-color | @text-color-anti | -
