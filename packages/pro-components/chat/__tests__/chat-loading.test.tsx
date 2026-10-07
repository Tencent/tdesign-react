import './setup';

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChatLoading } from '../chat-loading';

describe('chat-loading public contracts', () => {
  it.each(['moving', 'circle', 'gradient', 'skeleton', 'dots'] as const)('announces loading for %s', (animation) => {
    render(<ChatLoading animation={animation} text="加载" />);
    expect(screen.getByRole('status')).toHaveTextContent('加载');
  });
});
