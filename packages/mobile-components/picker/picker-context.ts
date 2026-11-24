import React from 'react';
import { TdPickerProps } from './type';

const PickerContext = React.createContext<Pick<TdPickerProps, 'value' | 'onChange' | 'keys'>>(null);

export default PickerContext;
