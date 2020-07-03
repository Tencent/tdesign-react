import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { StyledProps, Combine, Omit } from '../_type';
import useConfig from '../_util/useConfig';

/**
 * CheckTag 组件支持的属性。
 *
 */
export interface CheckTagProps
  extends Combine<
    StyledProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
  > {
  /**
   * 设置按钮为禁用状态
   *
   *@default false
   * */
  disabled?: boolean;
  /**
   * 选中状态
   *
   * @default false
   */
  checked?: boolean;
}

export const CheckTag = forwardRef(
  (props: CheckTagProps, ref: React.Ref<HTMLButtonElement>) => {
    const {
      checked,
      disabled,
      children,
      style,
      className,
      ...tagOtherProps
    } = props;

    // 前缀声明
    const { classPrefix } = useConfig();
    const tagClassPrefix = `${classPrefix}-tag`;

    // 属性判断
    const classList = {
      [`${tagClassPrefix}--disabled`]: disabled,
      [`${tagClassPrefix}--checked`]: checked,
    };

    // 添加默认属性
    const checkTagClassNames = classNames(
      tagClassPrefix,
      `${tagClassPrefix}--default`,
      classList
    );

    // 合并用户自定义className
    const mergedClassName = `${checkTagClassNames} ${className || ''}`;

    const checkTag: JSX.Element = (
      <span
        ref={ref}
        className={mergedClassName}
        style={style}
        {...tagOtherProps}
      >
        {children}
      </span>
    );

    return checkTag;
  }
);

CheckTag.displayName = 'TDesingCheckTag';
