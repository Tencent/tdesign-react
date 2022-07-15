import React from 'react';
import { TdTimeLineProps } from './type';

const StepsContext = React.createContext<{
  theme: TdTimeLineProps['theme'];
}>({
  theme: 'default',
});

export default StepsContext;
