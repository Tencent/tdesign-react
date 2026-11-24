import noop from 'lodash-es/noop';
import React from 'react';
import { dropdownMenuDefaultProps } from './defaultProps';

const DropdownMenuContext = React.createContext({
  ...dropdownMenuDefaultProps,
  activedId: '',
  onChangeActivedId: noop,
});

export default DropdownMenuContext;
