import '../../../__tests__/setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, renderHook, waitFor } from '@testing-library/react';

import { text } from '../../../__tests__/helpers';
import { ActivityRenderer } from '../../components/activity';
import { useAgentActivity } from '../useAgentActivity';

describe('useAgentActivity', () => {
  describe('scenarios', () => {
    test('automatic registration: renders activity content and cleans up on unmount', async () => {
      const config = { activityType: 'test-activity', component: () => <span>活动已注册</span> };
      const { result, unmount } = renderHook(() => useAgentActivity(config));
      expect(result.current.isRegistered('test-activity')).toBe(true);
      const activity = { activityType: 'test-activity', content: {}, messageId: 'message-1' };
      const view = render(<ActivityRenderer activity={activity} />);
      await waitFor(() => expect(text(view.container)).toContain('活动已注册'));
      unmount();
      expect(result.current.isRegistered('test-activity')).toBe(false);
      view.unmount();
      const afterUnmount = render(<ActivityRenderer activity={activity} />);
      expect(text(afterUnmount.container)).not.toContain('活动已注册');
    });
  });
});
