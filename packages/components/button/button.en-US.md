:: BASE_DOC ::

## API
### Button Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
block | Boolean | false | make button to be a block-level element | N
children | TNode | - | button's children elements。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
content | TNode | - | button's children elements。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | false | disable the button, make it can not be clicked | N
form | String | undefined |  native `form` attribute，which supports triggering events for a form with a specified id through the use of the form attribute. | N
ghost | Boolean | false | make background-color to be transparent | N
href | String | - | \- | N
icon | TElement | - | use it to set left icon in button。Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
loading | Boolean | false | set button to be loading state | N
shape | String | rectangle | button shape。options：rectangle/square/round/circle | N
size | String | medium | a button has three size。options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
suffix | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
tag | String | - | HTML Tag Element。options：button/a/div | N
theme | String | - | button theme。options：default/primary/danger/warning/success | N
type | String | button | type of button element in html。options：submit/reset/button | N
variant | String | base | variant of button。options：base/outline/dashed/text | N
onClick | Function |  | Typescript：`(e: MouseEvent) => void`<br/>trigger on click | N
