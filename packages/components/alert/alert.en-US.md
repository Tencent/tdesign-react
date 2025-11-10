:: BASE_DOC ::

## API

### Alert Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
close | TNode | false | Deprecated, use closeBtn instead. Typescript: `string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
closeBtn | TNode | false | Close button. Value "true" show the close button. Value "False" hide close button. Value type string display as is. Use TNode to custom the close trigger. Typescript: `string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
maxLine | Number | 0 | \- | N
message | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
operation | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
theme | String | info | options: success/info/warning/error | N
title | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
onClose | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClosed | Function |  | Typescript: `(context: { e: TransitionEvent }) => void`<br/> | N
