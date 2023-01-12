:: BASE_DOC ::

## API

### Calendar Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
cell | TNode | - | Typescript：`string \| TNode<CalendarCell>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
cellAppend | TNode | - | Typescript：`string \| TNode<CalendarCell>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
controllerConfig | Boolean / Object | - | Typescript：`boolean \| CalendarController` | N
fillWithZero | Boolean | true | \- | N
firstDayOfWeek | Number | 1 | options：1/2/3/4/5/6/7 | N
format | String | 'YYYY-MM-DD' | \- | N
head | TNode | - | Typescript：`string \| TNode<ControllerOptions>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
isShowWeekendDefault | Boolean | true | \- | N
mode | String | month | options：month/year | N
month | String / Number | - | \- | N
preventCellContextmenu | Boolean | false | \- | N
range | Array | - | Typescript：`Array<CalendarValue>` | N
theme | String | full | options：full/card | N
value | String / Date | - | Typescript：`CalendarValue` `type CalendarValue = string \| Date`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts) | N
week | TNode | - | Typescript：`Array<string> \| TNode<CalendarWeek>` `interface CalendarWeek { day: WeekDay }` `type WeekDay = 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts) | N
year | String / Number | - | \- | N
onCellClick | Function |  | Typescript：`(options: { cell: CalendarCell; e: MouseEvent }) => void`<br/> | N
onCellDoubleClick | Function |  | Typescript：`(options: { cell: CalendarCell; e: MouseEvent }) => void`<br/> | N
onCellRightClick | Function |  | Typescript：`(options: { cell: CalendarCell; e: MouseEvent }) => void`<br/> | N
onControllerChange | Function |  | Typescript：`(options: ControllerOptions) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts)。<br/>`interface ControllerOptions { filterDate: Date; formattedFilterDate: string; mode: string; isShowWeekend: boolean }`<br/> | N
onMonthChange | Function |  | Typescript：`(options: { month: string; year: string }) => void`<br/> | N

### CalendarController

name | type | default | description | required
-- | -- | -- | -- | --
current | Object | - | Typescript：`{ visible?: boolean; currentDayButtonProps?: ButtonProps; currentMonthButtonProps?: ButtonProps }` | N
disabled | Boolean | false | \- | N
mode | Object | - | Typescript：`{ visible?: boolean; radioGroupProps?: RadioGroupProps }`，[Radio API Documents](./radio?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts) | N
month | Object | - | Typescript：`{ visible?: boolean; selectProps?: SelectProps }` | N
weekend | Object | - | Typescript：`{ visible?: boolean; showWeekendButtonProps?: CheckTagProps; hideWeekendButtonProps?: CheckTagProps }`，[Tag API Documents](./tag?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts) | N
year | Object | - | Typescript：`{ visible?: boolean; selectProps?: SelectProps }`，[Select API Documents](./select?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/calendar/type.ts) | N

### CalendarCell

name | type | default | description | required
-- | -- | -- | -- | --
belongTo | Number | - | \- | N
date | Object | - | Typescript：`Date` | N
day | Number | - | \- | N
formattedDate | String | - | \- | N
isCurrent | Boolean | - | \- | N
weekOrder | Number | - | \- | N
`ControllerOptions` | \- | - | \- | N
