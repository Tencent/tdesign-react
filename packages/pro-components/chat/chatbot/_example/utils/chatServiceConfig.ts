import type { ChatRequestParams, AIMessageContent } from '@tdesign-react/chat';

interface ChatServiceConfigProps {
  setPlanningState: (state: any) => void;
  setCurrentStep: (step: string) => void;
  planningState: any;
}

export const createChatServiceConfig = ({
  setPlanningState,
  setCurrentStep,
  planningState,
}: ChatServiceConfigProps) => ({
  // 对话服务地址 - 使用现有的服务
  endpoint: `http://localhost:3000/sse/agui`,
  protocol: 'agui',
  stream: true,
  // 流式对话结束
  onComplete: (aborted: boolean, params?: RequestInit) => {
    console.log('旅游规划完成', aborted, params);
    return null;
  },
  // 流式对话过程中出错
  onError: (err: Error | Response) => {
    console.error('旅游规划服务错误:', err);
  },
  // 流式对话过程中用户主动结束对话
  onAbort: async () => {
    console.log('用户取消旅游规划');
  },
  // AG-UI协议消息处理 - 优先级高于内置处理
  onMessage: (chunk): AIMessageContent | undefined => {
    const { type, ...rest } = chunk.data;
    switch (type) {
      // ========== 步骤开始/结束事件处理 ==========
      case 'STEP_STARTED':
        console.log('步骤开始:', rest.stepName);
        setCurrentStep(rest.stepName);
        break;

      case 'STEP_FINISHED':
        console.log('步骤完成:', rest.stepName);
        setCurrentStep('');
        break;
      // ========== 状态管理事件处理 ==========
      case 'STATE_SNAPSHOT':
        setPlanningState(rest.snapshot);
        return {
          type: 'planningState',
          data: { state: rest.snapshot },
        } as any;

      case 'STATE_DELTA':
        // 应用状态变更到当前状态
        setPlanningState((prevState: any) => {
          if (!prevState) return prevState;

          const newState = { ...prevState };
          rest.delta.forEach((change: any) => {
            const { op, path, value } = change;
            if (op === 'replace') {
              // 简单的路径替换逻辑
              if (path === '/status') {
                newState.status = value;
              }
            } else if (op === 'add') {
              // 简单的路径添加逻辑
              if (path.startsWith('/itinerary/')) {
                if (!newState.itinerary) newState.itinerary = {};
                const key = path.split('/').pop();
                newState.itinerary[key] = value;
              }
            }
          });
          return newState;
        });

        // 返回更新后的状态组件
        return {
          type: 'planningState',
          data: { state: planningState },
        } as any;
    }
  },
  // 自定义请求参数
  onRequest: (innerParams: ChatRequestParams) => {
    const { prompt } = innerParams;
    return {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: 'travel_planner_uid',
        prompt,
        agentType: 'travel-planner',
      }),
    };
  },
});
