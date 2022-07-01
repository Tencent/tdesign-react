/* eslint-disable */
import { testExamples, render, waitFor, fireEvent, act } from '@test/utils';
import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const { Option, OptionGroup } = Select;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Select 组件测试', () => {
  const selectSelector = '.t-select';
  const popupSelector = '.t-popup';
  const options = [
    {
      label: 'Apple',
      value: 'apple',
    },
    {
      label: 'Banana',
      value: 'banana',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
  ];

  const RemoteSearchSelect = ({ multiple }: { multiple?: boolean }) => {
    const defaultOptions = [
      {
        label: 'Apple',
        value: 'apple',
      },
      {
        label: 'Banana',
        value: 'banana',
      },
      {
        label: 'Orange',
        value: 'orange',
      },
    ];
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(defaultOptions);

    const onChange = (value) => {
      setValue(value);
    };

    const handleRemoteSearch = (search) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        let options = [];
        if (search) {
          options = [
            {
              value: `${search}_test1`,
              label: `${search}_test1`,
            },
            {
              value: `${search}_test2`,
              label: `${search}_test2`,
            },
            {
              value: `${search}_test3`,
              label: `${search}_test3`,
            },
          ];
        } else {
          options = defaultOptions;
        }
        setOptions(options);
      }, 300);
    };

    return (
      <Select
        filterable
        multiple={multiple}
        value={value}
        onChange={onChange}
        loading={loading}
        onSearch={handleRemoteSearch}
      >
        {options.map((item) => (
          <Option key={item.value} label={item.label} value={item.value} />
        ))}
      </Select>
    );
  };

  test('单选测试', async () => {
    await act(async () => {
      const SingleSelect = () => {
        const [value, setValue] = useState('apple');
        const onChange = (value) => {
          setValue(value);
        };
        return (
          <Select value={value} onChange={onChange} style={{ width: '40%' }}>
            <Option key="apple" label="Apple" value="apple" />
            <Option key="orange" label="Orange" value="orange" />
            <Option key="banana" label="Banana" value="banana" />
          </Select>
        );
      };
      const { getByDisplayValue, getByText } = render(<SingleSelect />);

      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 鼠标点击 input，popup 出现，且展示 options
      fireEvent.click(getByDisplayValue('Apple'));
      const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement2).not.toBeNull();
      expect(popupElement2).toHaveStyle({
        display: 'block',
      });
      expect(popupElement2).toHaveTextContent('Apple');
      expect(popupElement2).toHaveTextContent('Orange');
      expect(popupElement2).toHaveTextContent('Banana');

      // 点击 Banana 选项，input 展示该选项，且 popup 消失
      fireEvent.click(getByText('Banana'));
      const selectElement = await waitFor(() => document.querySelector('.t-input__inner'));
      expect(selectElement).toHaveValue('Banana');
      setTimeout(async () => {
        const popupElement3 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement3).not.toBeNull();
        expect(popupElement3).toHaveStyle({
          display: 'none',
        });
      }, 0);
    });
  });

  test('多选测试', async () => {
    await act(async () => {
      const MultipleSelect = () => {
        const [value, setValue] = useState([{ label: 'Apple', value: 'apple' }]);
        const onChange = (value) => {
          setValue(value);
        };
        return (
          <Select value={value} onChange={onChange} multiple style={{ width: '40%' }} valueType="object">
            <Option key="apple" label="Apple" value="apple" />
            <Option key="orange" label="Orange" value="orange" />
            <Option key="banana" label="Banana" value="banana" />
          </Select>
        );
      };

      const { getByText } = render(<MultipleSelect />);
      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 鼠标点击 input，popup 出现，且展示 options
      fireEvent.click(getByText('Apple'));
      const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement2).not.toBeNull();
      expect(popupElement2).toHaveStyle({
        display: 'block',
      });
      expect(popupElement2).toHaveTextContent('Apple');
      expect(popupElement2).toHaveTextContent('Orange');
      expect(popupElement2).toHaveTextContent('Banana');

      // 点击 Banana 和 Orange 选项，input 展示 Apple、Banana、Orange 选项，popup 依然展示
      fireEvent.click(getByText('Banana'));
      // @fix: This could be because the text is broken up by multiple elements.
      fireEvent.click(getByText('Orange'));
      const selectElement = await waitFor(() => document.querySelector(selectSelector));
      expect(selectElement).toHaveTextContent('Apple');
      expect(selectElement).toHaveTextContent('Banana');
      expect(selectElement).toHaveTextContent('Orange');
      const popupElement3 = await waitFor(() => document.querySelector(selectSelector));
      expect(popupElement3).not.toBeNull();
      expect(popupElement3).toHaveStyle({
        display: 'block',
      });
    });
  });

  test('分组选择器测试', async () => {
    const OptionGroupSelect = () => {
      const [value, setValue] = useState('apple');
      const onChange = (value) => {
        setValue(value);
      };

      return (
        <Select value={value} onChange={onChange} style={{ width: '40%' }}>
          <OptionGroup label="Fruit">
            {options.map((item, index) => (
              <Option label={item.label} value={item.value} key={index} />
            ))}
          </OptionGroup>
        </Select>
      );
    };

    await act(async () => {
      const { getByText, getByDisplayValue } = render(<OptionGroupSelect />);
      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 鼠标点击 input，popup 出现，且展示 options
      const selectElement = await waitFor(() => document.querySelector(selectSelector));
      fireEvent.click(getByDisplayValue('Apple'));
      const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement2).not.toBeNull();
      expect(popupElement2).toHaveStyle({
        display: 'block',
      });
      expect(popupElement2).toHaveTextContent('Fruit');
      expect(popupElement2).toHaveTextContent('Apple');
      expect(popupElement2).toHaveTextContent('Orange');
      expect(popupElement2).toHaveTextContent('Banana');

      // 点击 Banana 选项，input 展示该选项，且 popup 消失
      fireEvent.click(getByText('Banana'));
      expect(document.querySelector('.t-input__inner')).toHaveValue('Banana');
      setTimeout(async () => {
        const popupElement3 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement3).not.toBeNull();
        expect(popupElement3).toHaveStyle({
          display: 'none',
        });
      }, 0);
    });
  });

  test('可过滤选择器测试', async () => {
    await act(async () => {
      const FilterableSelect = () => {
        const [value, setValue] = useState();

        const onChange = (value) => {
          setValue(value);
        };

        return (
          <Select filterable value={value} onChange={onChange}>
            {options.map((item, index) => (
              <Option key={index} label={item.label} value={item.value} />
            ))}
          </Select>
        );
      };
      render(<FilterableSelect />);

      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 输入“an”, input 展示“an”，popup 展示 Banana 和 Orange 选项
      const input = await waitFor(() => document.querySelector('input'));
      fireEvent.change(input, { target: { value: 'an' } });
      setTimeout(async () => {
        expect(input).toHaveTextContent('an');
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).not.toBeNull();
        expect(popupElement2).toHaveStyle({
          display: 'block',
        });
        expect(popupElement2).toHaveTextContent('Orange');
        expect(popupElement2).toHaveTextContent('Banana');
      }, 0);

      // 输入“an1”, input展示“an1”，popup展示“无数据”
      const input1 = await waitFor(() => document.querySelector('input'));
      fireEvent.change(input1, { target: { value: 'an1' } });
      setTimeout(async () => {
        expect(input).toHaveTextContent('an1');
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).not.toBeNull();
        expect(popupElement2).toHaveStyle({
          display: 'block',
        });
        expect(popupElement2).toHaveTextContent('无数据');
      }, 0);
    });
  });

  test('远程搜索测试', async () => {
    await act(async () => {
      render(<RemoteSearchSelect />);

      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 输入“123”, input 展示“123”，popup 展示123_test1、123_test2、123_test3
      const input = await waitFor(() => document.querySelector('input'));
      fireEvent.change(input, { target: { value: '123' } });
      setTimeout(async () => {
        expect(input).toHaveTextContent('123');
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).not.toBeNull();
        expect(popupElement2).toHaveStyle({
          display: 'block',
        });
        expect(popupElement2).toHaveTextContent('123_test1');
        expect(popupElement2).toHaveTextContent('123_test2');
        expect(popupElement2).toHaveTextContent('123_test3');
      }, 0);

      // 清空 input，popup 展示 Apple、Orange、Banana
      fireEvent.change(input, { target: { value: '' } });
      setTimeout(async () => {
        expect(input).toHaveTextContent('');
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).not.toBeNull();
        expect(popupElement2).toHaveStyle({
          display: 'block',
        });
        expect(popupElement2).toHaveTextContent('Apple');
        expect(popupElement2).toHaveTextContent('Orange');
        expect(popupElement2).toHaveTextContent('Banana');
      }, 0);
    });
  });

  test('远程搜索多选测试', async () => {
    await act(async () => {
      const { getByText } = render(<RemoteSearchSelect multiple />);

      // 未点击 input 前，popup 不出现
      const popupElement1 = await waitFor(() => document.querySelector(popupSelector));
      expect(popupElement1).toBeNull();

      // 输入“123”, input 展示“123”，popup 展示123_test1、123_test2、123_test3
      const input = await waitFor(() => document.querySelector('input'));
      fireEvent.change(input, { target: { value: '123' } });
      setTimeout(async () => {
        expect(input).toHaveTextContent('123');
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).toHaveTextContent('123_test1');
        expect(popupElement2).toHaveTextContent('123_test2');
        expect(popupElement2).toHaveTextContent('123_test3');

        // 选择123_test1，展示对应 tag
        fireEvent.click(getByText('123_test1'));
        const selectElement = await waitFor(() => document.querySelector(selectSelector));
        expect(selectElement).toHaveTextContent('123_test1');
      }, 0);

      // 清空 input，popup 展示 Apple、Orange、Banana
      fireEvent.change(input, { target: { value: '' } });
      setTimeout(async () => {
        const popupElement2 = await waitFor(() => document.querySelector(popupSelector));
        expect(popupElement2).toHaveTextContent('Apple');
        expect(popupElement2).toHaveTextContent('Orange');
        expect(popupElement2).toHaveTextContent('Banana');

        fireEvent.click(getByText('Apple'));
        // 已选的 123_test1 仍然保留
        const selectElement = await waitFor(() => document.querySelector(selectSelector));
        expect(selectElement).toHaveTextContent('123_test1');
        expect(selectElement).toHaveTextContent('Apple');
      }, 0);
    });
  });
});
