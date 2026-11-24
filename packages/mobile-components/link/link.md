:: BASE_DOC ::

## API

### Link Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 链接内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 链接内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | 禁用链接。优先级：Link.disabled > Form.disabled | N
hover | Boolean | - | 是否开启点击反馈 | N
href | String | - | 跳转链接 | N
prefixIcon | TElement | - | 前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
size | String | medium | 尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | 后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
target | String | - | 跳转方式，如：当前页面打开、新页面打开等，同 HTML 属性 target 含义相同 | N
theme | String | default | 组件风格，依次为默认色、品牌色、危险色、警告色、成功色。可选项：default/primary/danger/warning/success | N
underline | Boolean | - | 是否显示链接下划线 | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击事件，禁用状态不会触发点击事件 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-link-danger-active-color | @error-color-active | -
--td-link-danger-color | @error-color | -
--td-link-danger-disabled-color | @error-color-disabled | -
--td-link-default-active-color | @brand-color-active | -
--td-link-default-color | @text-color-primary | -
--td-link-default-disabled-color | @text-color-disabled | -
--td-link-primary-active-color | @brand-color-active | -
--td-link-primary-color | @brand-color | -
--td-link-primary-disabled-color | @brand-color-disabled | -
--td-link-success-active-color | @success-color-active | -
--td-link-success-color | @success-color | -
--td-link-success-disabled-color | @success-color-disabled | -
--td-link-warning-active-color | @warning-color-active | -
--td-link-warning-color | @warning-color | -
--td-link-warning-disabled-color | @warning-color-disabled | -
