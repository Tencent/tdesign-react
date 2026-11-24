:: BASE_DOC ::

## API

### Progress Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
color | String / Object / Array | '' | 进度条颜色。示例：'#ED7B2F' 或 'orange' 或 `['#f00', '#0ff', '#f0f']` 或 `{ '0%': '#f00', '100%': '#0ff' }` 或  `{ from: '#000', to: '#000' }` 等。TS 类型：`string \| Array<string> \| Record<string, string>` | N
label | TNode | true | 进度百分比，可自定义。TS 类型：`string \| boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
percentage | Number | 0 | 进度条百分比 | N
size | String / Number | 'default' | 进度条尺寸，仅对环形进度条有效。可选值：default/micro。default 值为 112； micro 值为 24 | N
status | String | - | 进度条状态。可选项：success/error/warning/active。TS 类型：`ProgressStatus` `type ProgressStatus = 'success' \| 'error' \| 'warning' \| 'active'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/progress/type.ts) | N
strokeWidth | String / Number | - | 进度条线宽。宽度数值不能超过 size 的一半，否则不能输出环形进度 | N
theme | String | line | 进度条风格。值为 line，标签（label）显示在进度条右侧；值为 plump，标签（label）显示在进度条里面；值为 circle，标签（label）显示在进度条正中间。可选项：line/plump/circle。TS 类型：`ProgressTheme` `type ProgressTheme = 'line' \| 'plump' \| 'circle'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/progress/type.ts) | N
trackColor | String | '' | 进度条未完成部分颜色 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-progress-info-dark-color | @text-color-primary | -
--td-progress-info-light-color | @font-white-1 | -
--td-progress-inner-bg-color-active | @bg-color-container | -
--td-progress-inner-bg-color-error | @error-color | -
--td-progress-inner-bg-color-success | @success-color | -
--td-progress-inner-bg-color-warning | @warning-color | -
--td-progress-circle-icon-size | 48px | -
--td-progress-circle-inner-bg-color | @font-white-1 | -
--td-progress-circle-label-font | @font-title-extraLarge | -
--td-progress-inner-bg-color | @brand-color | -
--td-progress-track-bg-color | @bg-color-component | -
