import React from 'react';
import { TdStepsProps } from './type';

const StepsContext = React.createContext<{
  current: TdStepsProps['current'];
  theme: TdStepsProps['theme'];
}>({ current: 0, theme: 'default' });

export default StepsContext;
