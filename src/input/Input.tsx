import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import useConfig from '../_util/useConfig';
import { TdInputProps, InputValue } from '../_type/components/input';
import { StyledProps } from '../_type';
import { TElement } from '../_type/common';
import ClearIcon from '../icon/icons/ClearCircleFilledIcon';

export interface InputProps extends TdInputProps, StyledProps {}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TElement) => {
  let result: React.ReactNode = null;

  if (icon) result = icon;

  if (typeof icon === 'function') result = icon();

  if (result) {
    result = <span className={`${classPrefix}-input__${type}`}>{result}</span>;
  }

  return result;
};

/**
 * 组件
 */
const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    disabled,
    status,
    size,
    className,
    style,
    prefixIcon,
    suffixIcon,
    clearable,
    value: inputValue,
    defaultValue,
    onChange,
    onClear,
    onEnter,
    onKeydown,
    ...otherProps
  } = props;
  const { classPrefix } = useConfig();
  const [value, setValue] = useState<InputValue>('');

  const isShowClearIcon = clearable && value && !disabled;
  const componentType = 'input';
  const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
  const suffixIconNew = isShowClearIcon ? <ClearIcon onClick={handleClear} /> : suffixIcon;
  const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIconNew);

  const inputPropsNames = Object.keys(otherProps).filter((key) => !/^on[A-Z]/.test(key));
  const inputProps = inputPropsNames.reduce((inputProps, key) => Object.assign(inputProps, { [key]: props[key] }), {});
  const eventPropsNames = Object.keys(otherProps).filter((key) => /^on[A-Z]/.test(key));
  const eventProps = eventPropsNames.reduce((eventProps, key) => {
    Object.assign(eventProps, {
      [key]: (e) => props[key](e.currentTarget.value, { e }),
    });
    return eventProps;
  }, {});

  const inputClassNames = classNames(className, `${classPrefix}-${componentType}__inner`);

  const renderInput = (
    <input
      className={inputClassNames}
      disabled={disabled}
      {...inputProps}
      value={value}
      {...eventProps}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setValue(value);
    isFunction(onChange) && onChange(value, { e });
  }
  function handleClear(e: React.MouseEvent<SVGSVGElement>) {
    setValue('');
    isFunction(onChange) && onChange('', { e });
    isFunction(onClear) && onClear({ e });
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const {
      key,
      currentTarget: { value },
    } = e;
    isFunction(onEnter) && key === 'Enter' && onEnter(value, { e });
    isFunction(onKeydown) && onKeydown(value, { e });
  }

  useEffect(() => {
    const valueNew = inputValue || defaultValue || '';
    setValue(valueNew);
  }, [inputValue, defaultValue]);

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(className, `${classPrefix}-${componentType}`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-is-${status}`]: status,
        [`${classPrefix}-${componentType}--prefix`]: prefixIcon,
        [`${classPrefix}-${componentType}--suffix`]: suffixIconContent,
      })}
    >
      {prefixIconContent}
      {renderInput}
      {suffixIconContent}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
