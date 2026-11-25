:: BASE_DOC ::

## API

### Cell Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | middle | 右侧内容的对齐方式，默认居中对齐。可选项：top/middle/bottom | N
arrow | Boolean | false | 是否显示右侧箭头 | N
bordered | Boolean | true | 是否显示下边框 | N
description | TNode | - | 下方内容描述。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
hover | Boolean | - | 是否开启点击反馈 | N
image | TNode | - | 主图。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
leftIcon | TElement | - | 左侧图标，出现在单元格标题的左侧。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
note | TNode | - | 和标题同行的说明文字。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
required | Boolean | false | 是否显示表单必填星号 | N
rightIcon | TElement | - | 最右侧图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
title | TNode | - | 标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>右侧内容 | N


### CellGroup Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
bordered | Boolean | false | 是否显示组边框 | N
theme | String | default | 单元格组风格。可选项：default/card | N
title | String | - | 单元格组标题 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-border-left-space | @cell-horizontal-padding | -
--td-cell-bg-color | @bg-color-container | -
--td-cell-border-color | @component-stroke | -
--td-cell-border-right-space | 0 | -
--td-cell-description-color | @text-color-secondary | -
--td-cell-description-font | @font-body-medium | -
--td-cell-group-border-color | @border-color | -
--td-cell-group-title-bg-color | @bg-color-secondarycontainer | -
--td-cell-group-title-color | @text-color-placeholder | -
--td-cell-group-title-font-size | 14px | -
--td-cell-group-title-line-height | 45px | -
--td-cell-group-title-padding-left | 16px | -
--td-cell-height | auto | -
--td-cell-horizontal-padding | 16px | -
--td-cell-hover-color | @bg-color-secondarycontainer | -
--td-cell-image-height | 48px | -
--td-cell-image-width | 48px | -
--td-cell-left-icon-color | @brand-color | -
--td-cell-left-icon-size | 24px | -
--td-cell-note-color | @text-color-placeholder | -
--td-cell-note-font | @font-body-medium | -
--td-cell-required-color | @error-color-6 | -
--td-cell-required-font | @font-body-medium | -
--td-cell-right-icon-color | @text-color-placeholder | -
--td-cell-right-icon-size | 24px | -
--td-cell-title-color | @text-color-primary | -
--td-cell-title-font | @font-body-large | -
--td-cell-vertical-padding | 16px | -
