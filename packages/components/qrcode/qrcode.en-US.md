:: BASE_DOC ::

## API

### QRCode Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
bgColor | String | transparent | QR code background color | N
borderless | Boolean | false | Is there a border | N
color | String | - | QR code color | N
icon | TNode | - | The address or custom icon of the picture in the QR code。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
iconSize | Number / Object | 40 | The size of the picture in the QR code。Typescript：`number \| { width: number; height: number }` | N
level | String | M | QR code error correction level。options: L/M/Q/H | N
size | Number | 160 | QR code size | N
status | String | active | QR code status。options: active/expired/loading/scanned。Typescript：`QRStatus` `type QRStatus = "active" \| "expired" \| "loading" \| "scanned"`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/qrcode/type.ts) | N
statusRender | TElement | - | Custom state renderer。Typescript：`(info:StatusRenderInfo) => TNode` `type StatusRenderInfo = {status:QRStatus;onRefresh?: () => void;}`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/qrcode/type.ts) | N
type | String | canvas | render type。options: canvas/svg | N
value | String | - | scanned text | N
onRefresh | Function |  | Typescript：`() => void`<br/>Click the "Click to refresh" callback | N
