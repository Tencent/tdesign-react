import React, { ReactNode, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdRadioGroupProps } from './type';
import useDefault from '../_util/useDefault';
import { CheckContext, CheckContextValue } from '../common/Check';
import Radio from './Radio';
/**
 * RadioGroup 组件所接收的属性
 */
export interface RadioGroupProps extends TdRadioGroupProps {
  children?: ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
const RadioGroup = (props: RadioGroupProps) => {
  const { classPrefix } = useConfig();
  const {
    disabled,
    children,
    value,
    defaultValue,
    onChange,
    size = 'medium',
    variant = 'outline',
    options = [],
  } = props;

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);
  const [barStyle, setBarStyle] = useState({});
  const groupRef = useRef(null);

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        checked: internalValue === checkProps.value,
        disabled: checkProps.disabled || disabled,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }

          setInternalValue(checkValue, { e });
        },
      };
    },
  };

  function calcBarStyle() {
    if (!variant.includes('filled')) return;

    const checkedRadioCls = `.${classPrefix}-radio-button.${classPrefix}-is-checked`;
    const checkedRadio = groupRef.current.querySelector(checkedRadioCls);
    if (!checkedRadio) return;
    const { offsetWidth, offsetLeft } = checkedRadio;
    setBarStyle({ width: `${offsetWidth}px`, left: `${offsetLeft}px` });
  }

  useEffect(() => {
    calcBarStyle();
  }, [internalValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderBlock = () => {
    if (!variant.includes('filled')) return null;

    return <div style={barStyle} className={`${classPrefix}-radio-group-filled-bg-block`}></div>;
  };

  const renderOptions = () =>
    options.map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return (
          <Radio value={item} key={item}>
            {item}
          </Radio>
        );
      }
      return (
        <Radio value={item.value} key={item.value} disabled={item.disabled}>
          {item.label}
        </Radio>
      );
    });

  return (
    <CheckContext.Provider value={context}>
      <div
        ref={groupRef}
        className={classNames(`${classPrefix}-radio-group`, `${classPrefix}-radio-group-${size}`, {
          [`${classPrefix}-radio-group-outline`]: variant === 'outline',
          [`${classPrefix}-radio-group-filled`]: variant.includes('filled'),
          [`${classPrefix}-radio-group-primary-filled`]: variant === 'primary-filled',
        })}
      >
        {children || renderOptions()}
        {renderBlock()}
      </div>
    </CheckContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
