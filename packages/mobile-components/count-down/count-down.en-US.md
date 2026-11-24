:: BASE_DOC ::

## API

### CountDown Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
autoStart | Boolean | true | \- | N
children | TNode | - | children, same as `content`。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | 'default' | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
format | String | HH:mm:ss | \- | N
millisecond | Boolean | false | \- | N
size | String | 'medium' | options: small/medium/large | N
splitWithUnit | Boolean | false | \- | N
theme | String | 'default' | options: default/round/square | N
time | Number | 0 | required | Y
onChange | Function |  | Typescript: `(time: TimeData) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/count-down/type.ts)。<br/>`interface TimeData {  days: number; hours: number; minutes: number; seconds: number; milliseconds: number }`<br/> | N
onFinish | Function |  | Typescript: `() => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-countdown-bg-color | @error-color-6 | -
--td-countdown-default-color | @text-color-primary | -
--td-countdown-round-border-radius | @radius-circle | -
--td-countdown-round-color | @text-color-anti | -
--td-countdown-square-border-radius | @radius-small | -
