import React, { ReactNode, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdRadioGroupProps } from './type';
import useControlled from '../hooks/useControlled';
import useCommonClassName from '../hooks/useCommonClassName';
import { StyledProps } from '../common';
import { CheckContext, CheckContextValue } from '../common/Check';
import Radio from './Radio';
import { radioGroupDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import useKeyboard from './useKeyboard';

/**
 * RadioGroup 组件所接收的属性
 */
export interface RadioGroupProps extends TdRadioGroupProps, StyledProps {
  children?: ReactNode;
}

/**
 * 单选选项组，里面可以嵌套 <Radio />
 */
const RadioGroup: React.FC<RadioGroupProps> = (originalProps) => {
  const { classPrefix } = useConfig();

  const props = useDefaultProps<RadioGroupProps>(originalProps, radioGroupDefaultProps);

  const { disabled, readonly, children, onChange, size, variant, options = [], className, style, theme } = props;

  const [internalValue, setInternalValue] = useControlled(props, 'value', onChange);
  const [barStyle, setBarStyle] = useState({});
  const radioGroupRef = useRef<HTMLDivElement>(null);

  useKeyboard(radioGroupRef, setInternalValue);

  const checkedRadioCls = `.${classPrefix}-radio-button.${classPrefix}-is-checked`;
  const { SIZE: sizeMap } = useCommonClassName();

  const context: CheckContextValue = {
    inject: (checkProps) => {
      // 如果已经受控，则不注入
      if (typeof checkProps.checked !== 'undefined') {
        return checkProps;
      }

      const { value: checkValue } = checkProps;

      return {
        ...checkProps,
        name: props.name,
        // 有一个允许取消，就可以取消选中
        allowUncheck: checkProps.allowUncheck || props.allowUncheck,
        checked: internalValue === checkProps.value,
        disabled: checkProps.disabled || disabled,
        readonly: checkProps.readonly || readonly,
        onChange(checked, { e }) {
          if (typeof checkProps.onChange === 'function') {
            checkProps.onChange(checked, { e });
          }
          setInternalValue(checked ? checkValue : undefined, { e, name: props.name });
        },
      };
    },
  };

  const calcBarStyle = () => {
    if (!variant.includes('filled')) {
      return;
    }
    const checkedRadio = radioGroupRef.current.querySelector?.(checkedRadioCls) as HTMLElement;
    if (!checkedRadio) {
      return setBarStyle({ width: 0 });
    }

    const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = checkedRadio;
    setBarStyle({
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
    });
  };

  useEffect(() => {
    calcBarStyle();
  }, [radioGroupRef.current, internalValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderBlock = () => {
    if (!variant.includes('filled')) {
      return null;
    }
    return <div style={barStyle} className={`${classPrefix}-radio-group__bg-block`}></div>;
  };

  const renderOptions = () => {
    const Comp = theme === 'button' ? Radio.Button : Radio;
    return options.map((item, index) => {
      let label: ReactNode;
      let value: string | number | boolean;
      let disabled: boolean | undefined;
      if (typeof item === 'string' || typeof item === 'number') {
        label = item;
        value = item;
      } else {
        label = item.label;
        value = item.value;
        disabled = item.disabled;
      }
      return (
        <Comp value={value} key={index} disabled={disabled}>
          {label}
        </Comp>
      );
    });
  };

  return (
    <CheckContext.Provider value={context}>
      <div
        ref={radioGroupRef}
        style={style}
        className={classNames(`${classPrefix}-radio-group`, sizeMap[size], className, {
          [`${classPrefix}-radio-group__outline`]: variant === 'outline',
          [`${classPrefix}-radio-group--filled`]: variant.includes('filled'),
          [`${classPrefix}-radio-group--primary-filled`]: variant === 'primary-filled',
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
