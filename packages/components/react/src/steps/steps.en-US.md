:: BASE_DOC ::

## API

### Steps Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
current | String / Number | - | \- | N
defaultCurrent | String / Number | - | uncontrolled property | N
layout | String | horizontal | options：horizontal/vertical | N
options | Array | - | Typescript：`Array<TdStepItemProps>` | N
readonly | Boolean | false | \- | N
separator | String | line | options：line/dashed/arrow | N
sequence | String | positive | options：positive/reverse | N
theme | String | default | options：default/dot | N
onChange | Function |  | Typescript：`(current: string \| number, previous: string \| number, context?: { e?: MouseEvent }) => void`<br/> | N

### StepItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
extra | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
icon | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
status | String | default | options：default/process/finish/error。Typescript：`StepStatus` `type StepStatus = 'default' \| 'process' \| 'finish' \| 'error'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/steps/type.ts) | N
title | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number | - | \- | N
