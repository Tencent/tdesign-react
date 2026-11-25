:: BASE_DOC ::

## API

### ColorPicker Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
clearable | Boolean | false | 是否可清空 | N
enableAlpha | Boolean | false | 是否开启透明通道 | N
fixed | Boolean | false | 如果 color-picker 是在一个 `position:fixed` 的区域，需要显式指定属性 fixed 为 true | N
format | String | RGB | 格式化色值。`enableAlpha` 为真时，`HEX8/RGBA/HSLA/HSVA` 有效。可选项：HEX/HEX8/RGB/RGBA/HSL/HSLA/HSV/HSVA/CMYK/CSS | N
swatchColors | Array | undefined | 系统预设的颜色样例，值为 `null` 或 `[]` 则不显示系统色，值为 `undefined` 会显示组件内置的系统默认色。TS 类型：`Array<string> \| null \| undefined` | N
type | String | base | 颜色选择器类型。（base 表示仅展示系统预设内容; multiple 表示展示色板和系统预设内容。可选项：base/multiple。TS 类型：`TypeEnum ` `type TypeEnum = 'base' \| 'multiple'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/color-picker/type.ts) | N
value | String | - | 色值 | N
defaultValue | String | - | 色值。非受控属性 | N
onChange | Function |  | TS 类型：`(value: string, context: { color: ColorObject; trigger: ColorPickerChangeTrigger }) => void`<br/>选中的色值发生变化时触发，第一个参数 `value` 表示新色值，`context.color` 表示当前调色板控制器的色值，`context.trigger` 表示触发颜色变化的来源。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/color-picker/type.ts)。<br/>`type ColorPickerChangeTrigger = 'palette-hue-bar' \| 'palette-alpha-bar' \| 'preset' `<br/> | N
onPaletteBarChange | Function |  | TS 类型：`(context: { color: ColorObject }) => void`<br/>调色板控制器的值变化时触发，`context.color` 指调色板控制器的值。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/color-picker/type.ts)。<br/>`interface ColorObject { alpha: number; css: string; hex: string; hex8: string; hsl: string; hsla: string; hsv: string; hsva: string; rgb: string; rgba: string; value: number;}`<br/> | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-color-picker-format-background-color | @gray-color-1 | -
--td-color-picker-gradient-preview-height | 28px | -
--td-color-picker-gradient-preview-radius | 3px | -
--td-color-picker-gradient-preview-width | 28px | -
--td-color-picker-input-format-margin-left | 24px | -
--td-color-picker-panel-background | @bg-color-container | -
--td-color-picker-panel-padding | 16px | -
--td-color-picker-panel-radius | 12px | -
--td-color-picker-panel-width | 375px | -
--td-color-picker-saturation-height | 144px | -
--td-color-picker-saturation-radius | 6px | -
--td-color-picker-saturation-thumb-size | 24px | -
--td-color-picker-slider-height | 8px | -
--td-color-picker-slider-thumb-padding | 3px | -
--td-color-picker-slider-thumb-size | 24px | -
--td-color-picker-slider-thumb-transform-x | -9px | -
--td-color-picker-slider-wrapper-padding | 0 9px | -
--td-color-picker-swatch-active | rgba(0, 0, 0, 20%) | -
--td-color-picker-swatch-border-radius | @radius-small | -
--td-color-picker-swatch-height | 24px | -
--td-color-picker-swatch-padding | 0 | -
--td-color-picker-swatch-width | 24px | -
--td-color-picker-swatches-title-font | @font-title-medium | -
