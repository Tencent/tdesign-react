:: BASE_DOC ::

## API

### BackTop Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
container | Function | - | Typescript: `() => HTMLElement` | N
fixed | Boolean | true | \- | N
icon | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
target | Function | - | Typescript: `() => HTMLElement` | N
text | String | '' | \- | N
theme | String | round | options: round/half-round/round-dark/half-round-dark | N
visibilityHeight | Number | 200 | \- | N
onToTop | Function |  | Typescript: `() => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-back-top-half-round-border-radius | @radius-round | -
--td-back-top-round-bg-color | @font-white-1 | -
--td-back-top-round-border-color | @component-border | -
--td-back-top-round-border-radius | @radius-circle | -
--td-back-top-round-color | @font-gray-1 | -
--td-back-top-round-dark-bg-color | @gray-color-14 | -
--td-back-top-round-dark-color | @font-white-1 | -
