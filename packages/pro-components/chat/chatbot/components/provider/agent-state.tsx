import React from 'react';
import { useAgentState, AgentStateContext } from '../../hooks/useAgentState';

// 导出 Provider 组件
export const AgentStateProvider: React.FC<{
  children: React.ReactNode;
  initialState?: Record<string, any>;
}> = ({ children, initialState = {} }) => {
  const { state, stateKey } = useAgentState({
    initialState,
  });

  return (
    <AgentStateContext.Provider value={{ state, stateKey }}>
      {children}
    </AgentStateContext.Provider>
  );
};
