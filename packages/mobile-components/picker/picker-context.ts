import React from 'react';

import type { TdPickerProps } from './type';

const PickerContext = React.createContext<Pick<TdPickerProps, 'value' | 'onChange' | 'keys'>>(null);

export default PickerContext;
