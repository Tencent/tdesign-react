import React, { useRef } from 'react';
import classNames from 'classnames';
import { get as lodashGet } from 'lodash-es';
import { StyledProps } from '../common';
import Radio, { RadioContext, RadioContextValue, RadioProps } from './Radio';
import useDefault from '../_util/useDefault';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { radioGroupDefaultProps } from './defaultProps';
import type { TdRadioGroupProps } from './type';

export interface RadioGroupProps extends TdRadioGroupProps, StyledProps {
  children?: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const radioGroupClass = usePrefixClass('radio-group');
  const {
    disabled,
    icon,
    options,
    value,
    defaultValue,
    children,
    readonly,
    onChange,
    allowUncheck,
    borderless,
    className,
    style,
    placement,
    direction,
    keys,
  } = useDefaultProps(props, radioGroupDefaultProps);
  const groupRef = useRef(null);
  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);

  const context: RadioContextValue = {
    inject: (radioProps: RadioProps) => {
      const injectProps = { ...radioProps, direction } as RadioProps;
      if (typeof injectProps.checked !== 'undefined') {
        return injectProps;
      }
      return {
        ...injectProps,
        checked:
          typeof internalValue !== 'undefined' &&
          typeof radioProps.value !== 'undefined' &&
          internalValue === radioProps.value,
        disabled: radioProps.disabled || disabled,
        icon: radioProps.icon || icon,
        readonly: radioProps.readonly || readonly,
        allowUncheck: radioProps.allowUncheck || allowUncheck,
        borderless: radioProps.borderless || borderless,
        placement: radioProps.placement || placement,
        onChange: (checked, { e }) => {
          if (typeof radioProps.onChange === 'function') {
            radioProps.onChange(checked, { e });
          }
          setInternalValue(radioProps.value, { e, name: props.name });
        },
      };
    },
  };

  const renderOptions = () =>
    options.map((option, index) => {
      if (typeof option === 'number' || typeof option === 'string') {
        return (
          <Radio value={option} key={option} label={option}>
            {option}
          </Radio>
        );
      }
      return (
        <Radio
          value={lodashGet(option, keys?.value ?? 'value')}
          key={index}
          disabled={lodashGet(option, keys?.disabled ?? 'disabled')}
          label={lodashGet(option, keys?.label ?? 'label')}
        />
      );
    });
  return (
    <div
      ref={groupRef}
      style={style}
      className={classNames(radioGroupClass, `${radioGroupClass}--${direction}`, className)}
    >
      <RadioContext.Provider value={context}>{options?.length ? renderOptions() : children}</RadioContext.Provider>
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
