:: BASE_DOC ::

## API
### Breadcrumb Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
maxItemWidth | String | undefined | \- | N
options | Array | - | Typescript：`Array<TdBreadcrumbItemProps>` | N
separator | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N

### BreadcrumbItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | \- | N
href | String | - | \- | N
icon | TElement | - | prefix icon in breadcrumb item。Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
maxWidth | String | undefined | \- | N
replace | Boolean | false | \- | N
router | Object | - | Typescript：`any` | N
target | String | _self | options：_blank/_self/_parent/_top | N
to | String / Object | - | Typescript：`Route` `interface Route { path?: string; name?: string; hash?: string; query?: RouteData; params?: RouteData }` `type RouteData = { [key: string]: string \| string[] }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/breadcrumb/type.ts) | N
