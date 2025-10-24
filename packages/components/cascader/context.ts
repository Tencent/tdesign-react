import { createContext, useContext } from 'react';
import { CascaderContextType } from './interface';
import { CascaderPanelProps } from './components/Panel';

export const PanelContext = createContext<{
  cascaderContext: CascaderContextType;
  trigger: CascaderPanelProps['trigger'];
  option: CascaderPanelProps['option'];
  scroll: CascaderPanelProps['scroll'];
} | null>(null);

export const usePanelContext = () => useContext(PanelContext);
