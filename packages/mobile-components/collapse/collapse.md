:: BASE_DOC ::

## API

### Collapse Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 折叠面板列表内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
defaultExpandAll | Boolean | false | 默认是否展开全部 | N
disabled | Boolean | - | 是否禁用面板展开/收起操作 | N
expandIcon | TNode | true | 展开图标。值为 undefined 或 false 则不显示展开图标；值为 true 显示默认图标；值类型为函数，则表示完全自定义展开图标。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
expandMutex | Boolean | false | 每个面板互斥展开，每次只展开一个面板 | N
theme | String | default | 折叠面板风格。可选项：default/card | N
value | Array | [] | 展开的面板集合。TS 类型：`CollapseValue` `type CollapseValue = Array<string \| number>`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/collapse/type.ts) | N
defaultValue | Array | [] | 展开的面板集合。非受控属性。TS 类型：`CollapseValue` `type CollapseValue = Array<string \| number>`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/collapse/type.ts) | N
onChange | Function |  | TS 类型：`(value: CollapseValue, context: { e: MouseEvent }) => void`<br/>切换面板时触发，返回变化的值 | N


### CollapsePanel Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 折叠面板内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 折叠面板内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
destroyOnCollapse | Boolean | false | 当前面板处理折叠状态时，是否销毁面板内容 | N
disabled | Boolean | undefined | 禁止当前面板展开，优先级大于 Collapse 的同名属性 | N
expandIcon | TNode | undefined | 当前折叠面板展开图标，优先级大于 Collapse 的同名属性。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
header | TNode | - | 面板头内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
headerLeftIcon | TElement | - | 面板头左侧图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
headerRightContent | TNode | - | 面板头的右侧区域，一般用于呈现面板操作。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
placement | String | bottom | 选项卡内容的位置。可选项：bottom/top | N
value | String / Number | - | 当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
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
