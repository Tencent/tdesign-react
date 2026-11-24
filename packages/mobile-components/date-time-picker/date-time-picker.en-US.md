:: BASE_DOC ::

## API

### DateTimePicker Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
cancelBtn | String | - | \- | N
confirmBtn | String | - | \- | N
end | String / Number | - | \- | N
filter | Function | - | Typescript: `(type: TimeModeValues, columns: DateTimePickerColumn) => DateTimePickerColumn` `type DateTimePickerColumn = DateTimePickerColumnItem[]` `interface DateTimePickerColumnItem { label: string,value: string}`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/date-time-picker/type.ts) | N
footer | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
format | String | 'YYYY-MM-DD HH:mm:ss' | \- | N
header | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
mode | String / Array | 'date' | Typescript: `DateTimePickerMode` `type DateTimePickerMode = TimeModeValues \| Array<TimeModeValues> ` `type TimeModeValues = 'year' \| 'month' \| 'date' \| 'hour' \| 'minute' \| 'second'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/date-time-picker/type.ts) | N
renderLabel | Function | - | Typescript: `(type: string, value: number) => string` | N
showWeek | Boolean | false | \- | N
start | String / Number | - | \- | N
steps | Object | {} | Typescript: `{ [key in TimeModeValues]?: number }` | N
title | String | - | title of picker | N
value | String / Number | - | Typescript: `DateValue` `type DateValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/date-time-picker/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript: `DateValue` `type DateValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/date-time-picker/type.ts) | N
onCancel | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: DateValue) => void`<br/> | N
onClose | Function |  | Typescript: `(trigger: TriggerSource) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/date-time-picker/type.ts)。<br/>`type TriggerSource = 'overlay' \| 'cancel-btn' \| 'confirm-btn'`<br/> | N
onConfirm | Function |  | Typescript: `(value: DateValue) => void`<br/> | N
onPick | Function |  | Typescript: `(value: DateValue) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-data-time-picker-year-width | 64px | -
