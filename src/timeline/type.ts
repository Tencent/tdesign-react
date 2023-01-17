/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

export interface TdTimelineProps {
  /**
   * 标签信息放在时间轴的位置，`mode='alternate'` 时生效。纵向时间轴信息位置：左侧、右侧或两侧，默认信息在时间轴右侧。横向时间轴信息位置：上方、下方、两侧
   * @default left
   */
  labelAlign?: 'left' | 'right' | 'alternate' | 'top' | 'bottom';
  /**
   * 时间轴方向：水平方向、垂直方向
   * @default vertical
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * 标签与内容文本的位置关系，`alternate` 为展示在轴两侧，`same` 为展示在同一侧
   * @default alternate
   */
  mode?: 'alternate' | 'same';
  /**
   * 时间轴是否表现为倒序
   * @default false
   */
  reverse?: boolean;
  /**
   * 步骤条风格
   * @default default
   */
  theme?: 'default' | 'dot';
}
