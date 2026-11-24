import React from 'react';
import { describe, it, expect, render, screen, fireEvent, vi } from '@test/utils';
import Avatar from '../Avatar';
import { AvatarGroupContext, AvatarGroupContextProvider } from '../AvatarGroupContext';

describe('AvatarGroupContextProvider', () => {
  it('renders children', () => {
    render(
      <AvatarGroupContextProvider size="large" shape="round">
        <div data-testid="child">child</div>
      </AvatarGroupContextProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides size and shape via context', () => {
    const Probe = () => {
      const ctx = React.useContext(AvatarGroupContext);
      return (
        <>
          <span data-testid="size">{String(ctx?.size)}</span>
          <span data-testid="shape">{String(ctx?.shape)}</span>
        </>
      );
    };

    render(
      <AvatarGroupContextProvider size="small" shape="circle">
        <Probe />
      </AvatarGroupContextProvider>,
    );

    expect(screen.getByTestId('size')).toHaveTextContent('small');
    expect(screen.getByTestId('shape')).toHaveTextContent('circle');
  });

  it('keeps context value stable when size/shape unchanged (memoized)', () => {
    const renderSpy = vi.fn();

    const Consumer = React.memo(() => {
      // Re-render only when context value identity changes
      const ctx = React.useContext(AvatarGroupContext);
      renderSpy(ctx);
      return <div data-testid="consumer" />;
    });

    const Wrapper: React.FC = () => {
      const [tick, setTick] = React.useState(0);
      return (
        <div>
          <button data-testid="btn" onClick={() => setTick((t) => t + 1)}>
            tick {tick}
          </button>
          <AvatarGroupContextProvider size="large" shape="round">
            <Consumer />
          </AvatarGroupContextProvider>
        </div>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    // Initial render
    expect(renderSpy).toHaveBeenCalledTimes(1);

    // Trigger parent re-renders without changing size/shape
    fireEvent.click(getByTestId('btn'));
    fireEvent.click(getByTestId('btn'));

    // Should still be called once because context value identity is stable
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('Avatar consumes context: applies size/shape and border classes', () => {
    const { container } = render(
      <AvatarGroupContextProvider size="large" shape="round">
        <Avatar>A</Avatar>
      </AvatarGroupContextProvider>,
    );

    // Inner avatar element
    const avatarEl = container.querySelector('.t-avatar');
    expect(avatarEl).toBeTruthy();

    // Size and shape classes
    expect(avatarEl.classList.contains('t-avatar--large')).toBe(true);
    expect(avatarEl.classList.contains('t-avatar--round')).toBe(true);

    // Border classes are added when within group
    expect(avatarEl.className).toMatch(/t-avatar--border/);
    expect(avatarEl.className).toMatch(/t-avatar--border-large/);
  });

  it('Avatar with custom size from context uses medium class but inline size style', () => {
    const { container } = render(
      <AvatarGroupContextProvider size="20px" shape="circle">
        <Avatar>A</Avatar>
      </AvatarGroupContextProvider>,
    );

    const avatarEl = container.querySelector('.t-avatar') as HTMLDivElement;
    expect(avatarEl).toBeTruthy();

    // For custom size, class falls back to medium
    expect(avatarEl.classList.contains('t-avatar--medium')).toBe(true);

    // Inline styles reflect custom size
    expect(avatarEl.style.width).toBe('20px');
    expect(avatarEl.style.height).toBe('20px');
  });
});
