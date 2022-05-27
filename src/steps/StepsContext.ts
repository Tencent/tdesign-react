import React from 'react';
import { TdStepsProps } from './type';

const StepsContext = React.createContext<{
  current: TdStepsProps['current'];
  theme: TdStepsProps['theme'];
  readonly: TdStepsProps['readonly'];
  onChange: TdStepsProps['onChange'];
}>({
  current: 0,
  theme: 'default',
  readonly: false,
  onChange: null,
});

export default StepsContext;
