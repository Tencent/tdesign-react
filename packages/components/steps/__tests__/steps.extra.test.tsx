import React from 'react';
import { render, waitFor, fireEvent, vi } from '@test/utils';
import Steps from '../Steps';
import StepItem from '../StepItem';
import StepsContext from '../StepsContext';

const TEST_ROOT_ID = 'step-test-root-extra';

const defaultOptions = [
  { title: '0', content: '这里', value: 0 },
  { title: '1', content: '这里', value: 1 },
  { title: '2', content: '这里', value: 2 },
];

describe('Steps extra branches', () => {
  test("current='FINISH' -> all items finish (options)", async () => {
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps current={'FINISH'} options={defaultOptions} />
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const finishes = root.querySelectorAll('.t-steps-item--finish');
    expect(finishes.length).toBe(defaultOptions.length);
  });

  test('item.status override (error) renders error class', async () => {
    const opts = [
      { title: 'a', content: 'a', value: 0, status: 'error' as any },
      { title: 'b', content: 'b', value: 1 },
    ];
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps current={0} options={opts} />
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const errorItem = root.querySelector('.t-steps-item--error');
    expect(errorItem).not.toBeNull();
  });

  test('current value not exist triggers console.warn and defaults to wait', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const opts = [
      { title: 'a', content: 'a', value: 'a' },
      { title: 'b', content: 'b', value: 'b' },
    ];
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps current={'not-exist'} options={opts as any} />
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    expect(warnSpy).toHaveBeenCalledWith('TDesign Steps Warn: The current `value` is not exist.');
    const waitItems = root.querySelectorAll('.t-steps-item--wait');
    // both should be in default/wait state
    expect(waitItems.length).toBe(opts.length);
    warnSpy.mockRestore();
  });

  test('status=process prevents click triggering onChange', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <StepsContext.Provider value={{ current: 0, theme: 'default', readonly: false, onChange }}>
          <StepItem title="t" index={0} status={'process'} />
        </StepsContext.Provider>
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const inner = root.querySelector('.t-steps-item__inner');
    fireEvent.click(inner);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('icon=false results in no icon content', async () => {
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <StepsContext.Provider value={{ current: 0, theme: 'default', readonly: false, onChange: null }}>
          <StepItem title="t" index={0} status={'default'} icon={false as any} />
        </StepsContext.Provider>
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const icon = root.querySelector('.t-steps-item__icon');
    // icon container exists but should have no child nodes when icon=false
    expect(icon).not.toBeNull();
    expect(icon.childNodes.length).toBe(0);
  });
});
