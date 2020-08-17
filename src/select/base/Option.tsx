import { isNumber, isString } from 'util';
import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { SelectOption } from '../SelectProps';

const Option = (props: SelectOption) => {
  const { classPrefix } = useConfig();
  const { disabled, size, value, multiple, selectedValue, onSelect } = props;
  const label = props.label || value;
  const componentType = 'select';
  let selected = value === selectedValue;

  if (multiple && Array.isArray(selectedValue)) {
    selected = selectedValue.some((item) => {
      if (isNumber(item) || isString(item)) {
        return item === value;
      }
      return item.value === value;
    });
  }

  const handleSelect = () => {
    if (!disabled) {
      onSelect(value, label, selected);
    }
  };

  const renderItem = () => {
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
          <span className={classNames(`${classPrefix}-checkbox__label`)}>{label}</span>
        </label>
      );
    }
    return <React.Fragment>{label}</React.Fragment>;
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
      {renderItem()}
    </li>
  );
};

export default Option;
