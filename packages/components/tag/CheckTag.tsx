import type { MouseEvent, FocusEvent } from 'react';
import React, { forwardRef, useMemo } from 'react';

import { ENTER_REG, SPACE_REG } from '@tdesign/common-js/common';
import classNames from 'classnames';

import { checkTagDefaultProps } from './defaultProps';
import Tag from './Tag';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';

import type { StyledProps } from '../common';
import type { TdCheckTagProps, TdTagProps } from './type';

/**
 * CheckTag 组件支持的属性
 */
export interface CheckTagProps extends TdCheckTagProps, StyledProps {
  /**
   * 标签内容
   */
  children?: React.ReactNode;
}

const CheckTag = forwardRef<HTMLDivElement, CheckTagProps>((originalProps, ref) => {
  const props = useDefaultProps<CheckTagProps>(originalProps, checkTagDefaultProps);
  const {
    value,
    content,
    onClick = noop,
    disabled,
    children,
    size,
    checkedProps,
    uncheckedProps,
    onChange,
    className,
    ...tagOtherProps
  } = props;
  const [innerChecked, setInnerChecked] = useControlled(props, 'checked', onChange);

  const { classPrefix } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  const tagClass = useMemo(
    () => [
      `${tagClassPrefix}`,
      `${tagClassPrefix}--check`,
      {
        [`${tagClassPrefix}--checked`]: innerChecked,
        [`${tagClassPrefix}--disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
      },
      className,
    ],
    [innerChecked, disabled, classPrefix, tagClassPrefix, size, className],
  );

  const checkTagProps = useMemo(() => {
    const tmpCheckedProps: TdTagProps = { theme: 'primary', ...checkedProps };
    const tmpUncheckedProps: TdTagProps = { ...uncheckedProps };
    return innerChecked ? tmpCheckedProps : tmpUncheckedProps;
  }, [innerChecked, checkedProps, uncheckedProps]);

  const handleClick = ({ e }: { e: MouseEvent<HTMLDivElement> }) => {
    if (!disabled) {
      onClick?.({ e });
      setInnerChecked(!innerChecked, { e, value });
    }
  };

  const keyboardEventListener = (e) => {
    const code = e.code || e.key?.trim();
    const isCheckedCode = SPACE_REG.test(code) || ENTER_REG.test(code);
    if (isCheckedCode) {
      e.preventDefault();
      setInnerChecked(!innerChecked, { e, value });
    }
  };

  const onCheckboxFocus = (e: FocusEvent<HTMLDivElement>) => {
    e.currentTarget.addEventListener('keydown', keyboardEventListener);
  };

  const onCheckboxBlur = (e: FocusEvent<HTMLDivElement>) => {
    e.currentTarget.removeEventListener('keydown', keyboardEventListener);
  };

  return (
    <Tag
      ref={ref}
      className={classNames(tagClass)}
      disabled={props.disabled}
      tabIndex={props.disabled ? undefined : 0}
      onFocus={onCheckboxFocus}
      onBlur={onCheckboxBlur}
      {...checkTagProps}
      onClick={handleClick}
      {...tagOtherProps}
    >
      {content || children}
    </Tag>
  );
});

CheckTag.displayName = 'CheckTag';

export default CheckTag;
