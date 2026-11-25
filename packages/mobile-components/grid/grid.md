:: BASE_DOC ::

## API

### Grid Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | center | 内容对齐方式。可选项：left/center | N
border | Boolean | false | 是否显示边框 | N
column | Number | 4 | 每一行的列数量；为 0 时等于固定大小 | N
gutter | Number | - | 间隔大小 | N
theme | String | default | 宫格的风格。可选项：default/card | N


### GridItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
badge | Object | null | 透传至 Badge 属性。TS 类型：`BadgeProps`，[Badge API Documents](./badge?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/grid/type.ts) | N
description | TNode | - | 文本以外的更多描述，辅助信息。可以通过 Props 传入文本，也可以自定义标题节点。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | TNode | - | 图片，可以是图片地址，也可以自定义图片节点，如果传入对象则透传至 image 组件。TS 类型：`String \| TNode  \| ImageProps`，[Image API Documents](./image?tab=api)。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/grid/type.ts) | N
layout | String | vertical | 内容布局方式。可选项：vertical/horizontal | N
text | TNode | - | 文本，可以通过 Props 传入文本，也可以自定义标题节点。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-grid-bg-color | @bg-color-container | -
--td-grid-card-radius | @radius-large | -
--td-grid-item-bg-color | @bg-color-container | -
--td-grid-item-border-color | @component-stroke | -
--td-grid-item-description-color | @text-color-placeholder | -
--td-grid-item-description-font | @font-body-small | -
--td-grid-item-description-padding-top | 4px | -
--td-grid-item-horizontal-padding | 16px 0 | -
--td-grid-item-horizontal-text-description-top | 2px | -
--td-grid-item-horizontal-text-padding-left | 12px | -
--td-grid-item-hover-bg-color | @bg-color-secondarycontainer | -
--td-grid-item-image-bg-color | @bg-color-secondarycontainer | -
--td-grid-item-image-border-radius | @radius-default | -
--td-grid-item-image-middle-width | 40px | -
--td-grid-item-image-small-width | 32px | -
--td-grid-item-image-width | 48px | -
--td-grid-item-text-color | @text-color-primary | -
--td-grid-item-text-font | @font-body-medium | -
--td-grid-item-text-middle-font | @font-body-small | -
--td-grid-item-text-padding-top | 8px | -
--td-grid-item-text-small-font | @font-body-extraSmall | -
--td-grid-item-vertical-padding | 16px 0 12px | -
