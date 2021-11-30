
### Steps Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
current | String / Number | - | 当前步骤 | N
direction | String | horizontal | 步骤条方向，有两种：横向和纵向。可选值：horizontal/vertical | N
disabled | Boolean | false | 是否禁用点击 | N
options | Array | - | 步骤条数据列表（作用和 StepItem 效果一样）。TS 类型：`Array<TdStepItemProps>` | N
sequence | String | positive | 步骤条顺序。可选值：positive/reverse | N
status | String | process | 步骤状态。可选值：wait/process/finish/error | N
theme | String | default | 步骤条风格。可选值：default/dot | N
onChange | Function |  | 当前步骤发生变化时触发。`(current: string | number, previous: string | number) => {}` | N


### StepItem Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
content | TNode | - | 步骤描述。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
extra | TNode | - | 显示在步骤描述下方的额外内容，比如：操作项。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
icon | TNode | true | 图标，默认显示内置图标，也可以自定义图标。TS 类型：`boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
status | String | default | 当前步骤的状态。可选值：default/wait/process/finish/error。TS 类型：`StepStatus`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/steps/index.ts) | N
title | TNode | - | 标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
value | String / Number | - | 当前步骤值 | N