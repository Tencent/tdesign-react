import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { isArray } from 'lodash-es';
import Loading from '../loading';
import { TdSwitchProps, SwitchValue } from './type';
import { switchDefaultProps } from './defaultProps';
import { StyledProps } from '../common';
import useDefault from '../_util/useDefault';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';

export interface SwitchProps<T extends SwitchValue = SwitchValue> extends TdSwitchProps<T>, StyledProps {}

const Switch = forwardRef<HTMLDivElement, SwitchProps>((originalProps, ref) => {
  const props = useDefaultProps<SwitchProps<SwitchValue>>(originalProps, switchDefaultProps);
  const { className, style, value, defaultValue, customValue, disabled, label, loading, size, onChange } = props;

  const switchClass = usePrefixClass('switch');

  const [activeValue = true, inactiveValue = false] = customValue || [];

  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);

  const checked = useMemo(() => {
    if (typeof innerValue !== 'undefined') {
      if (Array.isArray(customValue) && !customValue.includes(innerValue)) {
        throw `${innerValue} is not in customValue: ${JSON.stringify(customValue)}`;
      }
      return innerValue === activeValue;
    }
  }, [innerValue, customValue, activeValue]);

  const switchClasses = classNames(
    `${switchClass}`,
    `${switchClass}--${props.size}`,
    {
      [`${switchClass}--checked`]: checked,
      [`${switchClass}--disabled`]: disabled || loading,
    },
    className,
  );

  const dotClasses = classNames(`${switchClass}__dot`, `${switchClass}__dot--${props.size}`, {
    [`${switchClass}__dot--disabled`]: disabled || loading,
    [`${switchClass}__dot--checked`]: checked,
    [`${switchClass}__dot--plain`]: isArray(label) && label.length !== 2 && !loading,
  });

  const labelClasses = classNames(`${switchClass}__label`, `${switchClass}__label--${size}`, {
    [`${switchClass}__label--checked`]: checked,
  });

  const handleToggle: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (disabled || loading) {
      return;
    }
    const changedValue = !checked ? activeValue : inactiveValue;
    setInnerValue(changedValue, { e });
  };

  const readerContent = React.useMemo<React.ReactNode>(() => {
    if (loading) return <Loading className={`${switchClass}__loading`} size="16px" />;

    if (Array.isArray(label)) {
      const [activeContent = '', inactiveContent = ''] = label;
      const content = checked ? activeContent : inactiveContent;
      return parseTNode(content, { value });
    }

    return parseTNode(label, { value });
  }, [loading, label, checked, value, switchClass]);

  return (
    <div ref={ref} className={switchClasses} style={style} onClick={handleToggle}>
      <div className={dotClasses}>
        <div className={labelClasses}>{readerContent}</div>
      </div>
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
