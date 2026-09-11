import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Button from '../../button';
import { Row } from '../../grid';
import Input from '../../input';
import { Guide } from '..';

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

const STEPS = [
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
    test('current 0', async () => {
      getGuideMultipleStepsMount({ current: 0 });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom.textContent).toBe('1/3');
      const tGuideTitleDom = document.querySelectorAll('.t-guide__title');
      expect(tGuideTitleDom.length).toBe(1);
      const tGuideDescDom = document.querySelectorAll('.t-guide__desc');
      expect(tGuideDescDom.length).toBe(1);
      const tGuideActionTGuideSkipDom = document.querySelectorAll('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom.length).toBe(1);
      const tGuideActionTGuidePrevDom = document.querySelector('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom).toBeFalsy();
      const tGuideActionTGuideNextDom = document.querySelectorAll('.t-guide__action .t-guide__next');
      expect(tGuideActionTGuideNextDom.length).toBe(1);
      const tGuideActionTGuideFinishDom = document.querySelector('.t-guide__action .t-guide__finish');
      expect(tGuideActionTGuideFinishDom).toBeFalsy();
    });

    test('current 1', async () => {
      getGuideMultipleStepsMount({ current: 1 });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom.textContent).toBe('2/3');
      const tGuideTitleDom = document.querySelectorAll('.t-guide__title');
      expect(tGuideTitleDom.length).toBe(1);
      const tGuideDescDom = document.querySelectorAll('.t-guide__desc');
      expect(tGuideDescDom.length).toBe(1);
      const tGuideActionTGuideSkipDom = document.querySelectorAll('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom.length).toBe(1);
      const tGuideActionTGuidePrevDom = document.querySelectorAll('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom.length).toBe(1);
      const tGuideActionTGuideNextDom = document.querySelectorAll('.t-guide__action .t-guide__next');
      expect(tGuideActionTGuideNextDom.length).toBe(1);
      const tGuideActionTGuideFinishDom = document.querySelector('.t-guide__action .t-guide__finish');
      expect(tGuideActionTGuideFinishDom).toBeFalsy();
    });

    test('current 2', async () => {
      getGuideMultipleStepsMount({ current: 2 });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom.textContent).toBe('3/3');
      const tGuideTitleDom = document.querySelectorAll('.t-guide__title');
      expect(tGuideTitleDom.length).toBe(1);
      const tGuideDescDom = document.querySelectorAll('.t-guide__desc');
      expect(tGuideDescDom.length).toBe(1);
      const tGuideActionTGuideSkipDom = document.querySelector('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom).toBeFalsy();
      const tGuideActionTGuidePrevDom = document.querySelectorAll('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom.length).toBe(1);
      const tGuideActionTGuideNextDom = document.querySelector('.t-guide__action .t-guide__next');
      expect(tGuideActionTGuideNextDom).toBeFalsy();
      const tGuideActionTGuideFinishDom = document.querySelectorAll('.t-guide__action .t-guide__finish');
      expect(tGuideActionTGuideFinishDom.length).toBe(1);
    });

    test('current works fine. `{"document.t-guide__counter":false}` should exist', async () => {
      getGuideMultipleStepsMount({ current: -1 });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom).toBeFalsy();
    });

    test(`finishButtonProps is equal to {theme: 'warning'}`, async () => {
      getGuideMultipleStepsMount({
        current: 2,
        finishButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__finish');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('hideCounter works fine. `{"document.t-guide__counter":false}` should exist', async () => {
      getGuideDefaultMount({ hideCounter: true });
      await mockDelay(60);
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom).toBeFalsy();
    });

    test('hidePrev works fine. `{"document.t-guide__action .t-guide__prev":false}` should exist', async () => {
      getGuideMultipleStepsMount({ current: 1, hidePrev: true });
      await mockDelay(60);
      const tGuideActionTGuidePrevDom = document.querySelector('.t-guide__action .t-guide__prev');
      expect(tGuideActionTGuidePrevDom).toBeFalsy();
    });

    test('hideSkip works fine. `{"document.t-guide__action .t-guide__skip":false}` should exist', async () => {
      getGuideMultipleStepsMount({ current: 1, hideSkip: true });
      await mockDelay(60);
      const tGuideActionTGuideSkipDom = document.querySelector('.t-guide__action .t-guide__skip');
      expect(tGuideActionTGuideSkipDom).toBeFalsy();
    });

    test(`highlightPadding is equal to 32`, async () => {
      getGuideDefaultMount({ highlightPadding: 32 });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__highlight--mask');
      expect(domWrapper.style.width).toBe('64px');
      expect(domWrapper.style.height).toBe('64px');
      expect(domWrapper.style.top).toBe('-32px');
      expect(domWrapper.style.left).toBe('-32px');
      const domWrapper1 = document.querySelector('.t-guide__reference');
      expect(domWrapper1.style.width).toBe('64px');
      expect(domWrapper1.style.height).toBe('64px');
      expect(domWrapper1.style.top).toBe('-32px');
      expect(domWrapper1.style.left).toBe('-32px');
    });

    test(`nextButtonProps is equal to {theme: 'warning'}`, async () => {
      getGuideMultipleStepsMount({
        current: 1,
        nextButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__next');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test(`prevButtonProps is equal to {theme: 'warning'}`, async () => {
      getGuideMultipleStepsMount({
        current: 2,
        prevButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__prev');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('showOverlay works fine. `{"document.t-guide__highlight--mask":1}` should exist', async () => {
      getGuideDefaultMount({ showOverlay: true });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelectorAll('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom.length).toBe(1);
    });

    test('showOverlay works fine. `{"document.t-guide__highlight--mask":false}` should exist', async () => {
      getGuideDefaultMount({ showOverlay: false });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelector('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom).toBeFalsy();
    });

    test(`skipButtonProps is equal to {theme: 'warning'}`, async () => {
      getGuideMultipleStepsMount({
        current: 0,
        skipButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__skip');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('steps', async () => {
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

    test(`zIndex is equal to 5000`, async () => {
      getGuideDefaultMount({ zIndex: '5000' });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__overlay');
      expect(domWrapper.style.zIndex).toBe('4998');
      const domWrapper1 = document.querySelector('.t-guide__highlight--mask');
      expect(domWrapper1.style.zIndex).toBe('4999');
    });
  });

  describe('slots', () => {
    test('counter', async () => {
      getGuideDefaultMount({
        counter: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      const tGuideCounterDom = document.querySelector('.t-guide__counter');
      expect(tGuideCounterDom).toBeTruthy();
    });

    test('counter is a function with params', async () => {
      const fn = vi.fn();
      getGuideDefaultMount({ counter: fn });
      await mockDelay(60);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].total).toBe(1);
      expect(fn.mock.calls[0][0].current).toBe(0);
    });
  });

  describe('events', () => {
    test('change next', async () => {
      const onChangeFn = vi.fn();
      getGuideMultipleStepsMount({ current: 0 }, { onChange: onChangeFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__next'));
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe(1);
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
      expect(onChangeFn.mock.calls[0][1].total).toBe(3);
    });

    test('change prev', async () => {
      const onChangeFn = vi.fn();
      getGuideMultipleStepsMount({ current: 1 }, { onChange: onChangeFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__prev'));
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe(0);
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
      expect(onChangeFn.mock.calls[0][1].total).toBe(3);
    });

    test('finish', async () => {
      const onFinishFn = vi.fn();
      getGuideMultipleStepsMount({ current: 2 }, { onFinish: onFinishFn });
      await mockDelay(60);
      fireEvent.click(document.querySelector('.t-guide__finish'));
      expect(onFinishFn).toHaveBeenCalled();
      expect(onFinishFn.mock.calls[0][0].current).toBe(2);
      expect(onFinishFn.mock.calls[0][0].e.type).toBe('click');
      expect(onFinishFn.mock.calls[0][0].total).toBe(3);
    });

    test('nextStepClick', async () => {
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

    test('prevStepClick', async () => {
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

    test('skip', async () => {
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

describe('GuideStep', () => {
  describe('props', () => {
    test(`highlightPadding is equal to 32`, async () => {
      getCustomGuideStepMount({ highlightPadding: 32 });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__highlight--mask');
      expect(domWrapper.style.width).toBe('64px');
      expect(domWrapper.style.height).toBe('64px');
      expect(domWrapper.style.top).toBe('-32px');
      expect(domWrapper.style.left).toBe('-32px');
      const domWrapper1 = document.querySelector('.t-guide__reference');
      expect(domWrapper1.style.width).toBe('64px');
      expect(domWrapper1.style.height).toBe('64px');
      expect(domWrapper1.style.top).toBe('-32px');
      expect(domWrapper1.style.left).toBe('-32px');
    });

    const modeExpectedDom = ['.t-popup', '.t-guide__dialog'];
    (['popup', 'dialog'] as const).forEach((item, index) => {
      test(`mode is equal to ${item}`, async () => {
        const { container } = getCustomGuideStepMount({ mode: item });
        await mockDelay(60);
        const modeExpectedDomIndexDom = document.querySelector(modeExpectedDom[index]);
        expect(modeExpectedDomIndexDom).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    test(`nextButtonProps is equal to {theme: 'warning'}`, async () => {
      getCustomMultipleGuideStepMount({
        current: 1,
        nextButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__next');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test(`placement is equal to bottom-left`, async () => {
      getCustomGuideStepMount({ placement: 'bottom-left' });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-popup');
      expect(domWrapper.getAttribute('data-popper-placement')).toBe('bottom-start');
      expect(document.body).toMatchSnapshot();
    });

    test(`popupProps is equal to {placement: 'top-left'}`, async () => {
      getCustomGuideStepMount({ popupProps: { placement: 'top-left' } });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-popup');
      expect(domWrapper.getAttribute('data-popper-placement')).toBe('top-start');
    });

    test(`prevButtonProps is equal to {theme: 'warning'}`, async () => {
      getCustomMultipleGuideStepMount({
        current: 2,
        prevButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__prev');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test('showOverlay: .t-guide__highlight--mask should exit if showOverlay=true', async () => {
      getCustomMultipleGuideStepMount({ showOverlay: true });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelectorAll('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom.length).toBe(1);
    });

    test('showOverlay: .t-guide__highlight--mask should not exit if showOverlay=false', async () => {
      getCustomMultipleGuideStepMount({ showOverlay: false });
      await mockDelay(60);
      const tGuideHighlightMaskDom = document.querySelector('.t-guide__highlight--mask');
      expect(tGuideHighlightMaskDom).toBeFalsy();
    });

    test(`skipButtonProps is equal to {theme: 'warning'}`, async () => {
      getCustomMultipleGuideStepMount({
        current: 1,
        skipButtonProps: { theme: 'warning' },
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-guide__skip');
      expect(domWrapper).toHaveClass('t-button--theme-warning');
    });

    test(`stepOverlayClass is equal to t-test-guide-step-overlay`, async () => {
      getCustomGuideStepMount({
        stepOverlayClass: 't-test-guide-step-overlay',
      });
      await mockDelay(60);
      const domWrapper = document.querySelector('.t-popup');
      expect(domWrapper).toHaveClass('t-test-guide-step-overlay');
      expect(document.body).toMatchSnapshot();
    });
  });

  describe('slots', () => {
    test('body', async () => {
      getCustomGuideStepMount({
        body: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      expect(document.body).toMatchSnapshot();
    });

    test('children', async () => {
      getCustomGuideStepMount({
        children: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      expect(document.body).toMatchSnapshot();
    });

    test('content', async () => {
      getCustomGuideStepMount({
        content: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      expect(document.body).toMatchSnapshot();
    });

    test('highlightContent', async () => {
      getCustomGuideStepMount({
        highlightContent: <span className="custom-node">TNode</span>,
      });
      await mockDelay(60);
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      expect(document.body).toMatchSnapshot();
    });

    test('title', async () => {
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
