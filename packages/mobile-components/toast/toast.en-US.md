:: BASE_DOC ::

## API

### Toast Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
direction | String | row | options: row/column | N
duration | Number | 2000 | \- | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
message | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
overlayProps | Object | - | Typescript: `OverlayProps `，[Overlay API Documents](./overlay?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/toast/type.ts) | N
placement | String | middle | options:  top/middle/bottom | N
preventScrollThrough | Boolean | false | \- | N
showOverlay | Boolean | false | \- | N
theme | String | - | options: loading/success/warning/error | N
onClose | Function |  | Typescript: `() => void`<br/> | N
onDestroy | Function |  | Typescript: `() => void`<br/> | N

### ToastOptions

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript: `AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
className | String | - | \- | N
style | Object | - | Typescript: `Styles`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`ToastProps` | \- | - | extends `ToastProps` | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-toast-bg-color | @mask-active | -
--td-toast-color | @text-color-anti | -
--td-toast-column-icon-size | 32px | -
--td-toast-max-width | 185px | -
--td-toast-radius | @radius-default | -
--td-toast-row-icon-size | 24px | -
