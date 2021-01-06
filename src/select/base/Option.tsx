import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import types from '../util/types';
import { SelectOption, SelectLabeledValue } from '../SelectProps';

const Option = (props: SelectOption) => {
  const { classPrefix } = useConfig();
  const { disabled, size, value, multiple, selectedValue, onSelect, children } = props;
  const label = props.label || value;
  const componentType = 'select';
  console.log(value, selectedValue);
  let selected = value === selectedValue;

  if (multiple && Array.isArray(selectedValue)) {
    selected = selectedValue.some((item) => {
      if (types.isNumber(item) || types.isString(item)) {
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

  const renderItem = (children) => {
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
    return <>{children || label}</>;
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
    >
      {renderItem(children)}
    </li>
  );
};

export default Option;
