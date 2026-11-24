:: BASE_DOC ::

## API

### Steps Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
current | String / Number | - | \- | N
defaultCurrent | String / Number | - | uncontrolled property | N
currentStatus | String | process | options: default/process/finish/error | N
layout | String | horizontal | options: horizontal/vertical | N
readonly | Boolean | undefined | \- | N
sequence | String | positive | options: positive/reverse | N
theme | String | default | options: default/dot | N
onChange | Function |  | Typescript: `(current: string \| number, previous: string \| number, context?: { e?: MouseEvent }) => void`<br/> | N


### StepItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | '' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
extra | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
status | String | default | options: default/process/finish/error。Typescript: `StepStatus` `type StepStatus = 'default' \| 'process' \| 'finish' \| 'error'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/steps/type.ts) | N
title | TNode | '' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
titleRight | TNode | '' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-step-item-circle-size | 22px | -
--td-step-item-circle-text-font | @font-body-medium | -
--td-step-item-default-circle-bg | @bg-color-secondarycontainer | -
--td-step-item-default-circle-color | @text-color-placeholder | -
--td-step-item-default-dot-border-color | @component-border | -
--td-step-item-default-icon-color | @text-color-placeholder | -
--td-step-item-default-title-color | @text-color-placeholder | -
--td-step-item-description-color | @text-color-placeholder | -
--td-step-item-dot-size | 8px | -
--td-step-item-error-circle-bg | @error-color-1 | -
--td-step-item-error-circle-color | @error-color | -
--td-step-item-error-dot-border-color | @error-color | -
--td-step-item-error-icon-color | @error-color | -
--td-step-item-error-title-color | @error-color | -
--td-step-item-finish-circle-bg | @brand-color-light | -
--td-step-item-finish-circle-color | @brand-color | -
--td-step-item-finish-dot-border-color | @brand-color | -
--td-step-item-finish-icon-color | @brand-color | -
--td-step-item-finish-line-color | @brand-color | -
--td-step-item-finish-title-color | @text-color-primary | -
--td-step-item-line-color | @component-border | -
--td-step-item-process-circle-bg | @brand-color | -
--td-step-item-process-circle-color | @font-white-1 | -
--td-step-item-process-dot-border-color | @brand-color | -
--td-step-item-process-icon-color | @brand-color | -
--td-step-item-process-title-color | @brand-color | -
