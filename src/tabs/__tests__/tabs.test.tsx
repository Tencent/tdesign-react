import React from 'react';
import { render, waitFor, fireEvent, act, vi } from '@test/utils';
import TabPanel from '../TabPanel';
import Tabs from '../Tabs';
import TabNav from '../TabNav';
import { TdTabsProps } from '../type';

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

  test('render by list prop', async () => {
    const testId = 'tab bar test id';
    const { getByTestId } = render(
      <div data-testid={testId}>
        <Tabs
          data-testid={testId}
          size={'medium'}
          list={[
            {
              label: 'a',
              value: 'a',
            },
            {
              label: 'b',
              value: 'b',
            },
          ]}
        />
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    expect(tabInstance.querySelector('.t-tabs__nav')).not.toBe(null);
    expect(tabInstance.querySelector('.t-tabs__nav-wrap').children.length).toBe(4);
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

  vi.useRealTimers();
  test('async render card', async () => {
    const testId = 'tab bar test id';

    const getLists = vi.fn(
      () =>
        new Promise<
          {
            label: string;
            value: string;
          }[]
        >((re) =>
          setTimeout(() => {
            re([
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]);
          }, 1000),
        ),
    );

    const useFetch = <F extends () => Promise<any>>(func: F) => {
      const [data, setData] = React.useState<Awaited<ReturnType<F>> | undefined>(undefined);
      const funcS = React.useCallback(func, [func]);
      React.useEffect(() => {
        funcS().then((ls) => {
          act(setData.bind(null, ls));
        });
      }, [funcS]);
      return { data };
    };

    const DynamicTabs = () => {
      const { data: list = [] } = useFetch(getLists);
      return (
        <Tabs data-testid={testId} placement="top" size="medium" value="a">
          {list && list.map(({ label, value }) => <TabPanel label={label} value={value} key={value} />)}
        </Tabs>
      );
    };

    const { getByTestId } = render(
      <div data-testid={testId}>
        <DynamicTabs />
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));

    const getNavItems = () => tabInstance.querySelectorAll('.t-tabs__nav-item');

    expect(getNavItems().length).toBe(0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(getNavItems().length).toBe(2);
    expect(() => tabInstance.querySelector('.t-tabs__bar')).not.toBe(null);
    const tabBar = tabInstance.querySelector('.t-tabs__bar');
    // 没有值是正常的，这个地方只是校验修改了 tabs 能触发 tab bar 更新 style 的信息
    expect(tabBar.getAttribute('style')).toBe('transform: translateX(0px); width: 0px;');
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
      if (!position) {
        return;
      }
      expect(() => tabInstance.querySelector(`.t-is-${position}`)).not.toBe(null);

      if (['left', 'right'].includes(position)) {
        expect(() => tabInstance.querySelector(`.t-is-vertical`)).not.toBe(null);
      }
    });
  });

  test('remove tab', async () => {
    const testId = 'remove tab test id';

    const removeFn = vi.fn();

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

    const removeFn = vi.fn();

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

    const clickFn = vi.fn();

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

    const addFn = vi.fn();

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
          tabClick={() => ''}
        ></TabNav>
      </div>,
    );

    const tabInstance = await waitFor(() => getByTestId(testId));
    expect(tabInstance.querySelector('.t-tabs__nav-item-wrapper')).not.toBe(null);
  });

  const mockFn = vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect');
  mockFn.mockImplementation(() => ({ width: 20, x: 5, clientX: 5 }));

  test('test drag', async () => {
    const onDragSort = vi.fn(() => {
      console.log('888---999');
      // 模拟顺序交换
      const tagBox = document.querySelectorAll('.t-tabs__nav-wrap').item(0);
      const vueTag = document.querySelectorAll('.t-tabs__nav-item').item(0);
      const reactTag = document.querySelectorAll('.t-tabs__nav-item').item(1);
      const cloneReact = reactTag.cloneNode(true);
      tagBox.insertBefore(cloneReact, vueTag);
      tagBox.removeChild(reactTag);
    });

    const { container } = render(
      <div>
        <Tabs dragSort onDragSort={onDragSort}>
          <TabPanel value={'vue'} label={'vue'}>
            <div>vueContent</div>
          </TabPanel>
          <TabPanel value={'react'} label={'react'}>
            <div>reactContent</div>
          </TabPanel>
        </Tabs>
      </div>,
    );

    fireEvent.dragStart(container.querySelectorAll('.t-tabs__nav-item').item(1), {
      dataTransfer: {
        currentIndex: 1,
        targetIndex: 0,
      },
    });

    fireEvent.dragOver(container.querySelectorAll('.t-tabs__nav-item').item(0), {
      dataTransfer: {
        currentIndex: 1,
        targetIndex: 0,
      },
    });
    expect(onDragSort).toHaveBeenCalled(1);
    expect(onDragSort.mock.calls[0][0].target.value).toEqual('vue');
    expect(container.querySelectorAll('.t-tabs__nav-item-text-wrapper').item(0).firstChild.nodeValue).toEqual('react');
  });
});
