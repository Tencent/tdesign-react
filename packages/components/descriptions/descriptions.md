:: BASE_DOC ::

## API

### Descriptions Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
bordered | Boolean | false | 是否带边框 | N
colon | Boolean | - | 字段名右侧是否携带冒号“：” | N
column | Number | 2 | 一行 `DescriptionItem` 的数量 | N
contentStyle | Object | - | 自定义描述项内容的样式。TS 类型：`Styles`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
itemLayout | String | horizontal | 描述项的排列方向。可选项：horizontal/vertical | N
items | Array | - | 描述项的列表。TS 类型：`Array<TdDescriptionItemProps>` | N
labelStyle | Object | - | 自定义描述项标签的样式。TS 类型：`Styles`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
layout | String | horizontal | 排列方向。可选项：horizontal/vertical | N
size | String | medium | 组件尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
title | TNode | - | 描述列表的标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N


### DescriptionItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
content | TNode | - | 描述项内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
label | TNode | - | 描述项标签。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
span | Number | 1 | 占用的宽度数量 | N
