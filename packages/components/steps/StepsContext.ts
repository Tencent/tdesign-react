import React from 'react';
import { TdStepsProps } from './type';

const StepsContext = React.createContext<{
  current: TdStepsProps['current'];
  theme: TdStepsProps['theme'];
  readOnly: TdStepsProps['readOnly'];
  onChange: TdStepsProps['onChange'];
}>({
  current: 0,
  theme: 'default',
  readOnly: false,
  onChange: null,
});

export default StepsContext;
