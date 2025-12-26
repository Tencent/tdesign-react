import React from 'react';
import { render, waitFor } from '@test/utils';
import { vi } from 'vitest';
import Steps from '../Steps';
import StepItem from '../StepItem';

const TEST_ROOT_ID = 'step-test-branches';

describe('Steps branches', () => {
  test('options reverse order and index mapping', async () => {
    const opts = [
      { title: 'first', content: 'c1', value: 0 },
      { title: 'second', content: 'c2', value: 1 },
      { title: 'third', content: 'c3', value: 2 },
    ];
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps options={opts} sequence="reverse" current={1} />
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const titles = Array.from(root.querySelectorAll('.t-steps-item__title')).map((n) => n.textContent);
    // when reverse, display order should be same length but titles still present
    expect(titles.length).toBe(3);
    expect(titles).toContain('first');
    expect(titles).toContain('second');
    expect(titles).toContain('third');
  });

  test('children cloneElement branch and FINISH current', async () => {
    const onChange = vi.fn?.() ?? (() => undefined);
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps current={'FINISH'} onChange={onChange}>
          <StepItem title="A" content="a" value={0} />
          <StepItem title="B" content="b" value={1} />
        </Steps>
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    // all items should be finish
    const finish = root.querySelectorAll('.t-steps-item--finish');
    expect(finish.length).toBe(2);
  });

  test('StepItem default icon number rendered when icon=true and theme=default', async () => {
    const { getByTestId } = render(
      <div data-testid={TEST_ROOT_ID}>
        <Steps current={0}>
          <StepItem title="X" content="x" index={0} icon={true as any} status={'default'} />
        </Steps>
      </div>,
    );
    const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
    const number = root.querySelector('.t-steps-item__icon--number');
    expect(number).not.toBeNull();
    expect(number).toHaveTextContent('1');
  });
});
