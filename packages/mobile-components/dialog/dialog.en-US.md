:: BASE_DOC ::

## API

### Dialog Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
actions | TNode | - | Typescript: `Array<ButtonProps>`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
buttonLayout | String | horizontal | options: horizontal/vertical | N
cancelBtn | TNode | - | Typescript: `string \| ButtonProps \| TNode \| null`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
closeBtn | Boolean | false | \- | N
closeOnOverlayClick | Boolean | false | \- | N
confirmBtn | TNode | - | Typescript: `string \| ButtonProps \| TNode \| null`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
destroyOnClose | Boolean | false | \- | N
middle | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
overlayProps | Object | {} | Typescript: `OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
preventScrollThrough | Boolean | true | \- | N
showOverlay | Boolean | true | \- | N
title | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
top | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
visible | Boolean | - | \- | N
width | String / Number | - | \- | N
zIndex | Number | - | \- | N
onCancel | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript: `(context: DialogCloseContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts)。<br/>`type DialogEventSource = 'cancel' \| 'overlay' \| 'close-btn'`<br/><br/>`interface DialogCloseContext { trigger: DialogEventSource; e: MouseEvent }`<br/> | N
onClosed | Function |  | Typescript: `() => void`<br/> | N
onConfirm | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onOverlayClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N

### DialogOptions

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | \- | N
style | Object | - | Typescript: `Styles`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`Omit<DialogProps, 'attach'>` | \- | - | extends `Omit<DialogProps, 'attach'>` | N

### DialogInstance

name | params | return | description
-- | -- | -- | --
destroy | \- | \- | required
hide | \- | \- | required
show | \- | \- | required
update | `(props: DialogOptions)` | \- | required

### dialog 或 DialogPlugin

name | params | default | description
-- | -- | -- | --
options | \- | - | Typescript: `DialogOptions`

### dialog.confirm 或 DialogPlugin.confirm

name | params | default | description
-- | -- | -- | --
options | \- | - | Typescript: `DialogOptions`

### dialog.alert 或 DialogPlugin.alert

name | params | default | description
-- | -- | -- | --
options | Object | - | Typescript: `Omit<DialogOptions, 'cancelBtn'>`

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-dialog-body-max-height | 456px | -
--td-dialog-border-radius | @radius-extraLarge | -
--td-dialog-close-color | @text-color-placeholder | -
--td-dialog-close-icon-size | 22px | -
--td-dialog-content-color | @text-color-secondary | -
--td-dialog-content-font | @font-body-large | -
--td-dialog-title-color | @text-color-primary | -
--td-dialog-title-font | @font-title-large | -
--td-dialog-width | 311px | -
