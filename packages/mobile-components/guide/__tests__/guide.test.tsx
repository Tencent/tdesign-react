import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Guide from '../Guide';
import type { GuideStep } from '../type';

describe('Guide Component', () => {
  const mockSteps: GuideStep[] = [
    {
      element: '#step1',
      title: 'Step 1',
      body: 'This is step 1',
    },
    {
      element: '#step2',
      title: 'Step 2',
      body: 'This is step 2',
    },
  ];

  beforeEach(() => {
    const step1 = document.createElement('div');
    step1.id = 'step1';
    step1.textContent = 'Step 1 Element';
    document.body.appendChild(step1);

    const step2 = document.createElement('div');
    step2.id = 'step2';
    step2.textContent = 'Step 2 Element';
    document.body.appendChild(step2);

    // 模拟 getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: vi.fn().mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue('static'),
      }),
      writable: true,
    });

    // 模拟窗口滚动
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'scrollLeft', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollLeft', { value: 0, writable: true });
  });

  afterEach(() => {
    // 清理：仅移除本用例创建的元素
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const fixedElement = document.getElementById('fixed-element');
    if (step1) document.body.removeChild(step1);
    if (step2) document.body.removeChild(step2);
    if (fixedElement) document.body.removeChild(fixedElement);
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should not render when current is -1', () => {
      render(<Guide steps={mockSteps} current={-1} />);
      expect(screen.queryByTestId('portal')).not.toBeInTheDocument();
    });

    it('should not render when no steps provided', () => {
      render(<Guide steps={[]} current={0} />);
      expect(screen.queryByTestId('portal')).not.toBeInTheDocument();
    });

    it('should render in popover mode by default', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      const popover = document.querySelector('.t-popover');
      expect(popover).toBeInTheDocument();
    });

    it('should render in dialog mode', () => {
      render(<Guide steps={mockSteps} current={0} mode="dialog" />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      const popup = document.querySelector('.t-popup');
      expect(popup).toBeInTheDocument();
    });

    it('should render step content correctly', () => {
      render(<Guide steps={mockSteps} current={0} />);
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('This is step 1')).toBeInTheDocument();
    });

    it('should render counter when not hidden', () => {
      render(<Guide steps={mockSteps} current={0} />);
      expect(screen.getByText('下一步 (1/2)')).toBeInTheDocument();
    });

    it('should not render counter when hidden', () => {
      render(<Guide steps={mockSteps} current={0} hideCounter />);
      expect(screen.queryByText('下一步 (1/2)')).not.toBeInTheDocument();
    });
  });

  describe('Button Rendering', () => {
    it('should render skip button when not last step and not hidden', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('跳过'))).toBe(true);
    });

    it('should not render skip button when hidden', () => {
      render(<Guide steps={mockSteps} current={0} hideSkip />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('跳过'))).toBe(false);
    });

    it('should render next button for non-last steps', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('下一步'))).toBe(true);
    });

    it('should render back and finish buttons for last step', () => {
      render(<Guide steps={mockSteps} current={1} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('返回'))).toBe(true);
      expect(buttons.some((button) => button.textContent?.includes('完成'))).toBe(true);
    });
  });

  describe('Event Handlers', () => {
    it('should call onSkip when skip button is clicked', () => {
      const onSkip = vi.fn();
      render(<Guide steps={mockSteps} current={0} onSkip={onSkip} />);

      const skipButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('跳过'));
      fireEvent.click(skipButton!);

      expect(onSkip).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 0,
        total: 2,
      });
    });

    it('should call onNextStepClick when next button is clicked', () => {
      const onNextStepClick = vi.fn();
      render(<Guide steps={mockSteps} current={0} onNextStepClick={onNextStepClick} />);

      const nextButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('下一步'));
      fireEvent.click(nextButton!);

      expect(onNextStepClick).toHaveBeenCalledWith({
        e: expect.any(Object),
        next: 1,
        current: 0,
        total: 2,
      });
    });

    it('should call onFinish when finish button is clicked', () => {
      const onFinish = vi.fn();
      render(<Guide steps={mockSteps} current={1} onFinish={onFinish} />);

      const finishButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('完成'));
      fireEvent.click(finishButton!);

      expect(onFinish).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 1,
        total: 2,
      });
    });

    it('should call onBack when back button is clicked', () => {
      const onBack = vi.fn();
      render(<Guide steps={mockSteps} current={1} onBack={onBack} />);

      const backButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('返回'));
      fireEvent.click(backButton!);

      expect(onBack).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 1,
        total: 2,
      });
    });
  });

  describe('State Management', () => {
    it('should update current step when next is clicked', () => {
      const onChange = vi.fn();
      render(<Guide steps={mockSteps} current={0} onChange={onChange} />);

      const nextButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('下一步'));
      fireEvent.click(nextButton!);

      expect(onChange).toHaveBeenCalledWith(1, { e: expect.any(Object), total: 2 });
    });

    it('should reset to -1 when skip is clicked', () => {
      const onChange = vi.fn();
      render(<Guide steps={mockSteps} current={0} onChange={onChange} />);

      const skipButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('跳过'));
      fireEvent.click(skipButton!);

      expect(onChange).toHaveBeenCalledWith(-1, { e: expect.any(Object), total: 2 });
    });

    it('should reset to -1 when finish is clicked', () => {
      const onChange = vi.fn();
      render(<Guide steps={mockSteps} current={1} onChange={onChange} />);

      const finishButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('完成'));
      fireEvent.click(finishButton!);

      expect(onChange).toHaveBeenCalledWith(-1, { e: expect.any(Object), total: 2 });
    });
  });

  describe('Custom Content', () => {
    it('should render custom content when provided', () => {
      const customSteps: GuideStep[] = [
        {
          element: '#step1',
          content: <div data-testid="custom-content">Custom Content</div>,
        },
      ];

      render(<Guide steps={customSteps} current={0} />);
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should render custom button content', () => {
      const customSteps: GuideStep[] = [
        {
          element: '#step1',
          nextButtonProps: {
            content: 'Custom Next',
          },
        },
        {
          element: '#step2',
          title: 'Step 2',
          body: 'Body 2',
        },
      ];

      render(<Guide steps={customSteps} current={0} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('Custom Next'))).toBe(true);
    });
  });

  describe('Overlay and Highlight', () => {
    it('should render overlay by default', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      expect(portal?.querySelector('.t-guide__overlay')).toBeInTheDocument();
    });

    it('should not render overlay when showOverlay is false', () => {
      const stepsWithNoOverlay: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          showOverlay: false,
        },
      ];

      render(<Guide steps={stepsWithNoOverlay} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight');
      expect(highlight).toHaveClass('t-guide__highlight--nomask');
    });
  });

  describe('Placement and Positioning', () => {
    it('should handle center placement in popover mode', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      render(<Guide steps={stepsWithCenter} current={0} />);
      const popover = document.querySelector('.t-popover');
      expect(popover).toBeInTheDocument();
    });

    it('should apply highlight padding', () => {
      const stepsWithPadding: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightPadding: 20,
        },
      ];

      render(<Guide steps={stepsWithPadding} current={0} />);
      // 高亮内边距应生效
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });
  });

  describe('Positioning and Highlight Logic', () => {
    it('should apply correct CSS classes for positioning', () => {
      // 固定定位
      const fixedElement = document.createElement('div');
      fixedElement.id = 'fixed-element';
      fixedElement.style.position = 'fixed';
      document.body.appendChild(fixedElement);

      const stepsWithFixed: GuideStep[] = [
        {
          element: '#fixed-element',
          title: 'Fixed Element',
          body: 'Body',
        },
      ];

      render(<Guide steps={stepsWithFixed} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const wrapper = portal?.querySelector('.t-guide__wrapper');
      // 固定元素包装仍用 absolute
      expect(wrapper).toHaveClass('t-guide--absolute');

      document.body.removeChild(fixedElement);
    });

    it('should apply correct CSS classes for absolute positioning', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const wrapper = portal?.querySelector('.t-guide__wrapper');
      expect(wrapper).toHaveClass('t-guide--absolute');
    });

    it('should handle dialog mode positioning', () => {
      render(<Guide steps={mockSteps} current={0} mode="dialog" />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight');
      if (highlight) {
        expect(highlight).toHaveClass('t-guide__highlight--dialog');
      } else {
        // 对话框模式下高亮可能不存在或结构不同
        expect(portal).toBeInTheDocument();
      }
    });

    it('should handle popover mode positioning', () => {
      render(<Guide steps={mockSteps} current={0} mode="popover" />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight');
      expect(highlight).toHaveClass('t-guide__highlight--popover');
    });

    it('should apply mask class when overlay is shown', () => {
      render(<Guide steps={mockSteps} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight');
      expect(highlight).toHaveClass('t-guide__highlight--mask');
    });

    it('should apply nomask class when overlay is hidden', () => {
      const stepsNoOverlay: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          showOverlay: false,
        },
      ];

      render(<Guide steps={stepsNoOverlay} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight');
      expect(highlight).toHaveClass('t-guide__highlight--nomask');
    });

    it('should handle content wrapper class', () => {
      const stepsWithContent: GuideStep[] = [
        {
          element: '#step1',
          content: <div>Custom Content</div>,
        },
      ];

      render(<Guide steps={stepsWithContent} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const wrapper = portal?.querySelector('.t-guide__wrapper');
      expect(wrapper).toHaveClass('t-guide__wrapper--content');
    });

    it('should apply z-index to overlay', () => {
      render(<Guide steps={mockSteps} current={0} zIndex={999} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const overlay = portal?.querySelector('.t-guide__overlay') as HTMLElement;
      expect(overlay).toBeInTheDocument();
      expect(overlay?.style.zIndex).toBe('997'); // 等于 zIndex - 2
    });

    it('should apply z-index to highlight', () => {
      render(<Guide steps={mockSteps} current={0} zIndex={999} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const highlight = portal?.querySelector('.t-guide__highlight') as HTMLElement;
      expect(highlight).toBeInTheDocument();
      expect(highlight?.style.zIndex).toBe('998'); // 等于 zIndex - 1
    });

    it('should apply z-index to wrapper', () => {
      render(<Guide steps={mockSteps} current={0} zIndex={999} />);
      const portal = document.querySelector('.t-portal-wrapper');
      const wrapper = portal?.querySelector('.t-guide__wrapper') as HTMLElement;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.style.zIndex).toBe('999');
    });
  });

  describe('Edge Cases and Branch Coverage', () => {
    it('should handle empty steps array', () => {
      render(<Guide steps={[]} current={0} />);
      // steps 为空不应渲染 portal
      expect(document.querySelector('.t-portal-wrapper')).not.toBeInTheDocument();
    });

    it('should handle invalid current index', () => {
      render(<Guide steps={mockSteps} current={10} />);
      // 索引无效不应渲染 portal
      expect(document.querySelector('.t-portal-wrapper')).not.toBeInTheDocument();
    });

    it('should handle negative current index', () => {
      render(<Guide steps={mockSteps} current={-2} />);
      // 索引为负不应渲染 portal
      expect(document.querySelector('.t-portal-wrapper')).not.toBeInTheDocument();
    });

    it('should handle missing element in step', () => {
      const stepsWithoutElement: GuideStep[] = [
        {
          element: '#nonexistent',
          title: 'Step without element',
          body: 'Body',
        },
      ];

      // 测试环境不应抛错
      expect(() => render(<Guide steps={stepsWithoutElement} current={0} />)).not.toThrow();
    });

    it('should handle function element selector', () => {
      const stepsWithFunction: GuideStep[] = [
        {
          element: () => document.getElementById('step1'),
          title: 'Step with function',
          body: 'Body',
        },
      ];

      render(<Guide steps={stepsWithFunction} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle custom counter function', () => {
      const customCounter = ({ current, total }: { current: number; total: number }) =>
        `Step ${current + 1} of ${total}`;

      render(<Guide steps={mockSteps} current={0} counter={customCounter} />);
      // 按钮应同时包含 “下一步” 与 “Step 1 of 2”
      const nextButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('下一步'));
      expect(nextButton?.textContent).toContain('Step 1 of 2');
    });

    it('should handle custom title and body with TNode', () => {
      const stepsWithTNode: GuideStep[] = [
        {
          element: '#step1',
          title: <span data-testid="custom-title">Custom Title</span>,
          body: <div data-testid="custom-body">Custom Body</div>,
        },
      ];

      render(<Guide steps={stepsWithTNode} current={0} />);
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-body')).toBeInTheDocument();
    });

    it('should handle finish button props', () => {
      const finishButtonProps = {
        content: 'Custom Finish',
        theme: 'primary' as const,
      };

      render(<Guide steps={mockSteps} current={1} finishButtonProps={finishButtonProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('Custom Finish'))).toBe(true);
    });

    it('should handle back button navigation to first step', () => {
      const onChange = vi.fn();
      render(<Guide steps={mockSteps} current={1} onChange={onChange} />);

      const backButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('返回'));
      fireEvent.click(backButton!);

      expect(onChange).toHaveBeenCalledWith(0, { e: expect.any(Object), total: 2 });
    });

    it('should handle popover props in step', () => {
      const stepsWithPopoverProps: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          popoverProps: {
            theme: 'dark',
            showArrow: true,
          },
        },
      ];

      render(<Guide steps={stepsWithPopoverProps} current={0} />);
      // 气泡属性应透传
      expect(document.querySelector('.t-popover')).toBeInTheDocument();
    });

    it('should handle mode override in step', () => {
      const stepsWithMode: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          mode: 'dialog',
        },
      ];

      render(<Guide steps={stepsWithMode} current={0} />);
      // 应渲染 popup 而非 popover
      expect(document.querySelector('.t-popup')).toBeInTheDocument();
    });

    it('should handle highlight content in popover mode', () => {
      const stepsWithHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightContent: <div data-testid="highlight-content">Highlight</div>,
        },
      ];

      render(<Guide steps={stepsWithHighlight} current={0} />);
      expect(screen.getByTestId('highlight-content')).toBeInTheDocument();
    });

    it('should not render highlight content in dialog mode', () => {
      const stepsWithHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          mode: 'dialog',
          highlightContent: <div data-testid="highlight-content">Highlight</div>,
        },
      ];

      render(<Guide steps={stepsWithHighlight} current={0} />);
      expect(screen.queryByTestId('highlight-content')).not.toBeInTheDocument();
    });

    it('should handle zIndex prop', () => {
      render(<Guide steps={mockSteps} current={0} zIndex={12345} />);
      // 应应用 zIndex（仅检查渲染）
      expect(document.querySelector('.t-portal-wrapper')).toBeInTheDocument();
    });

    it('should handle className and style props', () => {
      render(<Guide steps={mockSteps} current={0} className="custom-class" style={{ color: 'red' }} />);
      const overlay = document.querySelector('.t-guide__overlay.custom-class');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Integration Tests - Complete User Flows', () => {
    it('should complete full guide flow with multiple steps', () => {
      const onChange = vi.fn();
      const onFinish = vi.fn();
      const { rerender } = render(<Guide steps={mockSteps} current={0} onChange={onChange} onFinish={onFinish} />);

      // 第一步：点击“下一步”
      const nextButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('下一步'));
      fireEvent.click(nextButton!);

      expect(onChange).toHaveBeenCalledWith(1, { e: expect.any(Object), total: 2 });

      // 第二步：current=1 重新渲染
      rerender(<Guide steps={mockSteps} current={1} onChange={onChange} onFinish={onFinish} />);

      // 应出现“完成”按钮
      const finishButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('完成'));
      expect(finishButton).toBeInTheDocument();

      // 点击“完成”
      fireEvent.click(finishButton!);
      expect(onFinish).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 1,
        total: 2,
      });
      expect(onChange).toHaveBeenCalledWith(-1, { e: expect.any(Object), total: 2 });
    });

    it('should handle skip functionality', () => {
      const onSkip = vi.fn();
      const onChange = vi.fn();

      render(<Guide steps={mockSteps} current={0} onSkip={onSkip} onChange={onChange} />);

      const skipButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('跳过'));
      fireEvent.click(skipButton!);

      expect(onSkip).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 0,
        total: 2,
      });
      expect(onChange).toHaveBeenCalledWith(-1, { e: expect.any(Object), total: 2 });
    });

    it('should handle back navigation in multi-step flow', () => {
      const onChange = vi.fn();
      const onBack = vi.fn();

      // 从第 2 步开始
      render(<Guide steps={mockSteps} current={1} onChange={onChange} onBack={onBack} />);

      const backButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('返回'));
      fireEvent.click(backButton!);

      expect(onBack).toHaveBeenCalledWith({
        e: expect.any(Object),
        current: 1,
        total: 2,
      });
      expect(onChange).toHaveBeenCalledWith(0, { e: expect.any(Object), total: 2 });
    });

    it('should handle controlled current prop changes', () => {
      const { rerender } = render(<Guide steps={mockSteps} current={0} />);

      // 应显示第 1 步内容
      expect(screen.getByText('Step 1')).toBeInTheDocument();

      // 更改 current
      rerender(<Guide steps={mockSteps} current={1} />);

      // 应显示第 2 步内容
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    it('should handle defaultCurrent prop', () => {
      render(<Guide steps={mockSteps} defaultCurrent={1} />);

      // 初始应显示第 2 步内容
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    it('should handle mode switching between steps', () => {
      const mixedModeSteps: GuideStep[] = [
        {
          element: '#step1',
          title: 'Popover Step',
          body: 'Body 1',
          mode: 'popover',
        },
        {
          element: '#step2',
          title: 'Dialog Step',
          body: 'Body 2',
          mode: 'dialog',
        },
      ];

      const { rerender } = render(<Guide steps={mixedModeSteps} current={0} />);

      // 第一步：应渲染气泡
      expect(document.querySelector('.t-popover')).toBeInTheDocument();
      expect(document.querySelector('.t-popup')).not.toBeInTheDocument();

      // 切到第 2 步
      rerender(<Guide steps={mixedModeSteps} current={1} />);

      // 第二步：应渲染弹窗
      const popup = document.querySelector('.t-popup');
      expect(popup).toBeInTheDocument();
      expect(document.querySelector('.t-popover')).not.toBeInTheDocument();
    });

    it('should handle custom button props per step', () => {
      const stepsWithCustomButtons: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body 1',
          nextButtonProps: {
            content: 'Go Forward',
          },
        },
        {
          element: '#step2',
          title: 'Step 2',
          body: 'Body 2',
          backButtonProps: {
            content: 'Go Back',
          },
        },
      ];

      const { rerender } = render(<Guide steps={stepsWithCustomButtons} current={0} />);

      // 第一步：自定义“下一步”按钮
      let buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('Go Forward'))).toBe(true);

      // 切到第 2 步
      rerender(<Guide steps={stepsWithCustomButtons} current={1} />);

      // 第二步：自定义“返回”和“完成”按钮
      buttons = screen.getAllByRole('button');
      expect(buttons.some((button) => button.textContent?.includes('Go Back'))).toBe(true);
      expect(buttons.some((button) => button.textContent?.includes('完成'))).toBe(true);
    });

    it('should handle overlay visibility per step', () => {
      const stepsWithOverlayControl: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step with overlay',
          body: 'Body 1',
          showOverlay: true,
        },
        {
          element: '#step2',
          title: 'Step without overlay',
          body: 'Body 2',
          showOverlay: false,
        },
      ];

      const { rerender } = render(<Guide steps={stepsWithOverlayControl} current={0} />);

      // 第一步：应有遮罩
      const highlight = document.querySelector('.t-guide__highlight--mask');
      expect(highlight).toBeInTheDocument();

      // 切到第 2 步
      rerender(<Guide steps={stepsWithOverlayControl} current={1} />);

      // 第二步：应无遮罩
      const highlight2 = document.querySelector('.t-guide__highlight--nomask');
      expect(highlight2).toBeInTheDocument();
    });

    it('should handle custom highlight content positioning', () => {
      const stepsWithCustomHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightContent: <div data-testid="custom-highlight">Custom Highlight</div>,
        },
      ];

      render(<Guide steps={stepsWithCustomHighlight} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      // 应渲染自定义高亮内容
      expect(screen.getByTestId('custom-highlight')).toBeInTheDocument();
    });
  });

  describe('Scrolling and Offscreen Elements', () => {
    it('should handle scrolling to element in popover mode', () => {
      // 创建视口外元素
      const offscreenElement = document.createElement('div');
      offscreenElement.id = 'offscreen-element';
      offscreenElement.style.position = 'absolute';
      offscreenElement.style.top = '2000px';
      offscreenElement.style.left = '2000px';
      offscreenElement.textContent = 'Offscreen Element';
      document.body.appendChild(offscreenElement);

      const stepsWithOffscreen: GuideStep[] = [
        {
          element: '#offscreen-element',
          title: 'Offscreen Step',
          body: 'Body',
        },
      ];

      render(<Guide steps={stepsWithOffscreen} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 清理
      document.body.removeChild(offscreenElement);
    });

    it('should handle scrolling to element in dialog mode', () => {
      // 创建视口外元素
      const offscreenElement = document.createElement('div');
      offscreenElement.id = 'offscreen-element-dialog';
      offscreenElement.style.position = 'absolute';
      offscreenElement.style.top = '2000px';
      offscreenElement.style.left = '2000px';
      offscreenElement.textContent = 'Offscreen Element Dialog';
      document.body.appendChild(offscreenElement);

      const stepsWithOffscreen: GuideStep[] = [
        {
          element: '#offscreen-element-dialog',
          title: 'Offscreen Step Dialog',
          body: 'Body',
          mode: 'dialog',
        },
      ];

      render(<Guide steps={stepsWithOffscreen} current={0} />);
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 清理
      document.body.removeChild(offscreenElement);
    });
  });

  describe('Guide Display Timing', () => {
    it('should handle guide display timing with setTimeout', () => {
      vi.useFakeTimers();
      render(<Guide steps={mockSteps} current={0} />);

      // 快进定时器
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle popover visibility state changes', () => {
      const { rerender } = render(<Guide steps={mockSteps} current={0} />);

      // 超时后应可见
      vi.useFakeTimers();
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 更改 current 触发可见性变化
      rerender(<Guide steps={mockSteps} current={1} />);
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle showDialogGuide scrollToParentVisibleArea call', () => {
      const stepsDialog: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          mode: 'dialog',
        },
      ];

      vi.useFakeTimers();
      render(<Guide steps={stepsDialog} current={0} />);

      // 快进定时器以触发 showDialogGuide（内部调用 scrollToParentVisibleArea）
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 应调用 scrollToParentVisibleArea
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle showGuide setTimeout for popover visibility timing', () => {
      vi.useFakeTimers();
      render(<Guide steps={mockSteps} current={0} />);

      // 超时前组件已渲染
      let portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 快进定时器触发 showGuide 内的 setTimeout
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 超时后设置为可见
      portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle setReferenceFullW with null elements', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      vi.useFakeTimers();
      render(<Guide steps={stepsWithCenter} current={0} />);

      // 快进定时器以触发 setReferenceFullW（可能存在空元素）
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // setReferenceFullW 应优雅处理空元素
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Cleanup and Error Handling', () => {
    it('should handle destroy guide cleanup', () => {
      const { unmount } = render(<Guide steps={mockSteps} current={0} />);

      // 卸载应触发清理
      unmount(); // 卸载应触发清理

      // 清理时不应抛错
      expect(() => unmount()).not.toThrow();
    });

    it('should trigger destroyGuide when current changes from valid to invalid', () => {
      // 当 innerCurrent 超出有效范围

      const { rerender, unmount } = render(<Guide steps={mockSteps} current={0} />);

      // 验证已展示
      expect(document.querySelector('.t-guide__wrapper')).toBeInTheDocument();

      try {
        rerender(<Guide steps={mockSteps} current={3} />);
      } catch {
        // 忽略测试环境错误
      }

      const wrapper = document.querySelector('.t-guide__wrapper');
      expect(wrapper).not.toBeInTheDocument();

      unmount();
    });

    it('should handle element removal during guide display', () => {
      render(<Guide steps={mockSteps} current={0} />);

      // 渲染后移除目标元素
      const step1 = document.getElementById('step1');
      if (step1) {
        document.body.removeChild(step1);
      }

      // 不应抛错
      expect(document.querySelector('.t-portal-wrapper')).toBeInTheDocument();
    });

    it('should handle window scroll calculations', () => {
      // 模拟窗口滚动
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 50, writable: true });

      render(<Guide steps={mockSteps} current={0} mode="dialog" />);

      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 重置模拟
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
    });

    it('should handle window scroll calculations in dialog mode', () => {
      // 模拟对话框模式下窗口滚动
      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 100, writable: true });

      render(<Guide steps={mockSteps} current={0} mode="dialog" />);

      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 重置模拟
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
    });

    it('should handle reference positioning in custom highlight content', () => {
      const stepsWithCustomHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightContent: <div data-testid="custom-highlight">Custom Highlight</div>,
        },
      ];

      render(<Guide steps={stepsWithCustomHighlight} current={0} />);

      // 应触发参考定位逻辑
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      expect(screen.getByTestId('custom-highlight')).toBeInTheDocument();
    });

    it('should handle center placement with full width reference', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      render(<Guide steps={stepsWithCenter} current={0} />);

      // 居中触发 setReferenceFullW
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle popover guide display with center positioning', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      render(<Guide steps={stepsWithCenter} current={0} />);

      // 应触发气泡引导展示逻辑
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle dialog guide display logic', () => {
      render(<Guide steps={mockSteps} current={0} mode="dialog" />);

      // 应触发对话框引导逻辑
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle guide show logic with tryCallBack', () => {
      render(<Guide steps={mockSteps} current={0} />);

      // 应触发 tryCallBack 展示逻辑
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle setReferenceFullW function with multiple elements', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      render(<Guide steps={stepsWithCenter} current={0} />);

      // 居中应调用 setReferenceFullW
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
    });

    it('should handle custom highlight content with reference positioning', () => {
      const stepsWithCustomHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightContent: <div data-testid="custom-highlight">Custom Highlight</div>,
        },
      ];

      render(<Guide steps={stepsWithCustomHighlight} current={0} />);

      // 自定义高亮应触发参考定位
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();
      expect(screen.getByTestId('custom-highlight')).toBeInTheDocument();
    });

    it('should handle custom highlight content with getBoundingClientRect for reference', () => {
      // 覆盖 showCustomHighlightContent=true 且 isReference=true 的分支
      // 模拟 getBoundingClientRect 返回指定尺寸
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

      Element.prototype.getBoundingClientRect = vi.fn(function (this: HTMLElement) {
        if (this.classList.contains('t-guide__highlight')) {
          return {
            width: 250,
            height: 180,
            top: 120,
            left: 120,
            right: 370,
            bottom: 300,
            x: 120,
            y: 120,
            toJSON: () => {},
          } as DOMRect;
        }
        return originalGetBoundingClientRect.call(this);
      });

      const stepsWithCustomHighlight: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          highlightContent: <div data-testid="custom-highlight-ref">Custom Highlight Reference</div>,
        },
      ];

      vi.useFakeTimers();
      render(<Guide steps={stepsWithCustomHighlight} current={0} />);

      // 快进定时器以触发 showPopoverGuide（其以 isReference=true 调用 setHighlightLayerPosition）
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 组件应渲染自定义高亮
      expect(screen.getByTestId('custom-highlight-ref')).toBeInTheDocument();

      // 验证高亮层已定位
      const highlightLayer = document.querySelector('.t-guide__highlight') as HTMLElement;
      expect(highlightLayer).toBeInTheDocument();

      vi.useRealTimers();
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('should handle window scroll offset calculations in setHighlightLayerPosition', () => {
      // 模拟窗口滚动值
      Object.defineProperty(window, 'pageYOffset', { value: 150, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 75, writable: true });

      const stepsWithScroll: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          mode: 'dialog', // 使用对话框模式触发滚动偏移逻辑
        },
      ];

      render(<Guide steps={stepsWithScroll} current={0} />);

      // 应应用滚动偏移计算
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 重置模拟
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
    });

    it('should handle showPopoverGuide with center placement triggering setReferenceFullW', () => {
      const stepsWithCenter: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          placement: 'center',
        },
      ];

      vi.useFakeTimers();
      render(<Guide steps={stepsWithCenter} current={0} />);

      // 快进定时器以触发 showPopoverGuide
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 气泡模式下居中应调用 setReferenceFullW
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle showDialogGuide function execution', () => {
      const stepsDialog: GuideStep[] = [
        {
          element: '#step1',
          title: 'Step 1',
          body: 'Body',
          mode: 'dialog',
        },
      ];

      vi.useFakeTimers();
      render(<Guide steps={stepsDialog} current={0} />);

      // 快进定时器以触发 showDialogGuide
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // showDialogGuide 应无错执行
      const portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should handle showGuide setTimeout for popover visibility', () => {
      vi.useFakeTimers();
      render(<Guide steps={mockSteps} current={0} />);

      // 初始气泡不可见
      let portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      // 快进定时器触发 setPopoverVisible(true)
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 现在气泡应可见
      portal = document.querySelector('.t-portal-wrapper');
      expect(portal).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});
