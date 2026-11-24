:: BASE_DOC ::

## API

### QRCode Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
bgColor | String | - | QR code background color | N
borderless | Boolean | false | Is there a border | N
color | String | - | QR code color | N
icon | String | - | The address of the picture in the QR code | N
iconSize | Number / Object | 40 | The size of the picture in the QR code。Typescript: `number \| { width: number; height: number }` | N
level | String | M | QR code error correction level。options: L/M/Q/H | N
size | Number | 160 | QR code size | N
status | String | active | QR code status。options: active/expired/loading/scanned。Typescript: `QRStatus` `type QRStatus = "active" \| "expired" \| "loading" \| "scanned"`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/qrcode/type.ts) | N
statusRender | TElement | - | Custom state renderer。Typescript: `(info:StatusRenderInfo) => TNode` `type StatusRenderInfo = {status:QRStatus;onRefresh?: () => void;}`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/qrcode/type.ts) | N
type | String | canvas | render type。options: canvas/svg | N
value | String | - | scanned text | N
onRefresh | Function |  | Typescript: `() => void`<br/>Click the "Click to refresh" callback | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description 
-- | -- | --
--td-brand-color-hover | --td-brand-color-hover | -
--td-font-size-title-small | --td-font-size-title-small | -
--td-success-color | --td-success-color | -
