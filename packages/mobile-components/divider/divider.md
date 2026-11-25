:: BASE_DOC ::
## API

### Divider Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | center | 文本位置（仅在水平分割线有效）。可选项：left/right/center | N
children | TNode | - | 子元素，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
dashed | Boolean | false | 是否虚线（仅在水平分割线有效） | N
layout | String | horizontal | 分隔线类型有两种：水平和垂直。可选项：horizontal/vertical | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-divider-border-width | 1px | -
--td-divider-color | @bg-color-component | -
--td-divider-content-color | @text-color-placeholder | -
--td-divider-content-font | @font-body-small | -
--td-divider-content-line-style | solid | -
--td-divider-content-margin | @spacer-1 | -
--td-divider-horizontal-margin | 10px | -
--td-divider-vertical-margin | @spacer | -
