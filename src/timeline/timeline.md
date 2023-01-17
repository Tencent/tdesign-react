:: BASE_DOC ::

## API
### Timeline Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
labelAlign | String | left | 标签信息放在时间轴的位置，`mode='alternate'` 时生效。纵向时间轴信息位置：左侧、右侧或两侧，默认信息在时间轴右侧。横向时间轴信息位置：上方、下方、两侧。可选项：left/right/alternate/top/bottom | N
layout | String | vertical | 时间轴方向：水平方向、垂直方向。可选项：horizontal/vertical | N
mode | String | alternate | 标签与内容文本的位置关系，`alternate` 为展示在轴两侧，`same` 为展示在同一侧。可选项：alternate/same | N
reverse | Boolean | false | 时间轴是否表现为倒序 | N
theme | String | default | 步骤条风格。可选项：default/dot | N
