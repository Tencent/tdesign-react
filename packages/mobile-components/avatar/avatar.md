:: BASE_DOC ::

## API

### Avatar Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
alt | String | - | 头像替换文本，仅当图片加载失败时有效 | N
badgeProps | Object | - | 头像右上角提示信息，继承 Badge 组件的全部特性。如：小红点，或者数字。TS 类型：`BadgeProps`，[Badge API Documents](./badge?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/avatar/type.ts) | N
children | TNode | - | 子元素内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
hideOnLoadFailed | Boolean | false | 加载失败时隐藏图片 | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | String | - | 图片地址 | N
imageProps | Object | - | 透传至 Image 组件。TS 类型：`ImageProps`，[Image API Documents](./image?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/avatar/type.ts) | N
shape | String | - | 形状。优先级高于 AvatarGroup.shape 。Avatar 单独存在时，默认值为 circle。如果父组件 AvatarGroup 存在，默认值便由 AvatarGroup.shape 决定。可选项：circle/round。TS 类型：`ShapeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
size | String | - | 尺寸，示例值：small/medium/large/24px/38px 等。优先级高于 AvatarGroup.size 。Avatar 单独存在时，默认值为 medium。如果父组件 AvatarGroup 存在，默认值便由 AvatarGroup.size 决定 | N
onError | Function |  | TS 类型：`(context: { e: Event }) => void`<br/>图片加载失败时触发 | N


### AvatarGroup Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
cascading | String | 'right-up' | 图片之间的层叠关系，可选值：左侧图片在上和右侧图片在上。可选项：left-up/right-up。TS 类型：`CascadingValue` `type CascadingValue = 'left-up' \| 'right-up'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/avatar/type.ts) | N
collapseAvatar | TNode | - | 头像数量超出时，会出现一个头像折叠元素。该元素内容可自定义。默认为 `+N`。示例：`+5`，`...`, `更多`。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
max | Number | - | 能够同时显示的最多头像数量 | N
shape | String | - | 形状。优先级低于 Avatar.shape。可选项：circle/round。TS 类型：`ShapeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
size | String | - | 尺寸，示例值：small/medium/large/24px/38px 等。优先级低于 Avatar.size | N
onCollapsedItemClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击头像折叠元素触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-avatar-bg-color | @brand-color-light-active | -
--td-avatar-border-color | @bg-color-container | -
--td-avatar-border-width-large | 3px | -
--td-avatar-border-width-medium | 2px | -
--td-avatar-border-width-small | 1px | -
--td-avatar-circle-border-radius | @radius-circle | -
--td-avatar-content-color | @brand-color | -
--td-avatar-group-line-spacing | 2px | -
--td-avatar-group-margin-left-large | -8px | -
--td-avatar-group-margin-left-medium | -8px | -
--td-avatar-group-margin-left-small | -8px | -
--td-avatar-icon-large-font-size | 32px | -
--td-avatar-icon-medium-font-size | 24px | -
--td-avatar-icon-small-font-size | 20px | -
--td-avatar-large-width | 64px | -
--td-avatar-margin-left | 0 | -
--td-avatar-medium-width | 48px | -
--td-avatar-round-border-radius | @radius-default | -
--td-avatar-small-width | 40px | -
--td-avatar-text-large-font-size | @font-size-xl | -
--td-avatar-text-medium-font-size | @font-size-m | -
--td-avatar-text-small-font-size | @font-size-base | -
