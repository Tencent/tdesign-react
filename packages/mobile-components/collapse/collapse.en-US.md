:: BASE_DOC ::

## API

### Collapse Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
defaultExpandAll | Boolean | false | \- | N
disabled | Boolean | - | \- | N
expandIcon | TNode | true | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
expandMutex | Boolean | false | \- | N
theme | String | default | options: default/card | N
value | Array | [] | Typescript: `CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/collapse/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript: `CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/collapse/type.ts) | N
onChange | Function |  | Typescript: `(value: CollapseValue, context: { e: MouseEvent }) => void`<br/> | N


### CollapsePanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
destroyOnCollapse | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
expandIcon | TNode | undefined | Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
header | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
headerLeftIcon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
headerRightContent | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
placement | String | bottom | options: bottom/top | N
value | String / Number | - | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-collapse-border-color | @border-color | -
--td-collapse-content-font | @font-body-medium | -
--td-collapse-content-padding | 16px | -
--td-collapse-content-text-color | @text-color-primary | -
--td-collapse-extra-font | @font-body-large | -
--td-collapse-header-text-color | @text-color-primary | -
--td-collapse-header-text-disabled-color | @text-color-disabled | -
--td-collapse-icon-color | @text-color-placeholder | -
--td-collapse-panel-bg-color | @bg-color-container | -
--td-collapse-title-font | @font-body-large | -
