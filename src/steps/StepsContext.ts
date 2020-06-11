import React from 'react';
import { StepsProps } from './StepsProps';

export const StepsContext = React.createContext<{
  current: StepsProps['current'];
  currentStatus: StepsProps['status'];
  type: StepsProps['type'];
}>({ current: 1, currentStatus: 'process', type: 'default' });
