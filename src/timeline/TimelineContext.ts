import React from 'react';
import { TdTimeLineProps } from './type';

const StepsContext = React.createContext<{
  theme: TdTimeLineProps['theme'];
  reverse: TdTimeLineProps['reverse'];
  itemsStatus: string[];
  layout: TdTimeLineProps['layout'];
  globalAlign?: TdTimeLineProps['align'];
}>({
  theme: 'default',
  reverse: false,
  itemsStatus: [],
  layout: 'vertical',
});

export default StepsContext;
