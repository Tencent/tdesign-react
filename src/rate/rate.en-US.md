:: BASE_DOC ::

## API

### Rate Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
allowHalf | Boolean | false | \- | N
color | String / Array | '#ED7B2F' | Typescript：`string | Array<string>` | N
count | Number | 5 | \- | N
disabled | Boolean | false | \- | N
gap | Number | 8 | \- | N
icon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
showText | Boolean | false | \- | N
size | String | - | \- | N
texts | Array | [] | Typescript：`Array<string>` | N
value | Number | 0 | \- | N
defaultValue | Number | 0 | uncontrolled property | N
onChange | Function |  | TS 类型：`(value: number) => void`<br/> | N
