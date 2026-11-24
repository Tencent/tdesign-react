:: BASE_DOC ::

## API

### Button Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
block | Boolean | false | make button to be a block-level element | N
children | TNode | - | button's children elements。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | button's children elements。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | disable the button, make it can not be clicked | N
form | String | undefined |  native `form` attribute，which supports triggering events for a form with a specified id through the use of the form attribute | N
ghost | Boolean | false | make background-color to be transparent | N
href | String | - | \- | N
icon | TElement | - | use it to set left icon in button。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
loading | Boolean | false | set button to be loading state | N
loadingProps | Object | - | Typescript: `LoadingProps`，[Loading API Documents](./loading?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/button/type.ts) | N
shape | String | rectangle | button shape。options: rectangle/square/round/circle | N
size | String | medium | a button has four size。options: extra-small/small/medium/large | N
suffix | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
tag | String | - | HTML Tag Element。options: button/a/div | N
theme | String | default | button theme。options: default/primary/danger/light | N
type | String | button | type of button element in html。options: submit/reset/button | N
variant | String | base | variant of button。options: base/outline/dashed/text | N
onClick | Function |  | Typescript: `(e: MouseEvent) => void`<br/>trigger on click | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-button-border-radius | @radius-default | -
--td-button-border-width | 2px | -
--td-button-danger-active-bg-color | @error-color-7 | -
--td-button-danger-active-border-color | @error-color-7 | -
--td-button-danger-bg-color | @error-color | -
--td-button-danger-border-color | @error-color | -
--td-button-danger-color | @font-white-1 | -
--td-button-danger-disabled-bg | @error-color-3 | -
--td-button-danger-disabled-border-color | @error-color-3 | -
--td-button-danger-disabled-color | @font-white-1 | -
--td-button-danger-outline-active-bg-color | @bg-color-container-active | -
--td-button-danger-outline-active-border-color | @error-color-7 | -
--td-button-danger-outline-border-color | @button-danger-outline-color | -
--td-button-danger-outline-color | @error-color | -
--td-button-danger-outline-disabled-color | @error-color-3 | -
--td-button-danger-text-active-bg-color | @bg-color-container-active | -
--td-button-danger-text-color | @error-color | -
--td-button-danger-text-disabled-color | @button-danger-disabled-color | -
--td-button-default-active-bg-color | @bg-color-component-active | -
--td-button-default-active-border-color | @bg-color-component-active | -
--td-button-default-bg-color | @bg-color-component | -
--td-button-default-border-color | @bg-color-component | -
--td-button-default-color | @text-color-primary | -
--td-button-default-disabled-bg | @bg-color-component-disabled | -
--td-button-default-disabled-border-color | @bg-color-component-disabled | -
--td-button-default-disabled-color | @text-color-disabled | -
--td-button-default-outline-active-bg-color | @bg-color-container-active | -
--td-button-default-outline-active-border-color | @component-border | -
--td-button-default-outline-border-color | @component-border | -
--td-button-default-outline-color | @text-color-primary | -
--td-button-default-outline-disabled-color | @component-border | -
--td-button-default-text-active-bg-color | @bg-color-container-active | -
--td-button-extra-small-font | @font-mark-medium | -
--td-button-extra-small-height | 28px | -
--td-button-extra-small-icon-size | 18px | -
--td-button-extra-small-padding-horizontal | 8px | -
--td-button-ghost-border-color | @button-ghost-color | -
--td-button-ghost-color | #fff | -
--td-button-ghost-danger-border-color | @error-color | -
--td-button-ghost-danger-color | @error-color | -
--td-button-ghost-danger-hover-color | @error-color-active | -
--td-button-ghost-disabled-color | @font-white-4 | -
--td-button-ghost-hover-color | @font-white-2 | -
--td-button-ghost-primary-border-color | @brand-color | -
--td-button-ghost-primary-color | @brand-color | -
--td-button-ghost-primary-hover-color | @brand-color-active | -
--td-button-icon-border-radius | 4px | -
--td-button-icon-spacer | @spacer | -
--td-button-large-font | @font-mark-large | -
--td-button-large-height | 48px | -
--td-button-large-icon-size | 24px | -
--td-button-large-padding-horizontal | 20px | -
--td-button-light-active-bg-color | @brand-color-light-active | -
--td-button-light-active-border-color | @brand-color-light-active | -
--td-button-light-bg-color | @brand-color-light | -
--td-button-light-border-color | @brand-color-light | -
--td-button-light-color | @brand-color | -
--td-button-light-disabled-bg | @brand-color-light | -
--td-button-light-disabled-border-color | @brand-color-light | -
--td-button-light-disabled-color | @brand-color-disabled | -
--td-button-light-outline-active-bg-color | @brand-color-light-active | -
--td-button-light-outline-active-border-color | @brand-color-active | -
--td-button-light-outline-bg-color | @brand-color-light | -
--td-button-light-outline-border-color | @button-light-outline-color | -
--td-button-light-outline-color | @brand-color | -
--td-button-light-outline-disabled-color | @brand-color-disabled | -
--td-button-light-text-active-bg-color | @bg-color-container-active | -
--td-button-light-text-color | @brand-color | -
--td-button-medium-font | @font-mark-large | -
--td-button-medium-height | 40px | -
--td-button-medium-icon-size | 20px | -
--td-button-medium-padding-horizontal | 16px | -
--td-button-primary-active-bg-color | @brand-color-active | -
--td-button-primary-active-border-color | @brand-color-active | -
--td-button-primary-bg-color | @brand-color | -
--td-button-primary-border-color | @brand-color | -
--td-button-primary-color | @font-white-1 | -
--td-button-primary-disabled-bg | @brand-color-disabled | -
--td-button-primary-disabled-border-color | @brand-color-disabled | -
--td-button-primary-disabled-color | @font-white-1 | -
--td-button-primary-outline-active-bg-color | @bg-color-container-active | -
--td-button-primary-outline-active-border-color | @brand-color-active | -
--td-button-primary-outline-border-color | @button-primary-outline-color | -
--td-button-primary-outline-color | @brand-color | -
--td-button-primary-outline-disabled-color | @brand-color-disabled | -
--td-button-primary-text-active-bg-color | @bg-color-container-active | -
--td-button-primary-text-color | @brand-color | -
--td-button-primary-text-disabled-color | @brand-color-disabled | -
--td-button-small-font | @font-mark-medium | -
--td-button-small-height | 32px | -
--td-button-small-icon-size | 18px | -
--td-button-small-padding-horizontal | 12px | -
