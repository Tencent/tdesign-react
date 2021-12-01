
### Tag Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
closable | Boolean | false | 标签是否可关闭 | N
content | TNode | - | 组件子元素。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/common.ts) | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态 | N
icon | TElement | undefined | 标签中的图标，可自定义图标呈现。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/common.ts) | N
maxWidth | String / Number | - | 标签最大宽度，宽度超出后会出现省略号。示例：'50px' / 80。TS 类型：`CSSProperties['maxWidth'] | number`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/tag/type.ts) | N
shape | String | square | 标签类型，有三种：方形、圆角方形、标记型。可选项：square/round/mark | N
size | String | medium | 标签尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/common.ts) | N
theme | String | default | 组件风格，用于描述组件不同的应用场景。可选项：default/primary/warning/danger/success | N
variant | String | dark | 影响标签风格（theme）。可选项：dark/light/plain | N
onClick | Function |  | 点击时触发。`(context: { e: MouseEvent }) => {}` | N
onClose | Function |  | 如果关闭按钮存在，点击关闭按钮时触发。`(context: { e: MouseEvent }) => {}` | N


### CheckTag Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
checked | Boolean | false | 标签选中的状态，默认风格（theme=default）才有选中态 | N
defaultChecked | Boolean | false | 标签选中的状态，默认风格（theme=default）才有选中态。非受控属性 | N
content | TNode | - | 组件子元素。TS 类型：`string | number | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/common.ts) | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态 | N
onChange | Function |  | 组件子元素。`(checked: boolean) => {}` | N
onClick | Function |  | 点击标签时触发。`(context: { e: MouseEvent }) => {}` | N
