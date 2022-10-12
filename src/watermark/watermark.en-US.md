:: BASE_DOC ::

## API

### Watermark Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
alpha | Number | 1 | \- | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
height | Number | - | \- | N
isRepeat | Boolean | true | \- | N
lineSpace | Number | 16 | \- | N
movable | Boolean | false | \- | N
moveInterval | Number | 3000 | \- | N
offset | Array | - | Typescript：`Array<number>` | N
removable | Boolean | true | \- | N
rotate | Number | -22 | \- | N
watermarkContent | Object / Array | - | Typescript：`WatermarkText\|WatermarkImage\|Array<WatermarkText\|WatermarkImage>` | N
width | Number | - | \- | N
x | Number | - | \- | N
y | Number | - | \- | N
zIndex | Number | - | \- | N

### WatermarkText

name | type | default | description | required
-- | -- | -- | -- | --
fontColor | String | rgba(0,0,0,0.1) | \- | N
fontSize | Number | 16 | \- | N
fontWeight | String | normal | options：normal/lighter/bold/bolder | N
text | String | - | \- | N

### WatermarkImage

name | type | default | description | required
-- | -- | -- | -- | --
isGrayscale | Boolean | false | \- | N
url | String | - | \- | N
