:: BASE_DOC ::

## API

### Guide Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
backButtonProps | Object | - | Typescript: `ButtonProps` | N
counter | TElement | - | Typescript: `TNode<{ current: number; total: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
current | Number | - | \- | N
defaultCurrent | Number | - | uncontrolled property | N
finishButtonProps | Object | - | Typescript: `ButtonProps` | N
hideBack | Boolean | false | \- | N
hideCounter | Boolean | false | \- | N
hideSkip | Boolean | false | \- | N
highlightPadding | Number | 8 | \- | N
mode | String | popover | options: popover/dialog | N
nextButtonProps | Object | - | Typescript: `ButtonProps`，[Button API Documents](./button?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/guide/type.ts) | N
showOverlay | Boolean | true | \- | N
skipButtonProps | Object | - | Typescript: `ButtonProps` | N
steps | Array | - | Typescript: `Array<GuideStep>` | N
zIndex | Number | 999999 | \- | N
onBack | Function |  | Typescript: `(context: { e: MouseEvent, current: number, total: number  }) => void`<br/> | N
onChange | Function |  | Typescript: `(current: number, context?: { e: MouseEvent,  total: number }) => void`<br/> | N
onFinish | Function |  | Typescript: `(context: { e: MouseEvent, current: number, total: number  }) => void`<br/> | N
onNextStepClick | Function |  | Typescript: `(context: { e: MouseEvent, next: number, current: number, total: number  }) => void`<br/> | N
onSkip | Function |  | Typescript: `(context: { e: MouseEvent, current: number, total: number  }) => void`<br/> | N

### GuideStep

name | type | default | description | required
-- | -- | -- | -- | --
backButtonProps | Object | - | Typescript: `ButtonProps` | N
body | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
element | String / Function | - | required。Typescript: `AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | Y
finishButtonProps | Object | - | Typescript: `ButtonProps` | N
highlightContent | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
highlightPadding | Number | - | \- | N
mode | String | - | options: popover/dialog | N
nextButtonProps | Object | - | Typescript: `ButtonProps` | N
offset | Array | - | this api is in discussing. do not use it。Typescript: `Array<string \| number>` | N
placement | String | 'top' | Typescript: `StepPopoverPlacement ` `type StepPopoverPlacement = 'top'\|'left'\|'right'\|'bottom'\|'top-left'\|'top-right'\|'bottom-left'\|'bottom-right'\|'left-top'\|'left-bottom'\|'right-top'\|'right-bottom'\|'center'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/guide/type.ts) | N
popoverProps | Object | - | Popover component props if `mode = popover`。Typescript: `PopoverProps`，[Popover API Documents](./popover?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/guide/type.ts) | N
showOverlay | Boolean | true | \- | N
skipButtonProps | Object | - | Typescript: `ButtonProps` | N
title | TNode | - | title of current step。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
