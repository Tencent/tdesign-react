/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

export interface TdColorPickerProps {
  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean;
  /**
   * 是否开启透明通道
   * @default false
   */
  enableAlpha?: boolean;
  /**
   * 如果 color-picker 是在一个 `position:fixed` 的区域，需要显式指定属性 fixed 为 true
   * @default false
   */
  fixed?: boolean;
  /**
   * 格式化色值。`enableAlpha` 为真时，`HEX8/RGBA/HSLA/HSVA` 有效
   * @default RGB
   */
  format?: 'HEX' | 'HEX8' | 'RGB' | 'RGBA' | 'HSL' | 'HSLA' | 'HSV' | 'HSVA' | 'CMYK' | 'CSS';
  /**
   * 系统预设的颜色样例，值为 `null` 或 `[]` 则不显示系统色，值为 `undefined` 会显示组件内置的系统默认色
   */
  swatchColors?: Array<string> | null | undefined;
  /**
   * 颜色选择器类型。（base 表示仅展示系统预设内容; multiple 表示展示色板和系统预设内容
   * @default base
   */
  type?: TypeEnum;
  /**
   * 色值
   * @default ''
   */
  value?: string;
  /**
   * 色值，非受控属性
   * @default ''
   */
  defaultValue?: string;
  /**
   * 选中的色值发生变化时触发，第一个参数 `value` 表示新色值，`context.color` 表示当前调色板控制器的色值，`context.trigger` 表示触发颜色变化的来源
   */
  onChange?: (value: string, context: { color: ColorObject; trigger: ColorPickerChangeTrigger }) => void;
  /**
   * 调色板控制器的值变化时触发，`context.color` 指调色板控制器的值
   */
  onPaletteBarChange?: (context: { color: ColorObject }) => void;
}

export type TypeEnum = 'base' | 'multiple';

export type ColorPickerChangeTrigger = 'palette-hue-bar' | 'palette-alpha-bar' | 'preset';

export interface ColorObject {
  alpha: number;
  css: string;
  hex: string;
  hex8: string;
  hsl: string;
  hsla: string;
  hsv: string;
  hsva: string;
  rgb: string;
  rgba: string;
  value: number;
}
