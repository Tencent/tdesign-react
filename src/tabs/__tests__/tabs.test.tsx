import React from 'react';
import { render, testExamples, waitFor } from '@test/utils';
import TabPanel from '../TabPanel';
import Tabs from '../Tabs';

testExamples(__dirname);

describe('Tabs 组件测试', () => {
  test('render Tab bar', async () => {
    const testId = 'tab bar test id';
    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} data-testid={testId} size={'medium'}>
          <TabPanel value={'a'} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    expect(() => tabInstance.querySelector('.t-tabs__nav')).not.toBe(null);
  });

  test('render card theme', async () => {
    const testId = 'tab card theme test id';
    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'}>
          <TabPanel value={'a'} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    expect(() => tabInstance.querySelector('.t-tabs__nav--card')).not.toBe(null);
  });

  test('different position', async () => {
    const testId = 'tab position test id';
    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'}>
          <TabPanel value={'a'} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    expect(() => tabInstance.querySelector('.t-is-top')).not.toBe(null);
  });
});
