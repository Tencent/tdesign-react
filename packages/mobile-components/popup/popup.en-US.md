:: BASE_DOC ::

## API

### Popup Props

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript: `AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeBtn | TNode | - | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeOnOverlayClick | Boolean | true | \- | N
destroyOnClose | Boolean | false | \- | N
duration | Number | 240 | \- | N
overlayProps | Object | {} | Typescript: `OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/popup/type.ts) | N
placement | String | top | options: top/left/right/bottom/center | N
preventScrollThrough | Boolean | true | \- | N
showOverlay | Boolean | true | \- | N
visible | Boolean | - | Typescript: `boolean` | N
defaultVisible | Boolean | - | uncontrolled property。Typescript: `boolean` | N
zIndex | Number | - | \- | N
onClose | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClosed | Function |  | Typescript: `() => void`<br/> | N
onOpen | Function |  | Typescript: `() => void`<br/> | N
onOpened | Function |  | Typescript: `() => void`<br/> | N
onVisibleChange | Function |  | Typescript: `(visible: boolean, trigger: PopupSource)  => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/popup/type.ts)。<br/>`type PopupSource = 'close-btn' \| 'overlay' \| 'document'`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-popup-bg-color | @bg-color-container | -
--td-popup-border-radius | @radius-extraLarge | -
--td-popup-close-btn-color | @text-color-primary | -
