:: BASE_DOC ::

## API

### Slider Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
disabled | Boolean | undefined | \- | N
label | TNode | false | Typescript: `string \| boolean \| TNode<{ value: SliderValue; position?: 'start' \| 'end' }>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
marks | Object / Array | - | Typescript: `Array<number> \| SliderMarks` `interface SliderMarks { [mark: number]: string \| TNode<{ value: number }> }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/slider/type.ts) | N
max | Number | 100 | \- | N
min | Number | 0 | \- | N
range | Boolean | false | \- | N
showExtremeValue | Boolean | false | \- | N
step | Number | 1 | \- | N
theme | String | default | options: default/capsule | N
value | Number / Array | 0 | Typescript: `SliderValue` `type SliderValue = number \| Array<number>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/slider/type.ts) | N
defaultValue | Number / Array | 0 | uncontrolled property。Typescript: `SliderValue` `type SliderValue = number \| Array<number>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/slider/type.ts) | N
vertical | Boolean | false | \- | N
onChange | Function |  | Typescript: `(value: SliderValue) => void`<br/> | N
onDragend | Function |  | Typescript: `(value: SliderValue, context: {e: TouchEvent}) => void`<br/> | N
onDragstart | Function |  | Typescript: `(context: {e: TouchEvent}) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-slider-active-color | @brand-color | -
--td-slider-bar-height | 4px | -
--td-slider-bar-width | 4px | -
--td-slider-capsule-bar-color | @bg-color-component | -
--td-slider-capsule-bar-height | 24px | -
--td-slider-capsule-bar-width | 24px | -
--td-slider-capsule-line-height | 18px | -
--td-slider-default-color | @bg-color-component | -
--td-slider-disabled-color | @brand-color-disabled | -
--td-slider-disabled-text-color | @text-color-disabled | -
--td-slider-dot-bg-color | #fff | -
--td-slider-dot-color | @component-border | -
--td-slider-dot-disabled-bg-color | #fff | -
--td-slider-dot-disabled-border-color | #f3f3f3 | -
--td-slider-dot-size | 20px | -
--td-slider-text-color | @text-color-primary | -
