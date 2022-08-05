import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import { pxCompat } from '../_util/helper';
import TDivider from '../divider';
import useConfig from '../_util/useConfig';
import PropTypes from 'prop-types';
import { dropdownItemDefaultProps } from './defaultProps';

const DropdownItem = ({
  children,
  className,
  active,
  disabled,
  value,
  theme,
  maxColumnWidth,
  minColumnWidth,
  ...props
}) => {
  const { classPrefix } = useConfig();
  return (
    <li
      key={value}
      className={classNames(className, `${classPrefix}-dropdown-item-theme-${theme}`, {
        [`${classPrefix}-dropdown-item-active`]: active,
        [`${classPrefix}-dropdown-item-disabled`]: disabled,
      })}
      {...props}
    >
      {children}
    </li>
  );
};

DropdownItem.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

DropdownItem.defaultProps = {
  children: null,
  theme: 'default',
  onClick: () => null,
  active: false,
  className: null,
  disabled: false,
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
