:: BASE_DOC ::

## API

### Indexes Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
current | String / Number | - | 索引列表的激活项，默认首项 | N
defaultCurrent | String / Number | - | 索引列表的激活项，默认首项。非受控属性 | N
indexList | Array | - | 索引字符列表。不传默认 `A-Z`。TS 类型：`Array<string \| number>` | N
showFullIndex | Boolean | false | `0.21.4`。是否显示完整的索引内容，默认只显示首字符。TS 类型：`Boolean` | N
sticky | Boolean | true | 索引是否吸顶，默认为true。TS 类型：`Boolean` | N
stickyOffset | Number | 0 | 锚点吸顶时与顶部的距离	 | N
onChange | Function |  | TS 类型：`(index: string \| number) => void`<br/>索引发生变更时触发事件 | N
onSelect | Function |  | TS 类型：`(index: string \| number) => void`<br/>点击侧边栏时触发事件 | N


### IndexesAnchor Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
index | String / Number | - | 索引字符 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-indexes-sidebar-active-bg-color | @brand-color | -
--td-indexes-sidebar-active-color | @text-color-anti | -
--td-indexes-sidebar-color | @text-color-primary | -
--td-indexes-sidebar-font | @font-body-small | -
--td-indexes-sidebar-item-size | 20px | -
--td-indexes-sidebar-right | 8px | -
--td-indexes-sidebar-tips-bg-color | @brand-color-light | -
--td-indexes-sidebar-tips-color | @brand-color | -
--td-indexes-sidebar-tips-font | @font-title-extraLarge | -
--td-indexes-sidebar-tips-right | calc(100% + 16px) | -
--td-indexes-sidebar-tips-size | 48px | -
--td-indexes-anchor-active-bg-color | @bg-color-container | -
--td-indexes-anchor-active-color | @brand-color | -
--td-indexes-anchor-active-font-weight | 600 | -
--td-indexes-anchor-bg-color | @bg-color-secondarycontainer | -
--td-indexes-anchor-color | @text-color-primary | -
--td-indexes-anchor-font | @font-body-medium | -
