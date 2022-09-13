import React, { useState } from 'react';
import { Tree } from 'tdesign-react';
import { testExamples, render, act, fireEvent, waitFor } from '@test/utils';
import Transfer from '../Transfer';
// 测试组件代码 Example 快照
testExamples(__dirname);
describe('Transfer 测试', () => {
  test('Transfer default加入测试', async () => {
    const InputPlaceholder = '请输入关键词搜索';
    const InputValue = '4';
    const list = [];
    for (let i = 0; i < 5; i++) {
      list.push({
        value: i.toString(),
        label: `点击test${i + 1}`,
        disabled: i === 0,
      });
    }
    function TestComponent() {
      const [value, setValue] = useState(['2']);
      return (
        <Transfer
          data={list}
          value={value}
          checked={['1']}
          search={true}
          operation={['加入', '移除']}
          onChange={(v) => setValue(v)}
        ></Transfer>
      );
    }
    const { container, getByText, queryAllByPlaceholderText } = render(<TestComponent />);
    // 加入前
    expect(container.firstChild).toHaveClass('t-transfer');
    expect(container.firstChild.firstChild).toHaveClass('t-transfer__list-source');
    expect(container.firstChild.firstChild).toHaveTextContent('点击test2');
    expect(container.firstChild.lastChild).toHaveClass('t-transfer__list-target');
    expect(container.firstChild.lastChild).toHaveTextContent('点击test3');
    // 点击加入
    fireEvent.click(getByText('点击test2'));
    fireEvent.click(getByText('加入'));
    // 加入后
    const transContainerL = await waitFor(() => document.querySelector('.t-transfer__list-source'));
    expect(transContainerL).not.toHaveTextContent('点击test2');
    const transContainerR = await waitFor(() => document.querySelector('.t-transfer__list-target'));
    expect(transContainerR).toHaveTextContent('点击test2');
    // 测试搜索框
    fireEvent.change(queryAllByPlaceholderText(InputPlaceholder)[0], { target: { value: InputValue } });
    const transContainerSL = await waitFor(() => document.querySelector('.t-transfer__list-source'));
    expect(transContainerSL).not.toHaveTextContent('点击test1');
  });

  test('Transfer default移除测试', async () => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      list.push({
        value: i.toString(),
        label: `点击test${i + 1}`,
        disabled: i % 4 < 1,
      });
    }
    function TestComponent() {
      const [value, setValue] = useState(['2', '5']);
      return <Transfer data={list} value={value} operation={['加入', '移除']} onChange={(v) => setValue(v)}></Transfer>;
    }
    const { container, getByText } = render(<TestComponent />);
    // 移除前
    expect(container.firstChild.lastChild).toHaveTextContent('点击test3');
    // 点击移除
    fireEvent.click(getByText('点击test3'));
    fireEvent.click(getByText('移除'));
    // 移除后
    const transContainerL = await waitFor(() => document.querySelector('.t-transfer__list-source'));
    expect(transContainerL).toHaveTextContent('点击test3');
    const transContainerR = await waitFor(() => document.querySelector('.t-transfer__list-target'));
    expect(transContainerR).not.toHaveTextContent('点击test3');
  });

  test('Transfer tree进入测试', async () => {
    const TestComponent2 = () => {
      const list2 = [
        {
          value: '2',
          label: '2',
          children: [
            {
              value: 'test2.1',
              label: 'test2.1',
            },
            {
              value: '2.2',
              label: '2.2',
            },
          ],
        },
      ];
      const TreeNode = (props) => <Tree {...props} checkable expandAll={true} />;
      return <Transfer data={list2} operation={['加入', '移除']} checked={['2']} tree={TreeNode}></Transfer>;
    };
    const { container, getByText } = render(<TestComponent2 />);
    setTimeout(() => {
      expect(container.firstChild.firstChild).toHaveTextContent('test2.1');
      expect(container.firstChild.lastChild).not.toHaveTextContent('test2.1');
      fireEvent.click(getByText('加入'));
    }, 20);
    setTimeout(() => {
      expect(container.firstChild.lastChild).toHaveTextContent('test2.1');
    }, 100);
    act(() => {
      jest.runAllTimers();
    });
  });

  test('Transfer tree移除测试', async () => {
    const TestComponent3 = () => {
      const list3 = [
        {
          value: '2',
          label: '2',
        },
      ];
      const TreeNode = (props) => <Tree {...props} checkable expandAll={true} />;
      return <Transfer data={list3} operation={['加入', '移除']} checked={['2']} tree={TreeNode}></Transfer>;
    };
    const { getByText } = render(<TestComponent3 />);
    setTimeout(() => {
      fireEvent.click(getByText('加入'));
    }, 20);
    setTimeout(() => {
      fireEvent.click(getByText('移除'));
    }, 100);
    act(() => {
      jest.runAllTimers();
    });
  });
});
