import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import { CloseCircleFilledIcon as ClearIcon } from 'tdesign-icons-react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../_util/useConfig';
import { TdInputProps, InputValue } from './type';
import { StyledProps, TNode } from '../common';
import InputGroup from './InputGroup';
import useDefaultValue from '../_util/useDefaultValue';

export interface InputProps extends TdInputProps, StyledProps {
  onCompositionStart?: Function;
  onCompositionEnd?: Function;
}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode) => {
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
const Input = forwardRefWithStatics(
  (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      status,
      size,
      className,
      style,
      prefixIcon,
      suffixIcon,
      clearable,
      value,
      onChange,
      onClear,
      onEnter,
      onKeydown,
      onCompositionStart,
      onCompositionEnd,
      autofocus,
      readonly,
      ...restProps
    } = useDefaultValue<InputValue, InputProps>(props, '');
    const { classPrefix } = useConfig();
    const composingRef = useRef(false);
    const [isHover, toggleIsHover] = useState(false);
    const [composingRefValue, setComposingValue] = useState<string>('');
    const isShowClearIcon = clearable && value && !disabled && isHover;
    const componentType = 'input';
    const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
    const suffixIconNew = isShowClearIcon ? (
      <ClearIcon
        className={`${classPrefix}-input__suffix-clear`}
        onClick={handleClear}
        onMouseUp={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
      />
    ) : (
      suffixIcon
    );
    const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIconNew);

    const inputPropsNames = Object.keys(restProps).filter((key) => !/^on[A-Z]/.test(key));
    const inputProps = inputPropsNames.reduce(
      (inputProps, key) => Object.assign(inputProps, { [key]: props[key] }),
      {},
    );
    const eventPropsNames = Object.keys(restProps).filter((key) => /^on[A-Z]/.test(key));
    const eventProps = eventPropsNames.reduce((eventProps, key) => {
      Object.assign(eventProps, {
        [key]: (e) => props[key](e.currentTarget.value, { e }),
      });
      return eventProps;
    }, {});

    const renderInput = (
      <input
        readOnly={readonly}
        disabled={disabled}
        className={`${classPrefix}-${componentType}__inner`}
        {...inputProps}
        value={composingRef.current ? composingRefValue : value}
        {...eventProps}
        autoFocus={autofocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>) {
      const { value } = e.currentTarget;
      if (composingRef.current) {
        setComposingValue(value);
      } else {
        onChange(value, { e });
      }
    }
    function handleClear(e: React.MouseEvent<SVGSVGElement>) {
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
    function handleCompositionStart(event: React.CompositionEvent<HTMLInputElement>) {
      composingRef.current = true;
      isFunction(onCompositionStart) && onCompositionStart(event);
    }
    function handleCompositionEnd(event: React.CompositionEvent<HTMLInputElement>) {
      if (composingRef.current) {
        composingRef.current = false;
        handleChange(event);
      }
      setComposingValue('');
      isFunction(onCompositionEnd) && onCompositionEnd(event);
    }

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
        onMouseEnter={() => toggleIsHover(true)}
        onMouseLeave={() => toggleIsHover(false)}
      >
        {prefixIconContent}
        {renderInput}
        {suffixIconContent}
      </div>
    );
  },
  { Group: InputGroup },
);

Input.displayName = 'Input';

export default Input;
