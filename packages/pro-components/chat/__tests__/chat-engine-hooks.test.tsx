/**
 * chat-engine hooks 迁移回归守卫
 *
 * chat-engine 是本包中已有的纯 React 逻辑层（hooks + 生成式 UI），
 * 不受 reactify 包装影响，但会随迁移一起重构，因此同样需要基线守卫。
 * 这里只守「返回值形状」这一宏观契约，不断言内部状态机细节。
 */
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@test/utils';

import { useAgentState } from '../chat-engine/hooks/useAgentState';
import { useChat } from '../chat-engine/hooks/useChat';
import { flushRender } from './helpers';

describe('useChat', () => {
  it('返回 chatEngine / messages / status 三件套', async () => {
    const { result } = renderHook(() =>
      useChat({
        chatServiceConfig: { endpoint: 'https://example.invalid/api' } as any,
      }),
    );

    await act(async () => {
      await flushRender(100);
    });

    expect(result.current).toHaveProperty('chatEngine');
    expect(Array.isArray(result.current.messages)).toBe(true);
    expect(typeof result.current.status).toBe('string');
  });

  it('初始 status 为 idle', async () => {
    const { result } = renderHook(() =>
      useChat({
        chatServiceConfig: { endpoint: 'https://example.invalid/api' } as any,
      }),
    );

    await act(async () => {
      await flushRender(100);
    });

    expect(result.current.status).toBe('idle');
  });
});

describe('useAgentState', () => {
  it('initialState 进入 stateMap 且可读回', () => {
    const { result } = renderHook(() => useAgentState({ initialState: { count: 1 } }));

    expect(result.current.stateMap).toMatchObject({ count: 1 });
    expect(result.current.getCurrentState()).toMatchObject({ count: 1 });
  });

  it('暴露状态读写接口', () => {
    const { result } = renderHook(() => useAgentState({ initialState: { count: 1 } }));

    expect(typeof result.current.setStateMap).toBe('function');
    expect(typeof result.current.getStateByKey).toBe('function');
  });
});
