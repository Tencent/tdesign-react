import React from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';
import { SelectOption } from '../SelectProps';

const Option = (props: SelectOption) => {
  const { classPrefix } = useConfig();
  const componentType = 'select';

  return (
    <li
      className={classNames(props.className, `${classPrefix}-${componentType}-option`, {
        [`${classPrefix}-is-disabled`]: props.disabled,
      })}
      key={props.value}
    >
      {props.label}
    </li>
  );
};

export default Option;
