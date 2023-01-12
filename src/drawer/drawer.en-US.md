:: BASE_DOC ::

## API
### Drawer Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
attach | String / Function | - | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
body | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
cancelBtn | TNode | - | Typescript：`FooterButton` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeBtn | TNode | - | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
closeOnEscKeydown | Boolean | true | \- | N
closeOnOverlayClick | Boolean | true | \- | N
confirmBtn | TNode | - | Typescript：`FooterButton` `type FooterButton = string \| ButtonProps \| TNode`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/drawer/type.ts) | N
destroyOnClose | Boolean | false | \- | N
footer | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
header | TNode | true | Typescript：`string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
mode | String | overlay | options：overlay/push | N
placement | String | right | options：left/right/top/bottom | N
preventScrollThrough | Boolean | true | \- | N
showInAttachedElement | Boolean | false | \- | N
showOverlay | Boolean | true | \- | N
size | String | 'small' | \- | N
sizeDraggable | Boolean | false | \- | N
visible | Boolean | false | \- | N
zIndex | Number | - | \- | N
onCancel | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript：`(context: DrawerCloseContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/drawer/type.ts)。<br/>`type DrawerEventSource = 'esc' \| 'close-btn' \| 'cancel' \| 'overlay'`<br/><br/>`interface DrawerCloseContext { trigger: DrawerEventSource; e: MouseEvent \| KeyboardEvent }`<br/> | N
onCloseBtnClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onConfirm | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onEscKeydown | Function |  | Typescript：`(context: { e: KeyboardEvent }) => void`<br/> | N
onOverlayClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### DrawerOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
className | String | - | \- | N
style | Object | - | Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
`Omit<DrawerProps, 'attach'>` | \- | - | \- | N

### DrawerInstance

name | params | return | description
-- | -- | -- | --
destroy | \- | \- | \-
hide | \- | \- | \-
show | \- | \- | \-
update | `(props: DrawerOptions)` | \- | \-

### drawer 或 DrawerPlugin

name | params | default | description
-- | -- | -- | --
options | \- | - | Typescript：`DrawerOptions`
