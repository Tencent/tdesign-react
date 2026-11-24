:: BASE_DOC ::

## API

### NoticeBar Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
content | TNode | - | Typescript: `string \| string[] \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
direction | String | horizontal | options: horizontal/vertical | N
interval | Number | 2000 | \- | N
marquee | Boolean / Object | false | Typescript: `boolean \| NoticeBarMarquee` `interface NoticeBarMarquee { speed?: number; loop?: number; delay?: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/notice-bar/type.ts) | N
operation | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
prefixIcon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
theme | String | info | options: info/success/warning/error | N
visible | Boolean | false | \- | N
defaultVisible | Boolean | false | uncontrolled property | N
onChange | Function |  | Typescript: `(current: number, context: { source: NoticeBarChangeSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/notice-bar/type.ts)。<br/>`type NoticeBarChangeSource = '' \| 'autoplay' \| 'touch'`<br/> | N
onClick | Function |  | Typescript: `(trigger: NoticeBarTrigger) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/notice-bar/type.ts)。<br/>`type NoticeBarTrigger = 'prefix-icon' \| 'content' \| 'operation' \| 'suffix-icon';`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-notice-bar-error-bg-color | @error-color-1 | -
--td-notice-bar-error-color | @error-color-6 | -
--td-notice-bar-font-color | @text-color-primary | -
--td-notice-bar-info-bg-color | @brand-color-light | -
--td-notice-bar-info-color | @brand-color | -
--td-notice-bar-operation-font-color | @brand-color | -
--td-notice-bar-success-bg-color | @success-color-1 | -
--td-notice-bar-success-color | @success-color | -
--td-notice-bar-suffix-icon-color | @text-color-placeholder | -
--td-notice-bar-warning-bg-color | @warning-color-1 | -
--td-notice-bar-warning-color | @warning-color | -
