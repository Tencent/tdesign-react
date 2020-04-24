import './Button.less';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { StyledProps, Combine, Omit } from '../_type';
import { useConfig } from '../config';
import { Icon } from '../icon';

/**
 * Button 组件支持的属性。
 *
 * 除表格中列出的属性外，支持透传原生 `<button>` 标签支持的属性。
 */
export interface ButtonProps
  extends Combine<
  StyledProps,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
  > {
  /**
   * 按钮类型
   *
   *   - `primary` 蓝色主要按钮
   *   - `weak` 白色按钮，默认
   *   - `pay` 橙色按钮，用于支付类操作
   *   - `text` 文本按钮，显示为普通文本效果
   *   - `link` 连接按钮，显示为超链接效果
   *   - `icon` 图标按钮，显示为单个图标
   *
   * @default "weak"
   */
  type?: 'primary' | 'weak' | 'pay' | 'text' | 'link' | 'icon';

  /**
   * 原生 `<button>` 标签的 `type` 属性
   */
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];

  /**
   * 显示为图标按钮，传入的 `icon` 表示图标类型
   *
   * __注意__：如果已经传入 `icon`，则会忽略 `children` 属性
   */
  icon?: string;

  /**
   * 设置按钮为禁用状态
   *
   * 禁用状态下，不会响应 `onClick` 回调
   * */
  disabled?: boolean;

  /**
   * 设置按钮为加载状态
   */
  loading?: boolean;

  /**
   * 点击回调函数
   */
  onClick?: (e?: React.MouseEvent) => void;

}

/**
 * 按钮组件
 *
 * @see https://tdesign.tencent.com/react/button
 */
export const Button = forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    disabled,
    loading: _loading,
    icon: _icon,
    type: _type,
    className,
    style,
    onClick,
    children,
    htmlType,
    ...buttonProps
  } = props;

  const { classPrefix } = useConfig();

  let [loading, icon, type] = [_loading, _icon, _type];

  // 指定了图标的话，
  if (!type) {
    type = icon ? 'icon' : 'weak';
  }

  // 只有下面三种类型的按钮支持 loading
  if (
    ['primary', 'weak', 'pay'].indexOf(type) === -1 &&
      typeof loading !== 'undefined'
  ) {
    loading = false;
  }

  // 计算类名
  const btnClassName = `${classPrefix}-btn`;
  const classList: (string | object)[] = [`${classPrefix}-btn`];

  // 类型类名
  if (type !== 'primary') {
    classList.push(`${btnClassName}--${type}`);
  }

  // 状态类名
  classList.push({
    'is-disabled': disabled,
    'is-loading': loading,
  });

  // 用户自定义类名
  if (className) {
    classList.push(className);
  }

  // loading 态的按钮，规范是只有一个 loading 图标
  if (loading) {
    icon = 'loading';
  }

  const button: JSX.Element = (
    <button
      ref={ref}
      className={classNames(...classList)}
      onClick={(!disabled && !loading && onClick) || null}
      style={style || {}}
      type={htmlType}
      disabled={disabled}
      {...buttonProps}
    >
      {icon ? <Icon type={icon} /> : children}
    </button>
  );

  return button;
});

Button.displayName = 'TDesingButton';
