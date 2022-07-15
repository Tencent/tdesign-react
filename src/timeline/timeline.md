:: BASE_DOC ::

## API
### TimeLine Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | right | 时间信息放在时间轴的位置：左侧、右侧或两侧，默认信息在时间轴右侧。可选项：left/right/alternate | N
layout | String | vertical | 时间轴方向：水平方向、垂直方向。可选项：horizontal/vertical | N
reverse | Boolean | false | 时间轴是否表现为倒序 | N
theme | String | default | 步骤条风格。可选项：default/dot | N

### TimeLineItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | - | 时间信息相对于时间轴的位置，优先级高于 `TimeLine.align`。可选项：left/right | N
children | TNode | - | 描述内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
color | String | - | 时间轴颜色 | N
content | TNode | - | 描述内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
dot | TElement | - | 用于自定义时间轴节点元素。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
status | String | - | 当前步骤状态：默认状态（未开始）、进行中状态、完成状态。可选项：default/process/finish | N
time | TNode | - | 时间，可完全自定义。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
