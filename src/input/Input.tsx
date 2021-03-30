import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdInputProps } from '../_type/components/input';
import { StyledProps } from '../_type';

export interface InputProps extends TdInputProps, StyledProps {}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: React.ReactElement) => {
  let result: React.ReactNode = null;
  if (icon) {
    result = icon;
  }
  if (result) {
    result = <span className={`${classPrefix}-input__${type}`}>{result}</span>;
  }
  return result;
};

/**
 * 组件
 */
const Input = forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const { disabled, status, size, className, style, prefixIcon, suffixIcon, ...otherProps } = props;

  const { classPrefix } = useConfig();
  const componentType = 'input';
  const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
  const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIcon);

  const inputPropsNames = Object.keys(otherProps).filter((key) => !/^on[A-Z]/.test(key));
  const inputProps = inputPropsNames.reduce((inputProps, key) => Object.assign(inputProps, { [key]: props[key] }), {});
  const eventPropsNames = Object.keys(props).filter((key) => /^on[A-Z]/.test(key));
  const eventProps = eventPropsNames.reduce((eventProps, key) => {
    Object.assign(eventProps, {
      [key]: (e) => props[key](e.target.value, e),
    });
    return eventProps;
  }, {});

  const inputClassNames = classNames(className, `${classPrefix}-${componentType}__inner`);

  const renderInput = <input className={inputClassNames} disabled={disabled} {...inputProps} {...eventProps} />;
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
        [`${classPrefix}-${componentType}--suffix`]: suffixIcon,
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
