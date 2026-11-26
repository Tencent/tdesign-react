import '../../../__tests__/setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { act, render, renderHook, waitFor } from '@testing-library/react';

import { text } from '../../../__tests__/helpers';
import { ToolCallRenderer } from '../../components/toolcall';
import { useAgentToolcall } from '../useAgentToolcall';

describe('useAgentToolcall', () => {
  describe('scenarios', () => {
    test('register: makes a toolcall available to its renderer and unregister removes it', async () => {
      const { result } = renderHook(() => useAgentToolcall());
      act(() =>
        result.current.register({
          name: 'test-tool',
          description: '测试工具',
          component: () => <span>工具已注册</span>,
        }),
      );
      expect(result.current.isRegistered('test-tool')).toBe(true);
      expect(result.current.getRegistered()).toContain('test-tool');
      const toolCall = { toolCallId: 'tool-1', toolCallName: 'test-tool', args: '{}' };
      const view = render(<ToolCallRenderer toolCall={toolCall} />);
      await waitFor(() => expect(text(view.container)).toContain('工具已注册'));
      act(() => result.current.unregister('test-tool'));
      expect(result.current.isRegistered('test-tool')).toBe(false);
      view.unmount();
      const afterUnregister = render(<ToolCallRenderer toolCall={toolCall} />);
      expect(text(afterUnregister.container)).not.toContain('工具已注册');
    });
  });
});
