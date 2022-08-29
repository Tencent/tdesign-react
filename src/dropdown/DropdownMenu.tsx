import React from 'react';
import PropTypes from 'prop-types';

const DropdownMenu = ({ children, ...props }) => (
  <div {...props}>
    <ul>{children}</ul>
  </div>
);

DropdownMenu.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

DropdownMenu.defaultProps = {
  children: null,
  className: null,
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
