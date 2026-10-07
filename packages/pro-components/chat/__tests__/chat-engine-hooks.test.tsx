import './setup';

import React, { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ChatEngine from '@tdesign/ai-chat-engine';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { useAgentState } from '../chat-engine/hooks/useAgentState';
import { useChat } from '../chat-engine/hooks/useChat';
import { history, message } from './helpers';

describe('chat-engine-hooks public contracts', () => {
  it('owns exactly one live initialized engine during StrictMode and destroys it on unmount', async () => {
    const init = vi.spyOn(ChatEngine.prototype, 'init');
    const destroy = vi.spyOn(ChatEngine.prototype, 'destroy');
    let engine: ChatEngine;
    const Consumer = () => {
      const result = useChat({
        chatServiceConfig: {},
        defaultMessages: history,
      });
      engine = result.chatEngine;
      return <span>{result.ready ? result.messages.length : '初始化'}</span>;
    };
    const view = render(
      <StrictMode>
        <Consumer />
      </StrictMode>,
    );
    await screen.findByText('2');
    expect(new Set(init.mock.instances).size).toBe(1);
    expect(destroy).not.toHaveBeenCalled();
    view.unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(destroy).toHaveBeenCalledOnce();
    expect(destroy.mock.instances[0]).toBe(engine);
  });
  it('does not reset a live conversation when defaultMessages is an inline empty array', async () => {
    let engine: ChatEngine;
    const Consumer = () => {
      const result = useChat({ defaultMessages: [], chatServiceConfig: {} });
      engine = result.chatEngine;
      return <span>{result.messages.map((m) => m.id).join(',') || '空'}</span>;
    };
    render(<Consumer />);
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      engine?.setMessages([message]);
    });
    expect(screen.getByText('a')).toBeVisible();
  });
  it('keeps agent initial state readable and updates it through the public setter', () => {
    const Counter = () => {
      const { stateMap, setStateMap, getStateByKey } = useAgentState({ initialState: { count: 1 } });
      return <button onClick={() => setStateMap({ count: getStateByKey('count') + 1 })}>计数 {stateMap.count}</button>;
    };
    render(<Counter />);
    fireEvent.click(screen.getByRole('button', { name: '计数 1' }));
    expect(screen.getByRole('button', { name: '计数 2' })).toBeVisible();
  });
});
