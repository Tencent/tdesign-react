:: BASE_DOC ::

## API
### DialogCard Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
`Pick<DialogProps, 'body' \| 'cancelBtn' \| 'closeBtn' \| 'confirmBtn' \| 'footer' \| 'header' \| 'theme' \| 'onCancel' \| 'onCloseBtnClick' \| 'onConfirm'>` | TNode | - | extends `Pick<DialogProps, 'body' \| 'cancelBtn' \| 'closeBtn' \| 'confirmBtn' \| 'footer' \| 'header' \| 'theme' \| 'onCancel' \| 'onCloseBtnClick' \| 'onConfirm'>`。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N


### Dialog Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
attach | String / Function | - | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
body | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
cancelBtn | TNode | - | Typescript：`string \| ButtonProps \| TNode \| null`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dialog/type.ts) | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeBtn | TNode | true | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeOnEscKeydown | Boolean | true | trigger dialog close event on `ESC` keydown | N
closeOnOverlayClick | Boolean | true | \- | N
confirmBtn | TNode | - | Typescript：`string \| ButtonProps \| TNode \| null`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
confirmLoading | Boolean | undefined | confirm button loading status | N
confirmOnEnter | Boolean | - | confirm on enter | N
destroyOnClose | Boolean | false | \- | N
dialogClassName | String | - | \- | N
draggable | Boolean | false | \- | N
footer | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
forceRender | Boolean | false | to force render Dialog | N
header | TNode | true | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
mode | String | modal | options: modal/modeless/full-screen | N
placement | String | top | options: top/center | N
preventScrollThrough | Boolean | true | \- | N
showInAttachedElement | Boolean | false | \- | N
showOverlay | Boolean | true | \- | N
theme | String | default | options: default/info/warning/danger/success | N
top | String / Number | - | \- | N
visible | Boolean | - | \- | N
width | String / Number | - | \- | N
zIndex | Number | - | \- | N
onBeforeClose | Function |  | Typescript：`() => void`<br/> | N
onBeforeOpen | Function |  | Typescript：`() => void`<br/> | N
onCancel | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript：`(context: DialogCloseContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dialog/type.ts)。<br/>`type DialogEventSource = 'esc' \| 'close-btn' \| 'cancel' \| 'overlay'`<br/><br/>`interface DialogCloseContext { trigger: DialogEventSource; e: MouseEvent \| KeyboardEvent }`<br/> | N
onCloseBtnClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onClosed | Function |  | Typescript：`() => void`<br/> | N
onConfirm | Function |  | Typescript：`(context: { e: MouseEvent \| KeyboardEvent }) => void`<br/> | N
onEscKeydown | Function |  | Typescript：`(context: { e: KeyboardEvent }) => void`<br/> | N
onOpened | Function |  | Typescript：`() => void`<br/> | N
onOverlayClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### DialogOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
className | String | - | \- | N
style | Object | - | Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
`Omit<DialogProps, 'attach'>` | \- | - | extends `Omit<DialogProps, 'attach'>` | N

### DialogInstance

name | params | return | description
-- | -- | -- | --
destroy | \- | \- | required
hide | \- | \- | required
setConfirmLoading | `(loading: boolean)` | \- | required。set confirm button loading status
show | \- | \- | required
update | `(props: DialogOptions)` | \- | required

### dialog 或 DialogPlugin

name | params | default | description
-- | -- | -- | --
options | \- | - | Typescript：`DialogOptions`

插件返回值：`DialogInstance`

### dialog.confirm 或 DialogPlugin.confirm

name | params | default | description
-- | -- | -- | --
options | \- | - | Typescript：`DialogOptions`

### dialog.alert 或 DialogPlugin.alert

name | params | default | description
-- | -- | -- | --
options | Object | - | Typescript：`Omit<DialogOptions, 'cancelBtn'>`
