import React, { Children, isValidElement, cloneElement } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';

import { TdOptionGroupProps, SelectValue } from '../type';
import { optionGroupDefaultProps } from '../defaultProps';
import useDefaultProps from '../../hooks/useDefaultProps';

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

const OptionGroup: React.FC<SelectGOptionGroupProps> = (props) => {
  const { children, label, selectedValue, onSelect, divider, multiple } = useDefaultProps<SelectGOptionGroupProps>(
    props,
    optionGroupDefaultProps,
  );

  const { classPrefix } = useConfig();

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement<SelectGOptionGroupProps>(child)) {
      const addedProps: SelectGOptionGroupProps = { selectedValue, onSelect, multiple };
      return cloneElement<SelectGOptionGroupProps>(child, { ...addedProps });
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

export default OptionGroup;
