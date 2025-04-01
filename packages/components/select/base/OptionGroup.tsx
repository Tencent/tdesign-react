import React from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';

import { TdOptionGroupProps } from '../type';
import { optionGroupDefaultProps } from '../defaultProps';
import useDefaultProps from '../../hooks/useDefaultProps';

export interface SelectGOptionGroupProps extends TdOptionGroupProps {
  children?: React.ReactNode;
}

const OptionGroup: React.FC<SelectGOptionGroupProps> = (props) => {
  const { children, label, divider } = useDefaultProps<SelectGOptionGroupProps>(props, optionGroupDefaultProps);

  const { classPrefix } = useConfig();

  return (
    <li
      className={classNames(`${classPrefix}-select-option-group`, {
        [`${classPrefix}-select-option-group__divider`]: divider,
      })}
    >
      {(label ?? false) && <div className={`${classPrefix}-select-option-group__header`}>{label}</div>}
      {children}
    </li>
  );
  return;
};

export default OptionGroup;
