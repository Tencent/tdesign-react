:: BASE_DOC ::

## API

### Skeleton Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
animation | String | none | options: gradient/flashed/none | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
delay | Number | 0 | \- | N
loading | Boolean | true | \- | N
rowCol | Array | - | Typescript: `SkeletonRowCol` `type SkeletonRowCol = Array<number \| SkeletonRowColObj \| Array<SkeletonRowColObj>>` `interface SkeletonRowColObj { width?: string; height?: string; size?: string; marginRight?: string; marginLeft?: string; margin?: string; content?: string \| TNode; type?: 'rect' \| 'circle' \| 'text' }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/skeleton/type.ts) | N
theme | String | text | options: avatar/image/text/paragraph | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-skeleton-animation-flashed | rgba(90%, 90%, 90%, 0.3) | -
--td-skeleton-animation-gradient | @text-color-placeholder | -
--td-skeleton-bg-color | @bg-color-secondarycontainer | -
--td-skeleton-circle-border-radius | @radius-circle | -
--td-skeleton-circle-height | 48px | -
--td-skeleton-rect-border-radius | @radius-default | -
--td-skeleton-rect-height | 16px | -
--td-skeleton-row-spacing | @spacer-2 | -
--td-skeleton-text-border-radius | @radius-small | -
--td-skeleton-text-height | 16px | -
