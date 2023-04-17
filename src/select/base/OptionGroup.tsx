import React, { Children, isValidElement, cloneElement } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';

import { TdOptionGroupProps, SelectValue } from '../type';
import { optionGroupDefaultProps } from '../defaultProps';

export interface SelectGOptionGroupProps extends TdOptionGroupProps {
  selectedValue?: SelectValue;
  onSelect?: (
    value: string | number,
    context: { label?: React.ReactNode; selected?: boolean; event: React.MouseEvent },
  ) => void;
  divider?: boolean;
  children?: React.ReactNode;
  multiple?: boolean;
}

const OptionGroup = (props: SelectGOptionGroupProps) => {
  const { children, label, selectedValue, onSelect, divider, multiple } = props;

  const { classPrefix } = useConfig();

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const addedProps = { selectedValue, onSelect, multiple };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  return (
    <li
      className={classNames(`${classPrefix}-select-option-group`, {
        [`${classPrefix}-select-option-group__divider`]: divider,
      })}
    >
      <ul className={`${classPrefix}-select-option-group__header`}>{label}</ul>
      <ul className={`${classPrefix}-select__list`}>{childrenWithProps}</ul>
    </li>
  );
  return;
};

OptionGroup.defaultProps = optionGroupDefaultProps;

export default OptionGroup;
