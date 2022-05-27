import React from 'react';
import { render, testExamples, waitFor, fireEvent } from '@test/utils';
import TabPanel from '../TabPanel';
import Tabs from '../Tabs';
import TabNav from '../TabNav';
import { TdTabsProps } from '../type';

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
    const positions: TdTabsProps['placement'][] = ['top', 'bottom', 'left', 'right'];

    const { getByTestId } = render(
      <div data-testid={testId}>
        {positions.map((position, index: number) => (
          <Tabs placement={position} size={'medium'} key={index}>
            <TabPanel value={'a'} label={'a'}>
              <div>a</div>
            </TabPanel>
            <TabPanel value={'b'} label={'b'}>
              <div>b</div>
            </TabPanel>
          </Tabs>
        ))}
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    positions.forEach((position) => {
      expect(() => tabInstance.querySelector(`.t-is-${position}`)).not.toBe(null);

      if (['left', 'right'].includes(position)) {
        expect(() => tabInstance.querySelector(`.t-is-vertical`)).not.toBe(null);
      }
    });
  });

  test('remove tab', async () => {
    const testId = 'remove tab test id';

    const removeFn = jest.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'} onRemove={removeFn}>
          <TabPanel value={'a'} removable={true} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} removable={true} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    fireEvent.click(tabInstance.querySelector('.remove-btn'));
    expect(removeFn).toBeCalledTimes(1);
  });

  test('remove disabled tab', async () => {
    const testId = 'remove disabled tab test id';

    const removeFn = jest.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'} onRemove={removeFn} disabled>
          <TabPanel value={'a'} removable={true} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} removable={true} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    fireEvent.click(tabInstance.querySelector('.remove-btn'));
    expect(removeFn).toBeCalledTimes(0);
  });

  test('click tab item', async () => {
    const testId = 'tab item test id';

    const clickFn = jest.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'} value="b" onChange={clickFn}>
          <TabPanel value={'a'} removable={true} label={'a'}>
            <div>a</div>
          </TabPanel>
          <TabPanel value={'b'} removable={true} label={'b'}>
            <div>b</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    fireEvent.click(tabInstance.querySelector('.t-tabs__nav-item'));
    expect(clickFn).toBeCalledTimes(1);
  });

  test('add tab item', async () => {
    const testId = 'add tab item test id';

    const addFn = jest.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'} value="b" onAdd={addFn} addable>
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
    fireEvent.click(tabInstance.querySelector('.t-tabs__add-btn'));
    expect(addFn).toBeCalledTimes(1);
  });

  test('no tab item', async () => {
    const testId = 'no tab item test id';

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs placement={'top'} size={'medium'} value="b">
          <div></div>
        </Tabs>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    expect(tabInstance.querySelector('.t-tabs__nav-item')).toBe(null);
  });

  test('test TabNav event', async () => {
    const testId = 'no tab item test id';

    const { getByTestId } = render(
      <div data-testid={testId}>
        <TabNav
          defaultValue={0}
          activeValue={0}
          itemList={[
            {
              value: 0,
            },
          ]}
          tabClick={undefined}
        ></TabNav>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    expect(tabInstance.querySelector('.t-tabs__nav-item-wrapper')).not.toBe(null);
  });
});
