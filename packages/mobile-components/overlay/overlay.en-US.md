:: BASE_DOC ::

## API

### Overlay Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
backgroundColor | String | - | \- | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
duration | Number | 300 | \- | N
preventScrollThrough | Boolean | true | \- | N
visible | Boolean | false | \- | N
zIndex | Number | - | \- | N
onClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript: `() => void`<br/> | N
onClosed | Function |  | Typescript: `() => void`<br/> | N
onOpen | Function |  | Typescript: `() => void`<br/> | N
onOpened | Function |  | Typescript: `() => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-overlay-bg-color | @mask-active | -
--td-overlay-zIndex | @z-index-overlay | -
