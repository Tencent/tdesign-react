import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { LoadingIcon } from '../icon';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import useCommonClassName from '../_util/useCommonClassName';
import { TdSwitchProps } from '../_type/components/switch';

export type SwitchChangeEventHandler = (value: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

interface SwitchProps extends TdSwitchProps, StyledProps {}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, value, defaultValue, disabled, loading, size, label, customValue, onChange, ...restProps }, ref) => {
    const { classPrefix } = useConfig();
    const [activeContent = '', inactiveContent = ''] = label || [];
    const [activeValue = true, inactiveValue = false] = customValue || [];

    const isControlled = typeof value !== 'undefined';
    const initChecked = defaultValue === activeValue || value === activeValue;
    const [innerChecked, setInnerChecked] = useState(initChecked);

    function onInternalClick() {
      if (disabled) return;

      !isControlled && setInnerChecked(!innerChecked);

      const changedValue = !innerChecked ? activeValue : inactiveValue;
      onChange?.(changedValue);
    }

    useEffect(() => {
      if (Array.isArray(customValue) && !customValue.includes(value)) {
        throw `value is not in customValue: ${JSON.stringify(customValue)}`;
      }
      isControlled && setInnerChecked(value === activeValue);
    }, [value, customValue, activeValue, isControlled]);

    const { SIZE, STATUS } = useCommonClassName();
    const switchClassName = classNames(
      `${classPrefix}-switch`,
      className,
      {
        [STATUS.checked]: innerChecked,
        [STATUS.disabled]: disabled,
        [STATUS.loading]: loading,
      },
      SIZE[size],
    );

    return (
      <button
        {...restProps}
        type="button"
        role="switch"
        disabled={disabled || loading}
        className={switchClassName}
        ref={ref}
        onClick={onInternalClick}
      >
        <span className={`${classPrefix}-switch__handle`}>{loading && <LoadingIcon />}</span>
        <div className={`${classPrefix}-switch__content`}>{innerChecked ? activeContent : inactiveContent}</div>
      </button>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
