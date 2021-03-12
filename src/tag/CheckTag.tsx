import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useDefault from '../_util/useDefault';
import useConfig from '../_util/useConfig';
import { TdCheckTagProps } from '../_type/components/tag';
import { StyledProps } from '../_type';

/**
 * CheckTag 组件支持的属性。
 */
export interface CheckTagProps extends TdCheckTagProps, StyledProps {
  /**
   * 标签内容
   */
  children?: React.ReactNode;
}

const CheckTag = forwardRef((props: CheckTagProps, ref: React.Ref<HTMLSpanElement>) => {
  const { checked, content, onChange, disabled, children, className, ...tagOtherProps } = props;
  const [value, onValueChange] = useDefault(checked, false, onChange);

  const { classPrefix } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  const checkTagClassNames = classNames(tagClassPrefix, className, `${tagClassPrefix}--default`, {
    [`${tagClassPrefix}--disabled`]: disabled,
    [`${tagClassPrefix}--checked`]: value,
  });

  return (
    <span
      ref={ref}
      className={checkTagClassNames}
      {...tagOtherProps}
      onClick={() => {
        !disabled && onValueChange(!value);
      }}
    >
      {children || content}
    </span>
  );
});

CheckTag.displayName = 'CheckTag';

export default CheckTag;
