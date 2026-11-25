:: BASE_DOC ::

## API

### Picker Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
cancelBtn | String / Boolean | true | 取消按钮文字。TS 类型：`boolean \| string` | N
columns | Array / Function | [] | 必需。配置每一列的选项。TS 类型：`PickerColumn \| Array<PickerColumn> \| ((item: Array<PickerValue>) => Array<PickerColumn>)` `type PickerColumn = PickerColumnItem[]` `interface PickerColumnItem { label: string,value: string,disabled?: boolean}`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/picker/type.ts) | Y
confirmBtn | String / Boolean | true | 确定按钮文字。TS 类型：`boolean \| string` | N
footer | TElement | - | 底部内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
header | TElement | - | 自定义头部内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
keys | Object | - | 用来定义 value / label / disabled 在 `columns ` 中对应的字段别名。TS 类型：`KeysType`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
option | Function | - | 自定义选项内容。参数为 `option: PickerColumnItem, index: number`。TS 类型：`(option: PickerColumnItem, index: number) => string \| Record<string, string \| boolean>` | N
renderLabel | Function | - | 自定义label。TS 类型：`(item: PickerColumnItem, index: number) => string` | N
swipeDuration | String / Number | 300 | ⚠️ 即将废弃，请使用 `wheelConfig.inertiaDuration` 代替。快速滑动时惯性滚动的时长，单位 ms，为 0 时表示取消惯性滚动。TS 类型：`string \| number` | N
title | String | '' | 标题 | N
value | Array | - | 选中值。TS 类型：`Array<PickerValue>` `type PickerValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/picker/type.ts) | N
defaultValue | Array | - | 选中值。非受控属性。TS 类型：`Array<PickerValue>` `type PickerValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/picker/type.ts) | N
wheelConfig | Object | - | 【实验】滚轮滑动相关配置，用于自定义滚轮的动画和交互行为。`inertiaDuration` 表示惯性滚动的持续时长；`bounceDuration` 表示边界归位动画时长；`transitionDuration` 表示切换选项时的过渡动画时长； `inertiaTimeThreshold` 表示惯性触发的时间阈值； `inertiaDistanceThreshold` 表示惯性触发的距离阈值； `boundOffset` 表示边界偏移量；`clickDistanceThreshold` 表示点击操作的距离阈值；`clickTimeThreshold` 表示点击操作的时间阈值。TS 类型：`PickerWheelConfig` `interface PickerWheelConfig { inertiaDuration?: number; bounceDuration?: number; transitionDuration?: number; inertiaTimeThreshold?: number; inertiaDistanceThreshold?: number; boundOffset?: number; clickDistanceThreshold?: number; clickTimeThreshold?: number;}`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/picker/type.ts) | N
onCancel | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击取消按钮时触发 | N
onChange | Function |  | TS 类型：`(value: Array<PickerValue>, context: { columns: Array<PickerContext>, e: MouseEvent })  => void`<br/>选中变化时候触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/picker/type.ts)。<br/>`interface PickerContext{ column: number,index: number }`<br/> | N
onConfirm | Function |  | TS 类型：`(value: Array<PickerValue>, context: { index: number[], e: MouseEvent, label: string[] }) => void`<br/>点击确认按钮时触发 | N
onPick | Function |  | TS 类型：`(value: Array<PickerValue>, context: PickerContext) => void`<br/>任何一列选中都会触发，不同的列参数不同。`context.column` 表示第几列变化，`context.index` 表示变化那一列的选中项下标 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-picker-bg-color | @bg-color-container | -
--td-picker-border-radius | 12px | -
--td-picker-button-font | @font-body-large | -
--td-picker-cancel-color | @text-color-secondary | -
--td-picker-confirm-color | @brand-color | -
--td-picker-group-height | 200px | -
--td-picker-indicator-bg-color | @bg-color-secondarycontainer | -
--td-picker-indicator-border-radius | 6px | -
--td-picker-item-active-color | @text-color-primary | -
--td-picker-item-color | @text-color-secondary | -
--td-picker-item-disabled-color | @text-color-disabled | -
--td-picker-item-height | 40px | -
--td-picker-mask-color-bottom | hsla(0, 0%, 100%, 0.4) | -
--td-picker-mask-color-top | hsla(0, 0%, 100%, 0.92) | -
--td-picker-title-color | @text-color-primary | -
--td-picker-title-font | @font-title-large | -
--td-picker-toolbar-height | 58px | -
