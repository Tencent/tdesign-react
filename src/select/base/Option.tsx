import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { SelectOption } from '../SelectProps';

const Option = (props: SelectOption) => {
  const { classPrefix } = useConfig();
  const { disabled, size, value, label } = props;
  const componentType = 'select';

  return (
    <li
      className={classNames(props.className, `${classPrefix}-${componentType}-option`, {
        [`${classPrefix}-is-disabled`]: disabled,
        't-size-s': size === 'small',
        't-size-l': size === 'large',
      })}
      key={value}
    >
      {label}
    </li>
  );
};

export default Option;
