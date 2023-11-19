import React, { forwardRef, MouseEvent, useMemo, FocusEvent } from 'react';
import classNames from 'classnames';
import useControlled from '../hooks/useControlled';
import useConfig from '../hooks/useConfig';
import { TdCheckTagProps, TdTagProps } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';
import { checkTagDefaultProps } from './defaultProps';
import Tag from './Tag';
import { ENTER_REG, SPACE_REG } from '../_common/js/common';

/**
 * CheckTag 组件支持的属性
 */
export interface CheckTagProps extends TdCheckTagProps, StyledProps {
  /**
   * 标签内容
   */
  children?: React.ReactNode;
}

const CheckTag = forwardRef((props: CheckTagProps, ref: React.Ref<HTMLDivElement>) => {
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
    ...tagOtherProps
  } = props;
  const [innerChecked, setInnerChecked] = useControlled(props, 'checked', onChange);

  const { classPrefix } = useConfig();
  const tagClassPrefix = `${classPrefix}-tag`;

  const tagClass = useMemo(() => [
      `${tagClassPrefix}`,
      `${tagClassPrefix}--check`,
      {
        [`${tagClassPrefix}--checked`]: innerChecked,
        [`${tagClassPrefix}--disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
      },
    ], [innerChecked, disabled, classPrefix, tagClassPrefix, size]);

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
CheckTag.defaultProps = checkTagDefaultProps;

export default CheckTag;
