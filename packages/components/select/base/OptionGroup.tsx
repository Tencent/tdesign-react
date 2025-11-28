import React from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';

import type { TdOptionGroupProps } from '../type';
import type { StyledProps } from '../../common';

import { optionGroupDefaultProps } from '../defaultProps';
import useDefaultProps from '../../hooks/useDefaultProps';

export interface SelectGOptionGroupProps extends TdOptionGroupProps, StyledProps {
  children?: React.ReactNode;
}

const OptionGroup: React.FC<SelectGOptionGroupProps> = (props) => {
  const { children, label, divider, className, style } = useDefaultProps<SelectGOptionGroupProps>(
    props,
    optionGroupDefaultProps,
  );

  const { classPrefix } = useConfig();

  return (
    <li
      className={classNames(
        `${classPrefix}-select-option-group`,
        {
          [`${classPrefix}-select-option-group__divider`]: divider,
        },
        className,
      )}
      style={style}
    >
      {(label ?? false) && <div className={`${classPrefix}-select-option-group__header`}>{label}</div>}
      {children}
    </li>
  );
};

export default OptionGroup;
