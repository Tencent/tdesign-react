import React from 'react';
import { TdTimeLineProps } from './type';

const StepsContext = React.createContext<{
  theme: TdTimeLineProps['theme'];
  reverse: TdTimeLineProps['reverse'];
  itemsStatus: string[];
}>({
  theme: 'default',
  reverse: false,
  itemsStatus: [],
});

export default StepsContext;
