:: BASE_DOC ::

## API
### TreeSelect Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
autoWidth | Boolean | false | \- | N
autofocus | Boolean | false | \- | N
borderless | Boolean | false | \- | N
clearable | Boolean | false | \- | N
collapsedItems | TElement | - | Typescript：`TNode<{ value: DataOption[]; collapsedSelectedItems: DataOption[]; count: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
data | Array | [] | Typescript：`Array<DataOption>` | N
disabled | Boolean | - | \- | N
empty | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
filter | Function | - | Typescript：`(filterWords: string, option: DataOption) => boolean` | N
filterable | Boolean | false | \- | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
inputValue | String / Number | - | input value。Typescript：`InputValue`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
defaultInputValue | String / Number | - | input value。uncontrolled property。Typescript：`InputValue`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
keys | Object | - | Typescript：`TreeKeysType`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loading | Boolean | false | \- | N
loadingText | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
max | Number | 0 | \- | N
minCollapsedNum | Number | 0 | \- | N
multiple | Boolean | false | \- | N
panelBottomContent | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
panelTopContent | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
placeholder | String | undefined | \- | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
popupVisible | Boolean | undefined | show popup | N
defaultPopupVisible | Boolean | undefined | show popup。uncontrolled property | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
readonly | Boolean | false | \- | N
reserveKeyword | Boolean | false | \- | N
selectInputProps | Object | - | Typescript：`SelectInputProps`，[SelectInput API Documents](./select-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
size | String | medium | options：small/medium/large | N
status | String | default | options：default/success/warning/error | N
suffix | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tagProps | Object | - | Typescript：`TagProps`，[Tag API Documents](./tag?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
treeProps | Object | - | Typescript：`TreeProps`，[Tree API Documents](./tree?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
value | String / Number / Object / Array | - | Typescript：`TreeValueType` `type TreeSelectValue = string \| number \| TreeOptionData \| Array<string \| number \| TreeOptionData>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
defaultValue | String / Number / Object / Array | - | uncontrolled property。Typescript：`TreeValueType` `type TreeSelectValue = string \| number \| TreeOptionData \| Array<string \| number \| TreeOptionData>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts) | N
valueDisplay | TElement | - | Typescript：`string \| TNode<{ value: TreeOptionData \| TreeOptionData[]; onClose: (index: number) => void }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
valueType | String | value | options：value/object | N
onBlur | Function |  | Typescript：`(context: SelectInputBlurContext & { value: TreeSelectValue }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: TreeValueType, context: TreeSelectChangeContext<DataOption>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts)。<br/>`interface TreeSelectChangeContext<DataOption> { node: TreeNodeModel<DataOption>; data: DataOption; index?: number; trigger: TreeSelectValueChangeTrigger; e?: MouseEvent \| KeyboardEvent \| Event }`<br/><br/>`type TreeSelectValueChangeTrigger = 'clear' \| 'tag-remove' \| 'backspace' \| 'check' \| 'uncheck'`<br/> | N
onClear | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onEnter | Function |  | Typescript：`(context: { inputValue: string; e: KeyboardEvent; value: TreeValueType }) => void`<br/> | N
onFocus | Function |  | Typescript：`(context: { value: TreeSelectValue; e: FocusEvent }) => void`<br/> | N
onInputChange | Function |  | Typescript：`(value: InputValue, context: SelectInputValueChangeContext) => void`<br/> | N
onPopupVisibleChange | Function |  | Typescript：`(visible: boolean, context: TreeSelectPopupVisibleContext<DataOption>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts)。<br/>`import { PopupVisibleChangeContext, PopupTriggerEvent, PopupTriggerSource } from '@Popup'`<br/><br/>`interface TreeSelectPopupVisibleContext<T> {   e?: PopupTriggerEvent \| Event;   node?: TreeNodeModel<T>;   trigger?: PopupTriggerSource \| 'clear'; }`<br/> | N
onRemove | Function |  | Typescript：`(options: RemoveOptions<DataOption, TreeValueType>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tree-select/type.ts)。<br/>`export interface RemoveOptions<T extends TreeOptionData = TreeOptionData, N extends TreeSelectValue = TreeSelectValue> {   value: N;   data: T;  index: number; node: TreeNodeModel<T>;   e?: MouseEvent \| KeyboardEvent;   trigger: 'tag-remove' \| 'backspace'; }`<br/> | N
onSearch | Function |  | Typescript：`(filterWords: string, context: { e: KeyboardEvent \| SelectInputValueChangeContext['e'] }) => void`<br/> | N
