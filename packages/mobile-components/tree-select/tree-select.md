:: BASE_DOC ::

## API

### TreeSelect Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
height | String / Number | 336 | 高度，默认单位为 px | N
keys | Object | - | 用来定义 `value / label / disabled / children` 在 `options` 数据中对应的字段别名，示例：`{ value: 'key', label: 'name', children: 'list' }`。TS 类型：`TreeKeysType`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
multiple | Boolean | false | 是否允许多选 | N
options | Array | [] | 选项。TS 类型：`Array<DataOption>` | N
value | String / Number / Array | - | 选中值。TS 类型：`TreeSelectValue` `type TreeSelectValue = string \| number \| Array<TreeSelectValue>`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tree-select/type.ts) | N
defaultValue | String / Number / Array | - | 选中值。非受控属性。TS 类型：`TreeSelectValue` `type TreeSelectValue = string \| number \| Array<TreeSelectValue>`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tree-select/type.ts) | N
onChange | Function |  | TS 类型：`(value: TreeSelectValue, level: TreeLevel)  => void`<br/>点击任何节点均会触发；level 代表当前点击的层级，0 代表最左侧，依次递进。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tree-select/type.ts)。<br/>`type TreeLevel = 0 \| 1 \| 2`<br/> | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-tree-bg-color | @bg-color-container | -
--td-tree-colum-text-color | @text-color-primary | -
--td-tree-colum-width | 103px | -
--td-tree-item-active-color | @brand-color | -
--td-tree-item-disabled-color | @text-color-disabled | -
--td-tree-item-font-size | 16px | -
--td-tree-item-height | 56px | -
--td-tree-root-bg-color | @bg-color-secondarycontainer | -
