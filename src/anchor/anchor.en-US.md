:: BASE_DOC ::

## API

### Anchor Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
affixProps | Object | - | Typescript：`Omit<AffixProps, 'children'>`，[Affix API Documents](./affix?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/anchor/type.ts) | N
bounds | Number | 5 | \- | N
container | String / Function | () => (() => window) | Typescript：`ScrollContainer` | N
cursor | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
size | String | medium | options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
targetOffset | Number | 0 | \- | N
onChange | Function |  | Typescript：`(currentLink: string, prevLink: string) => void`<br/> | N
onClick | Function |  | Typescript：`(link: { href: string; title: string; e: MouseEvent }) => void`<br/> | N

### AnchorItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
href | String | - | required | Y
target | String | _self | options：_self/_blank/_parent/_top | N
title | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N

### AnchorTarget Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
id | String | - | required | Y
tag | String | div | \- | N
