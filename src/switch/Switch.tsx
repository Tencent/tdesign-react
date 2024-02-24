import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Loading from '../loading';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import useCommonClassName from '../_util/useCommonClassName';
import { SwitchValue, TdSwitchProps } from './type';
import { switchDefaultProps } from './defaultProps';
import log from '../_common/js/log';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';

export type SwitchChangeEventHandler = (value: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps<T extends SwitchValue = SwitchValue> extends TdSwitchProps<T>, StyledProps {}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const props = useDefaultProps<SwitchProps<SwitchValue>>(originalProps, switchDefaultProps);
  const { className, value, defaultValue, disabled, loading, size, label, customValue, onChange, ...restProps } = props;
  const [activeValue = true, inactiveValue = false] = customValue || [];

  const isControlled = typeof value !== 'undefined';
  const initChecked = defaultValue === activeValue || value === activeValue;
  const [innerChecked, setInnerChecked] = useState(initChecked);

  const contentNode = React.useMemo<React.ReactNode>(() => {
    if (Array.isArray(label)) {
      const [activeContent = '', inactiveContent = ''] = label;
      const content = innerChecked ? activeContent : inactiveContent;
      return parseTNode(content, { value });
    }
    return parseTNode(label, { value });
  }, [label, innerChecked, value]);

  const onInternalClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) {
      return;
    }
    !isControlled && setInnerChecked(!innerChecked);
    const changedValue = !innerChecked ? activeValue : inactiveValue;
    onChange?.(changedValue, { e });
  };

  useEffect(() => {
    if (Array.isArray(customValue) && !customValue.includes(value)) {
      log.error('Switch', `value is not in customValue: ${JSON.stringify(customValue)}`);
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
      <span className={`${classPrefix}-switch__handle`}>{loading && <Loading loading size="small" />}</span>
      <div className={`${classPrefix}-switch__content`}>{contentNode}</div>
    </button>
  );
});

Switch.displayName = 'Switch';

export default Switch as <T extends SwitchValue = SwitchValue>(
  props: SwitchProps<T> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement;
