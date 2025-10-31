import React from 'react';
import { AgentStateContext, type StateActionOptions, useAgentState } from '../../hooks/useAgentState';

// 导出 Provider 组件
export const AgentStateProvider = ({ children, initialState = {}, subscribeKey }: StateActionOptions & {
  children: React.ReactNode;
}) => {
  const agentStateResult = useAgentState({
    initialState,
    subscribeKey,
  });

  return (
    <AgentStateContext.Provider value={agentStateResult}>
      {children}
    </AgentStateContext.Provider>
  );
};
