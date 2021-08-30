import React from 'react';
import { TdStepsProps } from '../_type/components/steps';

const StepsContext = React.createContext<{
  current: TdStepsProps['current'];
  currentStatus: TdStepsProps['status'];
  theme: TdStepsProps['theme'];
}>({ current: 0, currentStatus: 'process', theme: 'default' });

export default StepsContext;
