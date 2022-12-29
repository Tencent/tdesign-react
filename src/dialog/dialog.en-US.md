:: BASE_DOC ::

## API
### DialogCard Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
body | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
cancelBtn | TNode | - | Typescript：`string \| ButtonProps \| TNode \| null`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dialog/type.ts) | N
closeBtn | TNode | true | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
confirmBtn | TNode | - | Typescript：`string \| ButtonProps \| TNode \| null`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
footer | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
header | TNode | true | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | default | options：default/info/warning/danger/success | N
onCancel | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onCloseBtnClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onConfirm | Function |  | Typescript：`(context: { e: MouseEvent \| KeyboardEvent }) => void`<br/> | N

### Dialog Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
attach | String / Function | - | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeOnEscKeydown | Boolean | true | \- | N
closeOnOverlayClick | Boolean | true | \- | N
confirmOnEnter | Boolean | - | confirm on enter | N
destroyOnClose | Boolean | false | \- | N
draggable | Boolean | false | \- | N
mode | String | modal | options：modal/modeless/full-screen | N
placement | String | top | options：top/center | N
preventScrollThrough | Boolean | true | \- | N
showInAttachedElement | Boolean | false | \- | N
showOverlay | Boolean | true | \- | N
top | String / Number | - | \- | N
visible | Boolean | - | \- | N
width | String / Number | - | \- | N
zIndex | Number | - | \- | N
`DialogCardProps` | \- | - | \- | N
onClose | Function |  | Typescript：`(context: DialogCloseContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dialog/type.ts)。<br/>`type DialogEventSource = 'esc' \| 'close-btn' \| 'cancel' \| 'overlay'`<br/><br/>`interface DialogCloseContext { trigger: DialogEventSource; e: MouseEvent \| KeyboardEvent }`<br/> | N
onClosed | Function |  | Typescript：`() => void`<br/> | N
onEscKeydown | Function |  | Typescript：`(context: { e: KeyboardEvent }) => void`<br/> | N
onOpened | Function |  | Typescript：`() => void`<br/> | N
onOverlayClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### DialogOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
className | String | - | \- | N
style | Object | - | Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
`Omit<DialogProps, 'attach'>` | \- | - | \- | N

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
