import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Button from '../../button';
import { Row } from '../../grid';
import Input from '../../input';
import { Guide } from '..';

import type { GuideStep } from '../type';

function GuideContent() {
  return (
    <div className="guide-container">
      <div className="main-title-base">
        <div className="title-major">Guide 用户引导</div>
        <div className="title-sub">按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。</div>
      </div>
      <div className="field label-field-base">
        <div className="label">Label</div>
        <Input placeholder="请输入内容" />
      </div>
      <div className="field">
        <div className="label">Label</div>
        <Input placeholder="请输入内容" />
      </div>
      <Row className="action action-base">
        <Button>确定</Button>
        <Button theme="default" variant="base">
          取消
        </Button>
      </Row>
    </div>
  );
}

const STEPS: GuideStep[] = [
  {
    element: '.main-title-base',
    title: '新手引导标题',
    body: '新手引导的说明文案',
    placement: 'bottom-right',
  },
  {
    element: () => document.body.querySelector('.label-field-base'),
    title: '新手引导标题',
    body: '新手引导的说明文案',
    placement: 'bottom',
  },
  {
    element: '.action-base',
    title: '新手引导标题',
    body: '新手引导的说明文案',
    placement: 'right',
  },
];

function getGuideDefaultMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  return render(
    <div>
      <GuideContent />
      <Guide current={0} steps={STEPS.slice(0, 1)} {...props} {...events}></Guide>
    </div>,
  );
}

function getGuideMultipleStepsMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  return render(
    <div>
      <GuideContent />
      <Guide steps={STEPS} {...props} {...events}></Guide>
    </div>,
  );
}

function getCustomGuideStepMount(props: Record<string, any> = {}) {
  const steps = [{ ...STEPS[0], ...props }];
  return render(
    <div>
      <GuideContent />
      <Guide current={0} steps={steps}></Guide>
    </div>,
  );
}

function getCustomMultipleGuideStepMount(props: Record<string, any> = {}) {
  const { current = 0, ...guideStepProps } = props;
  const steps = [...STEPS];
  steps[current] = { ...STEPS[current], ...guideStepProps };
  return render(
    <div>
      <GuideContent />
      <Guide current={current} steps={steps}></Guide>
    </div>,
  );
}

describe('Guide', () => {
  describe('props', () => {
    test('current[number]', async () => {
      const first = getGuideMultipleStepsMount({ current: 0 });
      await mockDelay(60);
      expect(document.querySelector('.t-guide__counter').textContent).toBe('1/3');
      expect(document.querySelectorAll('.t-guide__title')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__desc')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__action .t-guide__skip')).toHaveLength(1);
      expect(document.querySelector('.t-guide__action .t-guide__prev')).toBeFalsy();
      expect(document.querySelectorAll('.t-guide__action .t-guide__next')).toHaveLength(1);
      expect(document.querySelector('.t-guide__action .t-guide__finish')).toBeFalsy();
      first.unmount();

      const middle = getGuideMultipleStepsMount({ current: 1 });
      await mockDelay(60);
      expect(document.querySelector('.t-guide__counter').textContent).toBe('2/3');
      expect(document.querySelectorAll('.t-guide__title')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__desc')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__action .t-guide__skip')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__action .t-guide__prev')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__action .t-guide__next')).toHaveLength(1);
      expect(document.querySelector('.t-guide__action .t-guide__finish')).toBeFalsy();
      middle.unmount();

      const last = getGuideMultipleStepsMount({ current: 2 });
      await mockDelay(60);
      expect(document.querySelector('.t-guide__counter').textContent).toBe('3/3');
      expect(document.querySelectorAll('.t-guide__title')).toHaveLength(1);
      expect(document.querySelectorAll('.t-guide__desc')).toHaveLength(1);
      expect(document.querySelector('.t-guide__action .t-guide__skip')).toBeFalsy();
      expect(document.querySelectorAll('.t-guide__action .t-guide__prev')).toHaveLength(1);
      expect(document.querySelector('.t-guide__action .t-guide__next')).toBeFalsy();
      expect(document.querySelectorAll('.t-guide__action .t-guide__finish')).toHaveLength(1);
      last.unmount();

      getGuideMultipleStepsMount({ current: -1 });
      await mockDelay(60);
      expect(document.querySelector('.t-guide__counter')).toBeFalsy();
    });

    test('finishButtonProps[object]', async () => {
      getGuideMultipleStepsMount({
        current: 2,
        finishButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__finish');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('hideCounter', async () => {
      getGuideDefaultMount({ hideCounter: true });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom).toBeFalsy();
    });

    test('hidePrev', async () => {
      getGuideMultipleStepsMount({ current: 1, hidePrev: true });
      await mockDelay(60);
      const tGuideActionTGuidePrevDom = document.querySelector('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom).toBeFalsy();
    });

    test('hideSkip', async () => {
      getGuideMultipleStepsMount({ current: 1, hideSkip: true });
      await mockDelay(60);
      const tGuideActionTGuideSkipDom = document.querySelector('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom).toBeFalsy();
    });

    test('highlightPadding[number]', async () => {
      getGuideDefaultMount({ highlightPadding: 32 });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__highlight--mask') as HTMLElement;
      expect(domWrapper.style.width).toBe('64px');
      expect(domWrapper.style.height).toBe('64px');
      expect(domWrapper.style.top).toBe('-32px');
      expect(domWrapper.style.left).toBe('-32px');
      const domWrapper1 = document.querySelector('.t-guide__reference') as HTMLElement;
      expect(domWrapper1.style.width).toBe('64px');
      expect(domWrapper1.style.height).toBe('64px');
      expect(domWrapper1.style.top).toBe('-32px');
      expect(domWrapper1.style.left).toBe('-32px');
    });

    test('nextButtonProps[object]', async () => {
      getGuideMultipleStepsMount({
        current: 1,
        nextButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__next');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('prevButtonProps[object]', async () => {
      getGuideMultipleStepsMount({
        current: 2,
        prevButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__prev');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('showOverlay', async () => {
      getGuideDefaultMount({ showOverlay: true });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelectorAll('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom.length).toBe(1);
    });

    test('showOverlay[false]', async () => {
      getGuideDefaultMount({ showOverlay: false });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelector('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom).toBeFalsy();
    });

    test('skipButtonProps[object]', async () => {
      getGuideMultipleStepsMount({
        current: 0,
        skipButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__skip');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('steps[array<GuideStep>]', async () => {
      getGuideDefaultMount();
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom.textContent).toBe('1/1');
      const tGuideTitleDom = document.querySelectorAll('.t-guide__title');
      expect(tGuideTitleDom.length).toBe(1);
      const tGuideDescDom = document.querySelectorAll('.t-guide__desc');
      expect(tGuideDescDom.length).toBe(1);
      const tGuideActionTGuideSkipDom = document.querySelector('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom).toBeFalsy();
      const tGuideActionTGuidePrevDom = document.querySelector('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom).toBeFalsy();
      const tGuideActionTGuideNextDom = document.querySelector('.t-guide__action .t-guide__next');
      expect(tGuideActionTGuideNextDom).toBeFalsy();
      const tGuideActionTGuideFinishDom = document.querySelectorAll('.t-guide__action .t-guide__finish');
      expect(tGuideActionTGuideFinishDom.length).toBe(1);
    });

    test('zIndex[string]', async () => {
      getGuideDefaultMount({ zIndex: '5000' });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__overlay') as HTMLElement;
      expect(domWrapper.style.zIndex).toBe('4998');
      const domWrapper1 = document.querySelector('.t-guide__highlight--mask') as HTMLElement;
      expect(domWrapper1.style.zIndex).toBe('4999');
    });

    test('counter[TNode]', async () => {
      getGuideDefaultMount({
        counter: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom).toBeTruthy();
    });

    test('counter[function]', async () => {
      const fn = vi.fn();
      getGuideDefaultMount({ counter: fn });
      await mockDelay(60);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].total).toBe(1);
      expect(fn.mock.calls[0][0].current).toBe(0);
    });

    describe('GuideStep', () => {
      test('highlightPadding[number]', async () => {
        getCustomGuideStepMount({ highlightPadding: 32 });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-guide__highlight--mask') as HTMLElement;
        expect(domWrapper.style.width).toBe('64px');
        expect(domWrapper.style.height).toBe('64px');
        expect(domWrapper.style.top).toBe('-32px');
        expect(domWrapper.style.left).toBe('-32px');
        const domWrapper1 = document.querySelector('.t-guide__reference') as HTMLElement;
        expect(domWrapper1.style.width).toBe('64px');
        expect(domWrapper1.style.height).toBe('64px');
        expect(domWrapper1.style.top).toBe('-32px');
        expect(domWrapper1.style.left).toBe('-32px');
      });

      const modeExpectedDom = ['.t-popup', '.t-guide__dialog'];
      (['popup', 'dialog'] as const).forEach((item, index) => {
        test(`mode[${item}]`, async () => {
          const { container } = getCustomGuideStepMount({ mode: item });
          await mockDelay(60);
          const modeExpectedDomIndexDom = document.querySelector(modeExpectedDom[index]);
          expect(modeExpectedDomIndexDom).toBeTruthy();
          expect(container).toMatchSnapshot();
        });
      });

      test('nextButtonProps[object]', async () => {
        getCustomMultipleGuideStepMount({
          current: 1,
          nextButtonProps: { theme: 'warning' },
        });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-guide__next');
        expect(domWrapper).toHaveClass('t-button--theme-warning');
      });

      test('placement[bottom-left]', async () => {
        getCustomGuideStepMount({ placement: 'bottom-left' });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-popup');
        expect(domWrapper.getAttribute('data-popper-placement')).toBe('bottom-start');
        expect(document.body).toMatchSnapshot();
      });

      test('popupProps.placement[top-left]', async () => {
        getCustomGuideStepMount({ popupProps: { placement: 'top-left' } });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-popup');
        expect(domWrapper.getAttribute('data-popper-placement')).toBe('top-start');
      });

      test('prevButtonProps[object]', async () => {
        getCustomMultipleGuideStepMount({
          current: 2,
          prevButtonProps: { theme: 'warning' },
        });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-guide__prev');
        expect(domWrapper).toHaveClass('t-button--theme-warning');
      });

      test('showOverlay', async () => {
        getCustomMultipleGuideStepMount({ showOverlay: true });
        await mockDelay(60);
        const tGuideHighlightMaskDom = document.querySelectorAll('.t-guide__highlight--mask');
        expect(tGuideHighlightMaskDom.length).toBe(1);
      });

      test('showOverlay[false]', async () => {
        getCustomMultipleGuideStepMount({ showOverlay: false });
        await mockDelay(60);
        const tGuideHighlightMaskDom = document.querySelector('.t-guide__highlight--mask');
        expect(tGuideHighlightMaskDom).toBeFalsy();
      });

      test('skipButtonProps[object]', async () => {
        getCustomMultipleGuideStepMount({
          current: 1,
          skipButtonProps: { theme: 'warning' },
        });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-guide__skip');
        expect(domWrapper).toHaveClass('t-button--theme-warning');
      });

      test('stepOverlayClass', async () => {
        getCustomGuideStepMount({
          stepOverlayClass: 't-test-guide-step-overlay',
        });
        await mockDelay(60);
        const domWrapper = document.querySelector('.t-popup');
        expect(domWrapper).toHaveClass('t-test-guide-step-overlay');
        expect(document.body).toMatchSnapshot();
      });

      test('body[TNode]', async () => {
        getCustomGuideStepMount({
          body: <span className="custom-node">TNode</span>,
        });
        await mockDelay(60);
        const customNodeDom = document.querySelector('.custom-node');
        expect(customNodeDom).toBeTruthy();
        expect(document.body).toMatchSnapshot();
      });

      test('content and children', async () => {
        const childrenWrapper = getCustomGuideStepMount({
          children: <span className="custom-children-node">TNode</span>,
        });
        await mockDelay(60);
        expect(document.querySelector('.custom-children-node')).toBeTruthy();
        expect(document.body).toMatchSnapshot();

        childrenWrapper.unmount();
        getCustomGuideStepMount({
          content: <span className="custom-content-node">TNode</span>,
        });
        await mockDelay(60);
        expect(document.querySelector('.custom-content-node')).toBeTruthy();
        expect(document.body).toMatchSnapshot();
      });

      test('highlightContent[TNode]', async () => {
        getCustomGuideStepMount({
          highlightContent: <span className="custom-node">TNode</span>,
        });
        await mockDelay(60);
        const customNodeDom = document.querySelector('.custom-node');
        expect(customNodeDom).toBeTruthy();
        expect(document.body).toMatchSnapshot();
      });

      test('title[TNode]', async () => {
        getCustomGuideStepMount({
          title: <span className="custom-node">TNode</span>,
        });
        await mockDelay(60);
        const customNodeDom = document.querySelector('.custom-node');
        expect(customNodeDom).toBeTruthy();
        expect(document.body).toMatchSnapshot();
      });
    });
  });

  describe('events', () => {
    test('onChange', async () => {
      const onNextChangeFn = vi.fn();
      getGuideMultipleStepsMount({ current: 0 }, { onChange: onNextChangeFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__next'));
      expect(onNextChangeFn).toHaveBeenCalled();
      expect(onNextChangeFn.mock.calls[0][0]).toBe(1);
      expect(onNextChangeFn.mock.calls[0][1].e.type).toBe('click');
      expect(onNextChangeFn.mock.calls[0][1].total).toBe(3);

      const onPrevChangeFn = vi.fn();
      getGuideMultipleStepsMount({ current: 1 }, { onChange: onPrevChangeFn });
      await mockDelay(60);
      const prevButtons = document.querySelectorAll('.t-guide__prev');
      fireEvent.click(prevButtons[prevButtons.length - 1]);
      expect(onPrevChangeFn).toHaveBeenCalled();
      expect(onPrevChangeFn.mock.calls[0][0]).toBe(0);
      expect(onPrevChangeFn.mock.calls[0][1].e.type).toBe('click');
      expect(onPrevChangeFn.mock.calls[0][1].total).toBe(3);
    });

    test('onFinish', async () => {
      const onFinishFn = vi.fn();
      getGuideMultipleStepsMount({ current: 2 }, { onFinish: onFinishFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__finish'));
      expect(onFinishFn).toHaveBeenCalled();
      expect(onFinishFn.mock.calls[0][0].current).toBe(2);
      expect(onFinishFn.mock.calls[0][0].e.type).toBe('click');
      expect(onFinishFn.mock.calls[0][0].total).toBe(3);
    });

    test('onNextStepClick', async () => {
      const onNextStepClickFn = vi.fn();
      getGuideMultipleStepsMount({ current: 1 }, { onNextStepClick: onNextStepClickFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__next'));
      expect(onNextStepClickFn).toHaveBeenCalled();
      expect(onNextStepClickFn.mock.calls[0][0].current).toBe(1);
      expect(onNextStepClickFn.mock.calls[0][0].next).toBe(2);
      expect(onNextStepClickFn.mock.calls[0][0].e.type).toBe('click');
      expect(onNextStepClickFn.mock.calls[0][0].total).toBe(3);
    });

    test('onPrevStepClick', async () => {
      const onPrevStepClickFn = vi.fn();
      getGuideMultipleStepsMount({ current: 1 }, { onPrevStepClick: onPrevStepClickFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__prev'));
      expect(onPrevStepClickFn).toHaveBeenCalled();
      expect(onPrevStepClickFn.mock.calls[0][0].current).toBe(1);
      expect(onPrevStepClickFn.mock.calls[0][0].prev).toBe(0);
      expect(onPrevStepClickFn.mock.calls[0][0].e.type).toBe('click');
      expect(onPrevStepClickFn.mock.calls[0][0].total).toBe(3);
    });

    test('onSkip', async () => {
      const onSkipFn = vi.fn();
      getGuideMultipleStepsMount({ current: 0 }, { onSkip: onSkipFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__skip'));
      expect(onSkipFn).toHaveBeenCalled();
      expect(onSkipFn.mock.calls[0][0].current).toBe(0);
      expect(onSkipFn.mock.calls[0][0].e.type).toBe('click');
      expect(onSkipFn.mock.calls[0][0].total).toBe(3);
    });
  });
});
