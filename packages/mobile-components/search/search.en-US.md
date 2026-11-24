:: BASE_DOC ::

## API

### Search Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
action | TNode | '' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
autocompleteOptions | Array | - | autocomplete words list。Typescript: `Array<AutocompleteOption>` `type AutocompleteOption = string \| { label: string \| TNode; group?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/search/type.ts) | N
center | Boolean | false | \- | N
clearTrigger | String | always | show clear icon, clicked to clear input value。options: always / focus | N
clearable | Boolean | true | \- | N
cursorColor | String | #0052d9 | `0.21.2` | N
disabled | Boolean | false | \- | N
focus | Boolean | false | \- | N
leftIcon | TNode | 'search' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxcharacter | Number | - | The maximum number of characters that the user can enter. One Chinese character represents two characters in length. Use either `maxcharacter` or `maxlength` | N
maxlength | String / Number | - | The maximum length of text that the user can enter. One Chinese character is equal to one count length. By default, it is empty, and the input length is not limited. Use either `maxcharacter` or `maxlength` | N
placeholder | String | '' | \- | N
readonly | Boolean | undefined | \- | N
resultList | Array | [] | Typescript: `Array<string>` | N
shape | String | 'square' | options: square/round | N
suffixIcon | TElement | - | `deprecated`。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
value | String | - | \- | N
defaultValue | String | - | uncontrolled property | N
onActionClick | Function |  | Typescript: `({}) => void`<br/> | N
onBlur | Function |  | Typescript: `(context: { value: string; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: string, context: { trigger: 'input-change' \| 'option-click' \| 'clear'; e?: InputEvent \| MouseEvent }) => void`<br/> | N
onClear | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onFocus | Function |  | Typescript: `(context: { value: string; e: FocusEvent }) => void`<br/> | N
onSearch | Function |  | Typescript: `(context?: { value: string; trigger: 'submit' \| 'option-click' \| 'clear'; e?: InputEvent \| MouseEvent }) => void`<br/> | N
onSubmit | Function |  | Typescript: `(context: { value: string; e: KeyboardEvent }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-search-action-color | @brand-color | -
--td-search-bg-color | @bg-color-secondarycontainer | -
--td-search-clear-icon-color | @text-color-placeholder | -
--td-search-clear-icon-size | 24px | -
--td-search-cursor-color | @brand-color | -
--td-search-font | @font-body-large | -
--td-search-height | 40px | -
--td-search-icon-color | @text-color-placeholder | -
--td-search-icon-size | 24px | -
--td-search-label-color | @text-color-primary | -
--td-search-padding | 8px 12px | -
--td-search-placeholder-color | @text-color-placeholder | -
--td-search-result-high-light-color | @brand-color | -
--td-search-square-radius | @radius-default | -
--td-search-text-color | @text-color-primary | -
