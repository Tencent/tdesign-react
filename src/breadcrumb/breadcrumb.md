:: BASE_DOC ::

## API
### Breadcrumb Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
maxItemWidth | String | undefined | 单项最大宽度，超出后会以省略号形式呈现 | N
options | Array | - | 面包屑项，功能同 BreadcrumbItem。TS 类型：`Array<TdBreadcrumbItemProps>` | N
separator | TNode | - | 自定义分隔符。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N

### BreadcrumbItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 子元素，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | 是否禁用当前项点击 | N
href | String | - | 跳转链接 | N
icon | TElement | - | 面板屑项内的前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
maxWidth | String | undefined | 最大宽度，超出后会以省略号形式呈现。优先级高于 Breadcrumb 中的 maxItemWidth | N
replace | Boolean | false | 路由跳转是否采用覆盖的方式（覆盖后将没有浏览器历史记录） | N
router | Object | - | 路由对象。如果项目存在 Router，则默认使用 Router。TS 类型：`any` | N
target | String | _self | 链接或路由跳转方式。可选项：_blank/_self/_parent/_top | N
to | String / Object | - | 路由跳转目标，当且仅当 Router 存在时，该 API 有效。TS 类型：`Route` `interface Route { path?: string; name?: string; hash?: string; query?: RouteData; params?: RouteData }` `type RouteData = { [key: string]: string \| string[] }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/breadcrumb/type.ts) | N
