import React from 'react';
import noop from 'lodash-es/noop';

import { dropdownMenuDefaultProps } from './defaultProps';

const DropdownMenuContext = React.createContext({
  ...dropdownMenuDefaultProps,
  activedId: '',
  onChangeActivedId: noop,
});

export default DropdownMenuContext;
