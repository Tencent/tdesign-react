import React from 'react';
import { useAgentState, AgentStateContext, type StateActionOptions } from '../../hooks/useAgentState';

// 导出 Provider 组件
export const AgentStateProvider = ({ children, initialState = {}, stateKey }: StateActionOptions & {
  children: React.ReactNode;
}) => {
  const agentStateResult = useAgentState({
    initialState,
    stateKey,
  });

  return (
    <AgentStateContext.Provider value={agentStateResult}>
      {children}
    </AgentStateContext.Provider>
  );
};
