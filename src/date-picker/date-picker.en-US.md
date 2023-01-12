:: BASE_DOC ::

## API
### DatePicker Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
allowInput | Boolean | false | \- | N
clearable | Boolean | false | \- | N
disableDate | Object / Array / Function | - | Typescript：`DisableDate` `type DisableDate = Array<DateValue> \| DisableDateObj \| ((date: DateValue) => boolean)` `interface DisableDateObj { from?: string; to?: string; before?: string; after?: string }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
disabled | Boolean | - | make DatePicker to be disabled | N
enableTimePicker | Boolean | false | \- | N
firstDayOfWeek | Number | 7 | options：1/2/3/4/5/6/7 | N
format | String | 'YYYY-MM-DD' | \- | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
mode | String | date | options：year/quarter/month/week/date | N
placeholder | String / Array | undefined | Typescript：`string` | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
presets | Object | - | Typescript：`PresetDate` `interface PresetDate { [name: string]: DateValue \| (() => DateValue) }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
presetsPlacement | String | bottom | options：left/top/right/bottom | N
status | String | - | options：default/success/warning/error | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
timePickerProps | Object | - | Typescript：`TimePickerProps`，[TimePicker API Documents](./time-picker?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number / Array / Date | '' | Typescript：`DateValue` `type DateValue = string \| number \| Date`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
defaultValue | String / Number / Array / Date | '' | uncontrolled property。Typescript：`DateValue` `type DateValue = string \| number \| Date`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
valueType | String | - | options：'time-stamp' | 'Date' | 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss:SSS' | N
onBlur | Function |  | Typescript：`(context: { value: DateValue; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: DateValue, context: { dayjsValue?: Dayjs, trigger?: DatePickerTriggerSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/><br/>`type DatePickerTriggerSource = 'confirm' \| 'pick' \| 'enter' \| 'preset' \| 'clear'`<br/> | N
onFocus | Function |  | Typescript：`(context: { value: DateValue; e: FocusEvent }) => void`<br/> | N
onPick | Function |  | Typescript：`(value: DateValue) => void`<br/> | N

### DateRangePicker Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
allowInput | Boolean | false | \- | N
clearable | Boolean | false | \- | N
disableDate | Object / Array / Function | - | Typescript：`DisableRangeDate` `type DisableRangeDate = Array<DateValue> \| DisableDateObj \| ((context: { date: DateRangeValue; partial: DateRangePickerPartial }) => boolean)` `interface DisableDateObj { from?: string; to?: string; before?: string; after?: string }` `type DateRangePickerPartial = 'start' \| 'end'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
disabled | Boolean | - | \- | N
enableTimePicker | Boolean | false | \- | N
firstDayOfWeek | Number | - | options：1/2/3/4/5/6/7 | N
format | String | - | \- | N
mode | String | date | options：year/quarter/month/week/date | N
panelPreselection | Boolean | true | \- | N
placeholder | String / Array | - | Typescript：`string \| Array<string>` | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
presets | Object | - | Typescript：`PresetRange` `interface PresetRange { [range: string]: DateRange \| (() => DateRange)}` `type DateRange = [DateValue, DateValue]`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
presetsPlacement | String | bottom | options：left/top/right/bottom | N
rangeInputProps | Object | - | Typescript：`RangeInputProps`，[RangeInput API Documents](./range-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
separator | String | - | \- | N
status | String | - | options：default/success/warning/error | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
timePickerProps | Object | - | Typescript：`TimePickerProps`，[TimePicker API Documents](./time-picker?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | Array | [] | Typescript：`DateRangeValue` `type DateRangeValue = Array<DateValue>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript：`DateRangeValue` `type DateRangeValue = Array<DateValue>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts) | N
valueType | String | - | options：'time-stamp' | 'Date' | 'YYYY' | 'YYYY-MM' | 'YYYY-MM-DD' | 'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss:SSS' | N
onBlur | Function |  | Typescript：`(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: DateRangeValue, context: { dayjsValue?: Dayjs[], trigger?: DatePickerTriggerSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts)。<br/>`import { Dayjs } from 'dayjs'`<br/> | N
onFocus | Function |  | Typescript：`(context: { value: DateRangeValue; partial: DateRangePickerPartial; e: FocusEvent }) => void`<br/> | N
onInput | Function |  | Typescript：`(context: { input: string; value: DateRangeValue; partial: DateRangePickerPartial; e: InputEvent }) => void`<br/> | N
onPick | Function |  | Typescript：`(value: DateValue, context: PickContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/date-picker/type.ts)。<br/>`interface PickContext { e: MouseEvent; partial: DateRangePickerPartial }`<br/> | N

### DatePickerPanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
`Pick<DatePickerProps, 'value' \| 'defaultValue' \| 'disabled' \| 'disableDate' \| 'enableTimePicker' \| 'firstDayOfWeek' \| 'format' \| 'mode' \| 'presets' \| 'presetsPlacement' \| 'timePickerProps'>` | \- | - | \- | N

### DateRangePickerPanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
`Pick<DateRangePickerProps, 'value'\| 'defaultValue' \| 'disabled' \| 'disableDate' \| 'enableTimePicker' \| 'firstDayOfWeek' \| 'format' \| 'mode' \| 'presets' \| 'presetsPlacement' \| 'panelPreselection' \| 'timePickerProps'>` | \- | - | \- | N
