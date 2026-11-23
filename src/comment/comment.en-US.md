:: BASE_DOC ::

## API

### Comment Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
actions | TNode | - | Typescript: `Array<CommentActionItem> \| TNode ` `type ActionPlacement = 'start' \| 'end'` `interface CommentActionItem { key: string; content?: string \| TNode; placement?: ActionPlacement; disabled?: boolean}`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts). [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/comment/type.ts) | N
author | TNode | - | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
avatar | TNode | - | Typescript: `string \| AvatarProps \| TNode`，[Avatar API Documents](./avatar?tab=api). [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts). [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/comment/type.ts) | N
children | TNode | - | children, same as `reply`. Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
datetime | TNode | - | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
folds | Object | - | Typescript: `CommentFold ` `type CommentFoldState = 'collapsed' \| 'partial' \| 'expanded'` `interface CommentFold { state: CommentFoldState; total?: number; step?: number; content?: Partial<Record<CommentFoldState, TNode \| [TNode, TNode]>>}`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts). [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/comment/type.ts) | N
reply | TNode | - | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onActions | Function |  | Typescript: `(context: { action: CommentActionItem \| TNode; e: Event }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onFolds | Function |  | Typescript: `(context: { fold: CommentFold; e: Event }) => void`<br/> | N
onLongPress | Function |  | Typescript: ` (context: { e: LongPressEvent }) => void`<br/>`1.0.1`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/comment/type.ts). <br/>`type LongPressEvent = PointerEvent \| TouchEvent;`<br/> | N
