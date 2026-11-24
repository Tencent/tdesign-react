:: BASE_DOC ::

## API

### ActionSheet Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
align | String | center | options: center/left | N
cancelText | String | - | \- | N
count | Number | 8 | \- | N
description | String | - | \- | N
items | Array | - | Typescript: `Array<string \| ActionSheetItem>` `interface ActionSheetItem { label: string; description?: string; color?: string; disabled?: boolean; icon?: string \| TNode; suffixIcon?: TNode; badge?: BadgeProps }`，[Badge API Documents](./badge?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/action-sheet/type.ts) | N
popupProps | Object | {} | Typescript: `PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/action-sheet/type.ts) | N
showCancel | Boolean | true | \- | N
showOverlay | Boolean | true | \- | N
theme | String | list | options: list/grid | N
visible | Boolean | false | \- | N
defaultVisible | Boolean | false | uncontrolled property | N
onCancel | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript: `(trigger: ActionSheetTriggerSource) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/action-sheet/type.ts)。<br/>`type ActionSheetTriggerSource = 'overlay' \| 'command' \| 'select' `<br/> | N
onSelected | Function |  | Typescript: `(selected: ActionSheetItem \| string, index: number) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-action-sheet-border-color | @component-stroke | -
--td-action-sheet-border-radius | @radius-extraLarge | -
--td-action-sheet-cancel-color | @text-color-primary | -
--td-action-sheet-color | @text-color-primary | -
--td-action-sheet-description-color | @text-color-placeholder | -
--td-action-sheet-description-font | @font-body-medium | -
--td-action-sheet-disabled-color | @text-color-disabled | -
--td-action-sheet-dot-active-color | @brand-color | -
--td-action-sheet-dot-color | @text-color-disabled | -
--td-action-sheet-dot-size | 8px | -
--td-action-sheet-gap-color | @bg-color-page | -
--td-action-sheet-max-height | 54% | -
