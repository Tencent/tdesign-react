:: BASE_DOC ::

## API

### Sticky Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
container | String / Function | body | Typescript: `ScrollContainer`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
offsetTop | String / Number | 0 | \- | N
zIndex | Number | 99 | \- | N
onScroll | Function |  | Typescript: `(context: { scrollTop: number, isFixed: boolean }) => void`<br/> | N
