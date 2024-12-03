:: BASE_DOC ::

## API

### Empty Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
action | TElement | - | action block。Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
description | TNode | - | empty component description。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
image | TNode | - | image url, or Image component props, or custom any node you need.。Typescript：`string \| ImageProps \| TNode `，[Image API Documents](./image?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/empty/type.ts) | N
imageStyle | Object | - | pass `Cascading Style Sheets` to image element。Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
size | String | medium | size of Empty,  default value is `medium`。options: small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
title | TNode | - | empty component title。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
type | String | empty | Empty component type。options: empty/success/fail/network-error/maintenance | N
