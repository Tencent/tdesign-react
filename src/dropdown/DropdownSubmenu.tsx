import React from 'react';
import PropTypes from 'prop-types';

const DropdownSubmenu = ({ children, ...props }) => (
  <div {...props}>
    <ul>{children}</ul>
  </div>
);

DropdownSubmenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

DropdownSubmenu.defaultProps = {
  children: null,
  className: null,
};

DropdownSubmenu.displayName = 'DropdownSubmenu';

export default DropdownSubmenu;
