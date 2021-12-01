import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useDefault from '../_util/useDefault';
import useConfig from '../_util/useConfig';
import { TdCheckTagProps } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';

/**
 * CheckTag 组件支持的属性
 */
export interface CheckTagProps extends TdCheckTagProps, StyledProps {
  /**
   * 标签内容
   */
  children?: React.ReactNode;
}

const CheckTag = forwardRef((props: CheckTagProps, ref: React.Ref<HTMLSpanElement>) => {
  const {
    checked,
    content,
    defaultChecked,
    onChange,
    onClick = noop,
    disabled,
    children,
    className,
    ...tagOtherProps
  } = props;
  const [value, onValueChange] = useDefault(checked, defaultChecked, onChange);

  const { classPrefix } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  const checkTagClassNames = classNames(
    tagClassPrefix,
    className,
    `${tagClassPrefix}--default`,
    `${tagClassPrefix}--check`,
    {
      [`${tagClassPrefix}--disabled`]: disabled,
      [`${tagClassPrefix}--checked`]: value,
    },
  );

  return (
    <span
      ref={ref}
      className={checkTagClassNames}
      {...tagOtherProps}
      onClick={(e) => {
        !disabled && onValueChange(!value);
        onClick({ e });
      }}
    >
      {children || content}
    </span>
  );
});

CheckTag.displayName = 'CheckTag';

export default CheckTag;
