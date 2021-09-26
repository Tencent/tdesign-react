import React, { Children, isValidElement, cloneElement } from 'react';
import useConfig from '../../_util/useConfig';

import { TdOptionGroupProps, SelectValue } from '../../_type/components/select';

export interface SelectGOptionGroupProps extends TdOptionGroupProps {
  selectedValue?: SelectValue;
  onSelect?: (
    value: string | number,
    context: { label?: React.ReactNode; selected?: boolean; event: React.MouseEvent },
  ) => void;
  children?: React.ReactNode;
}

const OptionGroup = (props: SelectGOptionGroupProps) => {
  const { children, label, selectedValue, onSelect } = props;

  const { classPrefix } = useConfig();

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const addedProps = { selectedValue, onSelect };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  return (
    <li className={`${classPrefix}-option-group`}>
      <ul className={`${classPrefix}-option-group-header`}>{label}</ul>
      <ul>{childrenWithProps}</ul>
    </li>
  );
};

export default OptionGroup;
