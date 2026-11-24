:: BASE_DOC ::

## API

### Stepper Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
disableInput | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
inputWidth | Number | - | \- | N
integer | Boolean | true | \- | N
max | Number | 100 | \- | N
min | Number | 0 | \- | N
size | String | medium | options: small/medium/large。Typescript: `SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
step | Number | 1 | \- | N
theme | String | normal | stylish。options: normal/filled/outline | N
value | String / Number | 0 | \- | N
defaultValue | String / Number | 0 | uncontrolled property | N
onBlur | Function |  | Typescript: `(value: string \| number) => void`<br/> | N
onChange | Function |  | Typescript: `(value: string \| number) => void`<br/> | N
onFocus | Function |  | Typescript: `(value: string \| number) => void`<br/> | N
onOverlimit | Function |  | Typescript: `(type: 'minus' \| 'plus') => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-stepper-border-color | @component-border | -
--td-stepper-border-radius | @radius-small | -
--td-stepper-input-color | @text-color-primary | -
--td-stepper-input-disabled-bg | @bg-color-component-disabled | -
--td-stepper-input-disabled-color | @text-color-disabled | -
