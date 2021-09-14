import React, { useRef } from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import useConfig from '../../_util/useConfig';
import useRipple from '../../_util/useRipple';
import { StyledProps } from '../../_type/StyledProps';
import { SelectValue, TdOptionProps, TdSelectProps, Options } from '../../_type/components/select';

/**
 * Option 组件属性
 */
export interface SelectOptionProps
  extends StyledProps,
    TdOptionProps,
    Pick<TdSelectProps, 'size' | 'multiple' | 'max'> {
  selectedValue?: SelectValue;
  children?: React.ReactNode;
  onSelect?: (
    value: string | number,
    context: { label?: string | number; selected?: boolean; event: React.MouseEvent },
  ) => void;
}

type SelectLabeledValue = Required<Omit<Options, 'disabled'>>;

const Option = (props: SelectOptionProps) => {
  const { disabled: propDisabled, size, max, value, multiple, selectedValue, onSelect, children } = props;
  const label = props.label || value;
  const componentType = 'select';
  let selected = value === selectedValue;

  const disabled = propDisabled || (multiple && Array.isArray(selectedValue) && max && selectedValue.length >= max);

  const { classPrefix } = useConfig();
  const optionRef = useRef();

  // 使用斜八角动画
  useRipple(optionRef);

  if (multiple && Array.isArray(selectedValue)) {
    selected = selectedValue.some((item) => {
      if (isNumber(item) || isString(item)) {
        // 如果非object类型
        return item === value;
      }
      return (item as SelectLabeledValue).value === value;
    });
  }

  const handleSelect = (event: React.MouseEvent) => {
    if (!disabled) {
      onSelect(value, { label, selected, event });
    }
  };

  const renderItem = (children: React.ReactNode) => {
    if (multiple) {
      return (
        <label
          className={classNames(`${classPrefix}-checkbox`, {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-checked`]: selected,
          })}
        >
          <input
            type="checkbox"
            className={classNames(`${classPrefix}-checkbox__former`)}
            value=""
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
          />
          <span className={classNames(`${classPrefix}-checkbox__input`)}></span>
          <span className={classNames(`${classPrefix}-checkbox__label`)}>{children || label}</span>
        </label>
      );
    }
    return <span>{children || label}</span>;
  };

  return (
    <li
      className={classNames(props.className, `${classPrefix}-${componentType}-option`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-selected`]: selected,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
      })}
      key={value}
      onClick={handleSelect}
      ref={optionRef}
    >
      {renderItem(children)}
    </li>
  );
};

export default Option;
