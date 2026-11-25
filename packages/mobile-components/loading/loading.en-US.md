:: BASE_DOC ::

## API

### Loading Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
attach | String / Function | '' | Typescript: `AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
delay | Number | 0 | \- | N
duration | Number | 800 | \- | N
fullscreen | Boolean | false | \- | N
indicator | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
inheritColor | Boolean | false | \- | N
layout | String | horizontal | options: horizontal/vertical | N
loading | Boolean | true | \- | N
pause | Boolean | false | \- | N
preventScrollThrough | Boolean | true | \- | N
reverse | Boolean | - | \- | N
size | String | '20px' | \- | N
text | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
theme | String | circular | options: circular/spinner/dots | N

### loading 或 LoadingPlugin

name | params | default | description
-- | -- | -- | --
options | Function | - | required。Typescript: `boolean \| TdLoadingProps`

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-loading-color | @brand-color | -
--td-loading-full-bg-color | rgba(255, 255, 255, 60%) | -
--td-loading-line-bg-color | @text-color-primary | -
--td-loading-text-color | @text-color-primary | -
--td-loading-text-font | @font-body-small | -
--td-loading-z-index | @z-index-loading | -
