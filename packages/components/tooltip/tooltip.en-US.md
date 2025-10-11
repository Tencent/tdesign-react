:: BASE_DOC ::

### 模拟原生title

{{ mouse }}

### 定时消失

{{ duration }}

## FAQ

### How to solve the problem that `Tooltip` and related floating components based on `Popup` may be offset when nested?

Currently, this can be solved by `Fragment` or other `HTML` elements

```js
<Tooltip content="Tooltip Content">
  <>
    {children}
  </>
</Tooltip>
```

## API
### Tooltip Props

name | type | default | description | required
-- | -- | -- | -- | --
delay | Number / Array | - | delay to show or hide popover。Typescript：`number \| Array<number>` | N
destroyOnClose | Boolean | true | \- | N
duration | Number | - | \- | N
placement | String | top | Typescript：`PopupPlacement`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/tooltip/type.ts) | N
showArrow | Boolean | true | \- | N
theme | String | default | options：default/primary/success/danger/warning/light | N
`PopupProps` | \- | - | \- | N

### TooltipLite Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | trigger element。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
content | TNode | - | tip content。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
placement | String | top | options：top/bottom/mouse | N
showArrow | Boolean | true | \- | N
showShadow | Boolean | true | \- | N
theme | String | default | options：light/default | N
triggerElement | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
