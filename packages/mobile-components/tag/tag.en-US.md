:: BASE_DOC ::

## API

### Tag Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closable | Boolean | false | \- | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
icon | TElement | undefined | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxWidth | String / Number | - | \- | N
shape | String | square | options: square/round/mark | N
size | String | medium | options: small/medium/large/extra-large | N
theme | String | default | options: default/primary/warning/danger/success | N
variant | String | dark | options: dark/light/outline/light-outline | N
onClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N


### CheckTag Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
checked | Boolean | - | \- | N
defaultChecked | Boolean | - | uncontrolled property | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closable | Boolean | false | \- | N
content | TNode | - | Typescript: `string \| number \| string[] \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
shape | String | square | options: square/round/mark | N
size | String | medium | options: small/medium/large。Typescript: `SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
variant | String | dark | options: dark/light/outline/light-outline | N
onChange | Function |  | Typescript: `(checked: boolean) => void`<br/> | N
onClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-tag-checked-dark-disabled-color | @font-white-2 | -
--td-tag-checked-disabled-background-color | @brand-color-disabled | -
--td-tag-checked-disabled-border-color | @brand-color-disabled | -
--td-tag-checked-disabled-color | @brand-color-disabled | -
--td-tag-checked-light-disabled-background-color | @brand-color-light | -
--td-tag-close-icon-color | @text-color-placeholder | -
--td-tag-danger-color | @error-color | -
--td-tag-danger-light-color | @error-color-1 | -
--td-tag-default-color | @bg-color-component | -
--td-tag-default-font-color | @text-color-primary | -
--td-tag-default-light-color | @bg-color-secondarycontainer | -
--td-tag-disabled-background-color | @bg-color-component-disabled | -
--td-tag-disabled-border-color | @component-border | -
--td-tag-disabled-color | @text-color-disabled | -
--td-tag-extra-large-font | @font-body-medium | -
--td-tag-extra-large-icon-size | 16px | -
--td-tag-extra-large-padding | 8px 15px | -
--td-tag-large-font | @font-body-medium | -
--td-tag-large-icon-size | 16px | -
--td-tag-large-padding | 2px 7px | -
--td-tag-mark-border-radius | @radius-round | -
--td-tag-medium-font | @font-body-small | -
--td-tag-medium-icon-size | 14px | -
--td-tag-medium-padding | 1px 7px | -
--td-tag-outline-bg-color | @bg-color-container | -
--td-tag-primary-color | @brand-color | -
--td-tag-primary-light-color | @brand-color-light | -
--td-tag-round-border-radius | @radius-round | -
--td-tag-small-font | @font-body-extraSmall | -
--td-tag-small-icon-size | 12px | -
--td-tag-small-padding | 1px 5px | -
--td-tag-square-border-radius | @radius-small | -
--td-tag-success-color | @success-color | -
--td-tag-success-light-color | @success-color-1 | -
--td-tag-warning-color | @warning-color | -
--td-tag-warning-light-color | @warning-color-1 | -
