/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { LoadingProps } from '../loading';

export interface TdPullDownRefreshProps {
  /**
   * 是否禁用下拉刷新
   * @default false
   */
  disabled?: boolean;
  /**
   * 加载中下拉高度，如果值为数字则单位是：'px'
   * @default 50
   */
  loadingBarHeight?: string | number;
  /**
   * 加载loading样式
   */
  loadingProps?: LoadingProps;
  /**
   * 提示语，组件内部默认值为 ['下拉刷新', '松手刷新', '正在刷新', '刷新完成']
   * @default []
   */
  loadingTexts?: string[];
  /**
   * 最大下拉高度，如果值为数字则单位是：'px'
   * @default 80
   */
  maxBarHeight?: string | number;
  /**
   * 刷新超时时间
   * @default 3000
   */
  refreshTimeout?: number;
  /**
   * 刷新成功提示展示时长，单位 'ms'
   * @default 500
   */
  successDuration?: string | number;
  /**
   * 组件状态，值为 `true` 表示下拉状态，值为 `false` 表示收起状态
   * @default false
   */
  value?: boolean;
  /**
   * 组件状态，值为 `true` 表示下拉状态，值为 `false` 表示收起状态，非受控属性
   * @default false
   */
  defaultValue?: boolean;
  /**
   * 下拉或收起时触发，用户手势往下滑动触发下拉状态，手势松开触发收起状态
   */
  onChange?: (value: boolean) => void;
  /**
   * 结束下拉时触发
   */
  onRefresh?: () => void;
  /**
   * 滚动到页面底部时触发
   */
  onScrolltolower?: () => void;
  /**
   * 刷新超时触发
   */
  onTimeout?: () => void;
}
