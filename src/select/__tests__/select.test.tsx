/* eslint-disable */
import { render, fireEvent, mockTimeout, mockDelay, act } from '@test/utils';
import React, { useState } from 'react';
import userEvent from '@testing-library/user-event';

import { Select, SelectProps } from '../index';
import Popup from '../../popup';
import Space from '../../space';
import Tag from '../../tag';

const { Option, OptionGroup } = Select;

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
        let options: typeof defaultOptions = [];
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
      });
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
    const { getByText } = render(<SingleSelect />);

    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();

    // 鼠标点击 input，popup 出现，且展示 options
    fireEvent.click(document.querySelector('input'));
    expect(document.querySelector(popupSelector)).not.toBeNull();
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

    // 点击 Banana 选项，input 展示该选项，且 popup 消失
    fireEvent.click(getByText('Banana'));
    expect(document.querySelector('.t-input__inner')).toHaveValue('Banana');

    await mockTimeout(() => expect(document.querySelector(popupSelector)).not.toBeNull());
    await mockTimeout(() =>
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'none',
      }),
    );
  });

  test('多选测试', async () => {
    const MultipleSelect = () => {
      const [value, setValue] = useState([{ label: 'Apple', value: 'apple' }]);
      const onChange = (value) => {
        setValue(value);
      };
      return (
        <Select value={value} onChange={onChange} multiple valueType="object">
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      );
    };

    const { getByText } = render(<MultipleSelect />);
    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();

    // 鼠标点击 input，popup 出现，且展示 options
    fireEvent.click(document.querySelector('.t-input'));

    expect(document.querySelector(popupSelector)).not.toBeNull();
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

    // 点击 Banana 和 Orange 选项，input 展示 Apple、Banana、Orange 选项，popup 依然展示
    fireEvent.click(getByText('Banana'));
    // @fix: This could be because the text is broken up by multiple elements.
    fireEvent.click(getByText('Orange'));

    expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
    expect(document.querySelector(selectSelector)).toHaveTextContent('Banana');
    expect(document.querySelector(selectSelector)).toHaveTextContent('Orange');

    expect(document.querySelector(selectSelector)).not.toBeNull();
    expect(document.querySelector(selectSelector)).toHaveStyle({
      display: 'block',
    });
  });

  test('多选全选测试', async () => {
    const MultipleSelect = () => {
      const [value, setValue] = useState(['apple']);
      const onChange = (value) => {
        setValue(value);
      };
      return (
        <Select value={value} onChange={onChange} multiple>
          <Option key="all" label="All" value="all" checkAll />
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      );
    };

    const { getByText } = render(<MultipleSelect />);

    fireEvent.click(document.querySelector('.t-input'));

    // 点击全选，input 展示 Apple、Banana、Orange 选项
    fireEvent.click(getByText('All'));
    expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
    expect(document.querySelector(selectSelector)).toHaveTextContent('Banana');
    expect(document.querySelector(selectSelector)).toHaveTextContent('Orange');

    // 再次点击全选，input 清空选项
    fireEvent.click(getByText('All'));
    expect(document.querySelector(selectSelector)).not.toHaveTextContent('Apple');
    expect(document.querySelector(selectSelector)).not.toHaveTextContent('Banana');
    expect(document.querySelector(selectSelector)).not.toHaveTextContent('Orange');
  });

  test('分组选择器测试', async () => {
    const OptionGroupSelect = () => {
      const [value, setValue] = useState('apple');
      const onChange = (value) => {
        setValue(value);
      };

      return (
        <Select value={value} onChange={onChange}>
          <OptionGroup label="Fruit">
            {options.map((item, index) => (
              <Option label={item.label} value={item.value} key={index} />
            ))}
          </OptionGroup>
        </Select>
      );
    };

    const { getByText } = render(<OptionGroupSelect />);
    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();

    // 鼠标点击 input，popup 出现，且展示 options
    fireEvent.click(document.querySelector('.t-input'));
    expect(document.querySelector(popupSelector)).not.toBeNull();
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    expect(document.querySelector(popupSelector)).toHaveTextContent('Fruit');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
    expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

    // 点击 Banana 选项，input 展示该选项，且 popup 消失
    fireEvent.click(getByText('Banana'));
    expect(document.querySelector('.t-input__inner')).toHaveValue('Banana');
    await mockTimeout(() =>
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'none',
      }),
    );
  });

  test('可过滤选择器测试', async () => {
    const testId = 'test-id';
    const FilterableSelect = () => {
      const [value, setValue] = useState();
      const onChange = (value) => {
        setValue(value);
      };

      return (
        <Select filterable value={value} onChange={onChange} placeholder={testId}>
          {options.map((item, index) => (
            <Option key={index} label={item.label} value={item.value} />
          ))}
        </Select>
      );
    };
    const { getByPlaceholderText } = render(<FilterableSelect />);

    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();

    // 输入“an”, input 展示“an”，popup 展示 Banana 和 Orange 选项
    fireEvent.click(getByPlaceholderText(testId));
    fireEvent.change(getByPlaceholderText(testId), { target: { value: 'an' } });
    expect(getByPlaceholderText(testId)).toHaveValue('an');
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    // expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
    // expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

    // 输入“an1”, input展示“an1”，popup展示“无数据”
    fireEvent.change(getByPlaceholderText(testId), { target: { value: 'test' } });
    expect(getByPlaceholderText(testId)).toHaveValue('test');
    expect(document.querySelector(popupSelector)).toHaveTextContent('无数据');
  });

  test('远程搜索测试', async () => {
    const user = userEvent.setup();
    render(<RemoteSearchSelect />);

    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();
    fireEvent.click(document.querySelector('input'));

    // 输入“123”, input 展示“123”，popup 展示123_test1、123_test2、123_test3
    fireEvent.change(document.querySelector('input'), { target: { value: '123' } });
    expect(document.querySelector('input')).toHaveValue('123');
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    await user.keyboard('{Enter}');
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test1'), 100);
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test2'), 100);
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test3'), 100);

    // 清空 input，popup 展示 Apple、Orange、Banana
    fireEvent.change(document.querySelector('input'), { target: { value: '' } });
    expect(document.querySelector('input')).toHaveValue('');
    expect(document.querySelector(popupSelector)).toHaveStyle({
      display: 'block',
    });
    await user.keyboard('{Enter}');
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Apple'), 100);
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Orange'), 100);
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Banana'), 100);
  });

  test('远程搜索多选测试', async () => {
    const { getByText, container } = render(<RemoteSearchSelect multiple />);

    // 未点击 input 前，popup 不出现
    expect(document.querySelector(popupSelector)).toBeNull();

    fireEvent.click(container.querySelector('input'));
    expect(document.querySelector(popupSelector)).not.toBeNull();

    // 输入“123”, input 展示“123”，popup 展示123_test1、123_test2、123_test3
    fireEvent.change(container.querySelector('input'), { target: { value: '123' } });
    expect(container.querySelector('input').value).toBe('123');

    expect(document.querySelector(popupSelector)).toHaveTextContent('加载中');
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test1'));

    // 选择123_test1，展示对应 tag
    fireEvent.click(getByText('123_test1'));
    await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test1'));

    fireEvent.change(document.querySelector('input'), { target: { value: '' } });
    fireEvent.click(getByText('123_test2'));
    // 已选的 123_test1 仍然保留
    await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test1'));
    await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test2'));
  });

  test('label display', async () => {
    const text = 'test-label';
    const { getByText } = await render(<Select options={[]} label={text} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });

  test('prefixIcon display', async () => {
    const text = 'test-prefixIcon';
    const { getByText } = await render(<Select options={[]} prefixIcon={<span>{text}</span>} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });

  test('collapsedItems all select', async () => {
    const minCollapsedNum = 1;
    const renderCollapsedItems: SelectProps['collapsedItems'] = ({ collapsedSelectedItems, onClose }) => (
      <Popup
        key={'tags'}
        overlayInnerStyle={{
          padding: '5px',
        }}
        content={
          <Space size={5} align="center">
            {collapsedSelectedItems.map((item, index) => (
              <Tag
                color="red"
                key={index}
                onClose={(context) => onClose({ e: context.e, index: minCollapsedNum + index })}
              >
                {item.label}
              </Tag>
            ))}
          </Space>
        }
      >
        <Tag>More({collapsedSelectedItems?.length})</Tag>
      </Popup>
    );

    const MultipleSelect = () => {
      const selectAllValue = ['apple', 'banana', 'orange'];

      return (
        <Select
          options={options}
          multiple
          minCollapsedNum={1}
          value={selectAllValue}
          collapsedItems={renderCollapsedItems}
        />
      );
    };
    const { container } = render(<MultipleSelect />);

    const tags = container.querySelectorAll('.t-tag');
    expect(tags[0]).toHaveTextContent('Apple');
    expect(tags[1]).toHaveTextContent('More(2)');

    // collapsedItems popup 未展示
    const selectPopups = document.querySelectorAll(popupSelector);
    expect(selectPopups.length).toBe(0);

    // collapsedItems popup 展示
    fireEvent.mouseEnter(tags[1]);
    const collapsedPopups = document.querySelectorAll(popupSelector);
    expect(collapsedPopups.length).toBe(1);
    // 判断展示的tag
    const collapsedTags = collapsedPopups[0].querySelectorAll('.t-tag');
    expect(collapsedTags.length).toBe(2);
    expect(collapsedTags[0]).toHaveTextContent('Banana');
    expect(collapsedTags[1]).toHaveTextContent('Orange');
  });

  test('collapsedItems click select', async () => {
    const minCollapsedNum = 1;
    const renderCollapsedItems: SelectProps['collapsedItems'] = ({ collapsedSelectedItems, onClose }) => (
      <Popup
        key={'tags'}
        overlayInnerStyle={{
          padding: '5px',
        }}
        content={
          <Space size={5} align="center" className="collapsed-items-popup">
            {collapsedSelectedItems.map((item, index) => (
              <Tag
                color="red"
                key={index}
                onClose={(context) => onClose({ e: context.e, index: minCollapsedNum + index })}
              >
                {item.label}
              </Tag>
            ))}
          </Space>
        }
      >
        <Tag>More({collapsedSelectedItems?.length})</Tag>
      </Popup>
    );

    const MultipleSelect = () => {
      const [value, setValue] = useState([]);
      const onChange = (value) => {
        setValue(value);
      };
      return (
        <Select
          options={options}
          multiple
          minCollapsedNum={1}
          onChange={onChange}
          value={value}
          collapsedItems={renderCollapsedItems}
        />
      );
    };
    const { getByText, container } = render(<MultipleSelect />);
    const tags0 = container.querySelectorAll('.t-tag');
    expect(tags0.length).toBe(0);

    // 检测第一次select value
    expect(document.querySelectorAll(popupSelector).length).toBe(0);
    fireEvent.click(document.querySelector('.t-input'));
    fireEvent.click(getByText('Apple'));
    const tags1 = container.querySelectorAll('.t-tag');
    expect(tags1.length).toBe(1);
    expect(tags1[0]).toHaveTextContent('Apple');
    //input popup 消失
    fireEvent.click(document.querySelector('.t-input'));
    expect(document.querySelectorAll(popupSelector).length).toBe(1);
    await mockTimeout(() => {
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'none',
      });
    });

    // 检测第二次 select value
    fireEvent.click(document.querySelector('.t-input'));
    await mockTimeout(() => {
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
    });
    fireEvent.click(getByText('Orange'));
    const tags2 = container.querySelectorAll('.t-tag');
    expect(tags2.length).toBe(2);
    expect(tags2[0]).toHaveTextContent('Apple');
    expect(tags2[1]).toHaveTextContent('More(1)');
    //input popup 消失
    fireEvent.click(document.querySelector('.t-input'));
    await mockTimeout(() => {
      expect(document.querySelectorAll(popupSelector).length).toBe(1);
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'none',
      });
    });
    // collapsedItems popup 展示
    fireEvent.mouseEnter(tags2[1]);
    expect(document.querySelectorAll(popupSelector).length).toBe(2);
    // 判断展示的tag
    const collapsedTags2 = document.querySelectorAll('.collapsed-items-popup .t-tag');
    expect(collapsedTags2.length).toBe(1);
    expect(collapsedTags2[0]).toHaveTextContent('Orange');

    // 检测第三次 select value
    fireEvent.click(document.querySelector('.t-input'));
    await mockTimeout(() => {
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
    });
    fireEvent.click(getByText('Banana'));
    const tags3 = container.querySelectorAll('.t-tag');
    expect(tags3.length).toBe(2);
    expect(tags3[0]).toHaveTextContent('Apple');
    expect(tags3[1]).toHaveTextContent('More(2)');
    //input popup 消失
    fireEvent.click(document.querySelector('.t-input'));
    await mockTimeout(() => {
      expect(document.querySelectorAll(popupSelector).length).toBe(2);
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'none',
      });
    });
    // collapsedItems popup 展示
    fireEvent.mouseEnter(tags3[1]);
    expect(document.querySelectorAll(popupSelector).length).toBe(2);
    // 判断展示的tag
    const collapsedTags3 = document.querySelectorAll('.collapsed-items-popup .t-tag');
    expect(collapsedTags3.length).toBe(2);
    expect(collapsedTags3[0]).toHaveTextContent('Orange');
    expect(collapsedTags3[1]).toHaveTextContent('Banana');
  });
});
