:: BASE_DOC ::

## API

### Message Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
align | String | left | options: left/center。Typescript: `MessageAlignType` `type MessageAlignType = 'left' \| 'center'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
closeBtn | TNode | undefined | Typescript: `string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
duration | Number | 3000 | \- | N
icon | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
link | TNode | - | Typescript: `string \| object \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
marquee | Boolean / Object | false | Typescript: `boolean \| MessageMarquee` `interface MessageMarquee { speed?: number; loop?: number; delay?: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
offset | Array | - | Typescript: `Array<string \| number>` | N
theme | String | info | options: info/success/warning/error。Typescript: `MessageThemeList` `type MessageThemeList = 'info' \| 'success' \| 'warning' \| 'error'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
visible | Boolean | false | \- | N
defaultVisible | Boolean | false | uncontrolled property | N
zIndex | Number | - | \- | N
onCloseBtnClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N
onDurationEnd | Function |  | Typescript: `() => void`<br/> | N
onLinkClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-message-bg-color | @bg-color-container | -
--td-message-border-radius | @radius-default | -
--td-message-box-shadow | @shadow-4 | -
--td-message-close-icon-color | @text-color-placeholder | -
--td-message-content-color | @text-color-primary | -
--td-message-error-color | @error-color | -
--td-message-info-color | @brand-color | -
--td-message-success-color | @success-color | -
--td-message-warning-color | @warning-color | -
