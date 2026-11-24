:: BASE_DOC ::

## API

### Button Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
block | Boolean | false | 是否为块级元素 | N
children | TNode | - | 按钮内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 按钮内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | 禁用状态。优先级：Button.disabled > Form.disabled | N
form | String | undefined | 原生的form属性，支持用于通过 form 属性触发对应 id 的 form 的表单事件 | N
ghost | Boolean | false | 是否为幽灵按钮（镂空按钮） | N
href | String | - | 跳转地址。href 存在时，按钮标签默认使用 `<a>` 渲染；如果指定了 `tag` 则使用指定的标签渲染 | N
icon | TElement | - | 按钮内部图标，可完全自定义。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
loading | Boolean | false | 是否显示为加载状态 | N
loadingProps | Object | - | 透传 Loading 组件全部属性。TS 类型：`LoadingProps`，[Loading API Documents](./loading?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/button/type.ts) | N
shape | String | rectangle | 按钮形状，有 4 种：长方形、正方形、圆角长方形、圆形。可选项：rectangle/square/round/circle | N
size | String | medium | 组件尺寸。可选项：extra-small/small/medium/large | N
suffix | TElement | - | 右侧内容，可用于定义右侧图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
tag | String | - | 渲染按钮的 HTML 标签，默认使用标签 `<button>` 渲染，可以自定义为 `<a>` `<div>` 等。透传全部 HTML 属性，如：`href/target/data-*` 等。⚠️ 禁用按钮 `<button disabled>`无法显示 Popup 浮层信息，可通过修改 `tag=div` 解决这个问题。可选项：button/a/div | N
theme | String | default | 组件风格，依次为品牌色、危险色。可选项：default/primary/danger/light | N
type | String | button | 按钮类型。可选项：submit/reset/button | N
variant | String | base | 按钮形式，基础、线框、虚线、文字。可选项：base/outline/dashed/text | N
onClick | Function |  | TS 类型：`(e: MouseEvent) => void`<br/>点击时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-button-border-radius | @radius-default | -
--td-button-border-width | 2px | -
--td-button-danger-active-bg-color | @error-color-7 | -
--td-button-danger-active-border-color | @error-color-7 | -
--td-button-danger-bg-color | @error-color | -
--td-button-danger-border-color | @error-color | -
--td-button-danger-color | @font-white-1 | -
--td-button-danger-disabled-bg | @error-color-3 | -
--td-button-danger-disabled-border-color | @error-color-3 | -
--td-button-danger-disabled-color | @font-white-1 | -
--td-button-danger-outline-active-bg-color | @bg-color-container-active | -
--td-button-danger-outline-active-border-color | @error-color-7 | -
--td-button-danger-outline-border-color | @button-danger-outline-color | -
--td-button-danger-outline-color | @error-color | -
--td-button-danger-outline-disabled-color | @error-color-3 | -
--td-button-danger-text-active-bg-color | @bg-color-container-active | -
--td-button-danger-text-color | @error-color | -
--td-button-danger-text-disabled-color | @button-danger-disabled-color | -
--td-button-default-active-bg-color | @bg-color-component-active | -
--td-button-default-active-border-color | @bg-color-component-active | -
--td-button-default-bg-color | @bg-color-component | -
--td-button-default-border-color | @bg-color-component | -
--td-button-default-color | @text-color-primary | -
--td-button-default-disabled-bg | @bg-color-component-disabled | -
--td-button-default-disabled-border-color | @bg-color-component-disabled | -
--td-button-default-disabled-color | @text-color-disabled | -
--td-button-default-outline-active-bg-color | @bg-color-container-active | -
--td-button-default-outline-active-border-color | @component-border | -
--td-button-default-outline-border-color | @component-border | -
--td-button-default-outline-color | @text-color-primary | -
--td-button-default-outline-disabled-color | @component-border | -
--td-button-default-text-active-bg-color | @bg-color-container-active | -
--td-button-extra-small-font | @font-mark-medium | -
--td-button-extra-small-height | 28px | -
--td-button-extra-small-icon-size | 18px | -
--td-button-extra-small-padding-horizontal | 8px | -
--td-button-ghost-border-color | @button-ghost-color | -
--td-button-ghost-color | #fff | -
--td-button-ghost-danger-border-color | @error-color | -
--td-button-ghost-danger-color | @error-color | -
--td-button-ghost-danger-hover-color | @error-color-active | -
--td-button-ghost-disabled-color | @font-white-4 | -
--td-button-ghost-hover-color | @font-white-2 | -
--td-button-ghost-primary-border-color | @brand-color | -
--td-button-ghost-primary-color | @brand-color | -
--td-button-ghost-primary-hover-color | @brand-color-active | -
--td-button-icon-border-radius | 4px | -
--td-button-icon-spacer | @spacer | -
--td-button-large-font | @font-mark-large | -
--td-button-large-height | 48px | -
--td-button-large-icon-size | 24px | -
--td-button-large-padding-horizontal | 20px | -
--td-button-light-active-bg-color | @brand-color-light-active | -
--td-button-light-active-border-color | @brand-color-light-active | -
--td-button-light-bg-color | @brand-color-light | -
--td-button-light-border-color | @brand-color-light | -
--td-button-light-color | @brand-color | -
--td-button-light-disabled-bg | @brand-color-light | -
--td-button-light-disabled-border-color | @brand-color-light | -
--td-button-light-disabled-color | @brand-color-disabled | -
--td-button-light-outline-active-bg-color | @brand-color-light-active | -
--td-button-light-outline-active-border-color | @brand-color-active | -
--td-button-light-outline-bg-color | @brand-color-light | -
--td-button-light-outline-border-color | @button-light-outline-color | -
--td-button-light-outline-color | @brand-color | -
--td-button-light-outline-disabled-color | @brand-color-disabled | -
--td-button-light-text-active-bg-color | @bg-color-container-active | -
--td-button-light-text-color | @brand-color | -
--td-button-medium-font | @font-mark-large | -
--td-button-medium-height | 40px | -
--td-button-medium-icon-size | 20px | -
--td-button-medium-padding-horizontal | 16px | -
--td-button-primary-active-bg-color | @brand-color-active | -
--td-button-primary-active-border-color | @brand-color-active | -
--td-button-primary-bg-color | @brand-color | -
--td-button-primary-border-color | @brand-color | -
--td-button-primary-color | @font-white-1 | -
--td-button-primary-disabled-bg | @brand-color-disabled | -
--td-button-primary-disabled-border-color | @brand-color-disabled | -
--td-button-primary-disabled-color | @font-white-1 | -
--td-button-primary-outline-active-bg-color | @bg-color-container-active | -
--td-button-primary-outline-active-border-color | @brand-color-active | -
--td-button-primary-outline-border-color | @button-primary-outline-color | -
--td-button-primary-outline-color | @brand-color | -
--td-button-primary-outline-disabled-color | @brand-color-disabled | -
--td-button-primary-text-active-bg-color | @bg-color-container-active | -
--td-button-primary-text-color | @brand-color | -
--td-button-primary-text-disabled-color | @brand-color-disabled | -
--td-button-small-font | @font-mark-medium | -
--td-button-small-height | 32px | -
--td-button-small-icon-size | 18px | -
--td-button-small-padding-horizontal | 12px | -
