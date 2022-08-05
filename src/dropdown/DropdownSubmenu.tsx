import React from 'react';
import PropTypes from 'prop-types';

const DropdownSubmenu = ({ children, position, ...props }) => {
  return (
    <div
      {...props}
    >
      <ul>{children}</ul>
    </div>
  );
};

DropdownSubmenu.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

DropdownSubmenu.defaultProps = {
  children: null,
  position: 'left',
  className: null,
};

DropdownSubmenu.displayName = 'DropdownSubmenu';

export default DropdownSubmenu;
