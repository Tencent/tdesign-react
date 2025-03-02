:: BASE_DOC ::

### Called Popup via plugin

Calling Popup through the plug-in method is used to render Popup in a scene with existing nodes. At the same time, no matter how it is called, it will only be mounted on one node, which is used to reduce the number of Popup rendering nodes on the page.

Support functional calls `PopupPlugin` 。
- `PopupPlugin(triggerElement, content, popupProps)`

{{ plugin }}

### Dynamic Adaptation

When the trigger or popup display content changes dynamically, the position is adjusted adaptively

{{ dynamic }}

### popperOptions usage

https://popper.js.org/docs/v2/constructors/#types

- `popperOptions` = `Options`

{{ popper-options }}

## FAQ

### How to solve the problem of position offset when nesting `Popup` components?

Currently, this can be solved by `Fragment` or other `HTML` elements

```js
<Popup content="Popup Content">
  <>
    {children}
  </>
</Popup>
```

## API
### Popup Props

name | type | default | description | required
-- | -- | -- | -- | --
attach | String / Function | 'body' | Typescript：`AttachNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
delay | Number / Array | - | delay to show or hide popover。Typescript：`number \| Array<number>` | N
destroyOnClose | Boolean | false | \- | N
disabled | Boolean | - | \- | N
hideEmptyPopup | Boolean | false | \- | N
overlayClassName | String / Object / Array | - | Typescript：`ClassName`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
overlayInnerClassName | String / Object / Array | - | Typescript：`ClassName`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
overlayInnerStyle | Boolean / Object / Function | - | Typescript：`Styles \| ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles)`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
overlayStyle | Boolean / Object / Function | - | Typescript：`Styles \| ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles)`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
placement | String | top | Typescript：`PopupPlacement` `type PopupPlacement = 'top'\|'left'\|'right'\|'bottom'\|'top-left'\|'top-right'\|'bottom-left'\|'bottom-right'\|'left-top'\|'left-bottom'\|'right-top'\|'right-bottom'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/popup/type.ts) | N
popperOptions | Object | - | popper initial options，details refer to https://popper.js.org/docs | N
showArrow | Boolean | false | \- | N
trigger | String | hover | options：hover/click/focus/mousedown/context-menu | N
triggerElement | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
visible | Boolean | - | Typescript：`boolean` | N
defaultVisible | Boolean | - | uncontrolled property。Typescript：`boolean` | N
zIndex | Number | - | \- | N
onScroll | Function |  | Typescript：`(context: { e: WheelEvent }) => void`<br/> | N
onScrollToBottom | Function |  | Typescript：`(context: { e: WheelEvent }) => void`<br/> | N
onVisibleChange | Function |  | Typescript：`(visible: boolean, context: PopupVisibleChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/popup/type.ts)。<br/>`interface PopupVisibleChangeContext { e?: PopupTriggerEvent; trigger?: PopupTriggerSource }`<br/><br/>`type PopupTriggerEvent = MouseEvent \| FocusEvent \| KeyboardEvent`<br/><br/>`type PopupTriggerSource = 'document' \| 'trigger-element-click' \| 'trigger-element-hover' \| 'trigger-element-blur' \| 'trigger-element-focus' \| 'trigger-element-mousedown' \| 'context-menu' \| 'keydown-esc'`<br/> | N
