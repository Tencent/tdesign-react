:: BASE_DOC ::

## API

### Rate Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
allowHalf | Boolean | false | \- | N
color | String / Array | '#ED7B2F' | Typescript: `string \| Array<string>` | N
count | Number | 5 | \- | N
disabled | Boolean | undefined | \- | N
gap | String / Number | 8 | \- | N
icon | TNode | - | Typescript: `Array<TNode \| Function>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
placement | String | top | options: top / bottom / '' | N
showText | Boolean | false | \- | N
size | String | 24px | \- | N
texts | Array | [] | Typescript: `Array<string>` | N
value | Number | 0 | \- | N
defaultValue | Number | 0 | uncontrolled property | N
onChange | Function |  | Typescript: `(value: number) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-rate-disabled-selected-color | @warning-color-3 | -
--td-rate-disabled-unselected-color | @gray-color-2 | -
--td-rate-icon-scale | 1.33 | -
--td-rate-selected-color | @warning-color | -
--td-rate-text-active-color | @text-color-primary | -
--td-rate-text-active-font-weight | 600 | -
--td-rate-text-color | @text-color-disabled | -
--td-rate-text-font-size | @font-size-m | -
--td-rate-unselected-color | @bg-color-secondarycomponent | -
