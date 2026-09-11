import React, { useState } from 'react';
import { act, fireEvent, mockTimeout, render, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';

import Popup from '../../popup';
import Space from '../../space';
import Tag from '../../tag';
import { Select } from '../index';

import type { SelectProps } from '../index';

const { Option, OptionGroup } = Select;

const selectSelector = '.t-select';
const popupSelector = '.t-popup';

const options = [
  {
    label: 'Apple',
    value: 'apple',
    disabled: true,
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

const filterableOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
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
  const [remoteOptions, setRemoteOptions] = useState(defaultOptions);

  const onChange = (nextValue) => {
    setValue(nextValue);
  };

  const handleRemoteSearch = (search) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let nextOptions: typeof defaultOptions = [];
      if (search) {
        nextOptions = [
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
        nextOptions = defaultOptions;
      }
      setRemoteOptions(nextOptions);
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
      {remoteOptions.map((item) => (
        <Option key={item.value} label={item.label} value={item.value} />
      ))}
    </Select>
  );
};

const createCollapsedItems =
  (minCollapsedNum: number, extraClassName?: string): SelectProps['collapsedItems'] =>
  ({ collapsedSelectedItems, onClose }) => (
    <Popup
      key="tags"
      overlayInnerStyle={{
        padding: '5px',
      }}
      content={
        <Space size={5} align="center" className={extraClassName}>
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

describe('Select', () => {
  describe('props', () => {
    test('valueDisplay', () => {
      const { container } = render(
        <Select value="china" valueDisplay="+86" options={[{ label: '中国', value: 'china' }]} />,
      );
      expect(container.querySelector('.t-input__prefix')).toHaveTextContent('+86');
      expect(container.querySelector('.t-input__inner')).toHaveValue(' ');
    });

    test('options.label', () => {
      const { container } = render(
        <Select
          value="ai"
          options={[
            {
              label: <span className="custom-label">人工智能</span>,
              value: 'ai',
            },
          ]}
        />,
      );
      expect(container.querySelector('.t-input__prefix .custom-label')).toHaveTextContent('人工智能');
      expect(container.querySelector('.t-input__inner')).toHaveValue(' ');
    });
  });

  describe('slots', () => {
    test('label', async () => {
      const text = 'test-label';
      const { getByText } = await render(<Select options={[]} label={text} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('prefixIcon', async () => {
      const text = 'test-prefixIcon';
      const { getByText } = await render(<Select options={[]} prefixIcon={<span>{text}</span>} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('collapsedItems', async () => {
      const minCollapsedNum = 1;
      const MultipleSelect = () => {
        const selectAllValue = ['apple', 'banana', 'orange'];

        return (
          <Select
            options={options}
            multiple
            minCollapsedNum={1}
            value={selectAllValue}
            collapsedItems={createCollapsedItems(minCollapsedNum)}
          />
        );
      };
      const { container } = render(<MultipleSelect />);

      const tags = container.querySelectorAll('.t-tag');
      expect(tags[0]).toHaveTextContent('Apple');
      expect(tags[1]).toHaveTextContent('More(2)');

      const selectPopups = document.querySelectorAll(popupSelector);
      expect(selectPopups.length).toBe(0);

      fireEvent.mouseEnter(tags[1]);
      const collapsedPopups = document.querySelectorAll(popupSelector);
      expect(collapsedPopups.length).toBe(1);
      const collapsedTags = collapsedPopups[0].querySelectorAll('.t-tag');
      expect(collapsedTags.length).toBe(2);
      expect(collapsedTags[0]).toHaveTextContent('Banana');
      expect(collapsedTags[1]).toHaveTextContent('Orange');
    });
  });

  describe('scenarios', () => {
    test('单选', async () => {
      const SingleSelect = () => {
        const [value, setValue] = useState('apple');
        const onChange = (nextValue) => {
          setValue(nextValue);
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

      expect(document.querySelector(popupSelector)).toBeNull();

      fireEvent.click(document.querySelector('input'));
      expect(document.querySelector(popupSelector)).not.toBeNull();
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
      expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

      fireEvent.click(getByText('Banana'));
      expect(document.querySelector('.t-input__inner')).toHaveValue('Banana');

      await mockTimeout(() => expect(document.querySelector(popupSelector)).not.toBeNull());
      await mockTimeout(() =>
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'none',
        }),
      );
    });

    test('多选', async () => {
      const MultipleSelect = () => {
        const [value, setValue] = useState([{ label: 'Apple', value: 'apple' }]);
        const onChange = (nextValue) => {
          setValue(nextValue);
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
      expect(document.querySelector(popupSelector)).toBeNull();

      fireEvent.click(document.querySelector('.t-input'));

      expect(document.querySelector(popupSelector)).not.toBeNull();
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
      expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

      fireEvent.click(getByText('Banana'));
      fireEvent.click(getByText('Orange'));

      expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Banana');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Orange');

      expect(document.querySelector(selectSelector)).not.toBeNull();
      expect(document.querySelector(selectSelector)).toHaveStyle({
        display: 'block',
      });
    });

    test('多选全选', async () => {
      const MultipleSelect = () => {
        const [value, setValue] = useState(['apple']);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };
        return (
          <Select value={value} onChange={onChange} multiple>
            <Option key="all" label="All" value="all" checkAll />
            <Option key="apple" label="Apple" value="apple" disabled />
            <Option key="orange" label="Orange" value="orange" />
            <Option key="banana" label="Banana" value="banana" />
          </Select>
        );
      };

      const { getByText } = render(<MultipleSelect />);

      fireEvent.click(document.querySelector('.t-input'));

      const disabledApple = document.querySelector('.t-select-option.t-is-disabled');
      expect(disabledApple).toHaveTextContent('Apple');

      fireEvent.click(getByText('All'));
      expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Banana');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Orange');

      fireEvent.click(getByText('All'));
      expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(selectSelector)).not.toHaveTextContent('Banana');
      expect(document.querySelector(selectSelector)).not.toHaveTextContent('Orange');
    });

    test('分组选择器', async () => {
      const OptionGroupSelect = () => {
        const [value, setValue] = useState('apple');
        const onChange = (nextValue) => {
          setValue(nextValue);
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
      expect(document.querySelector(popupSelector)).toBeNull();

      fireEvent.click(document.querySelector('.t-input'));
      expect(document.querySelector(popupSelector)).not.toBeNull();
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
      expect(document.querySelector(popupSelector)).toHaveTextContent('Fruit');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Orange');
      expect(document.querySelector(popupSelector)).toHaveTextContent('Banana');

      fireEvent.click(getByText('Banana'));
      expect(document.querySelector('.t-input__inner')).toHaveValue('Banana');
      await mockTimeout(() =>
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'none',
        }),
      );
    });

    test('分组选择器全选', async () => {
      const OptionGroupCheckAllSelect = () => {
        const [value, setValue] = useState(['apple']);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };

        return (
          <Select value={value} onChange={onChange} multiple>
            <Option key="all" label="All" value="all" checkAll />
            <OptionGroup label="Fruit">
              {options.map((item, index) => (
                <Option label={item.label} value={item.value} disabled={item.disabled} key={index} />
              ))}
            </OptionGroup>
          </Select>
        );
      };

      const { getByText } = render(<OptionGroupCheckAllSelect />);
      fireEvent.click(document.querySelector('.t-input'));

      fireEvent.click(getByText('All'));
      expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Banana');
      expect(document.querySelector(selectSelector)).toHaveTextContent('Orange');

      fireEvent.click(getByText('All'));
      expect(document.querySelector(selectSelector)).toHaveTextContent('Apple');
      expect(document.querySelector(selectSelector)).not.toHaveTextContent('Banana');
      expect(document.querySelector(selectSelector)).not.toHaveTextContent('Orange');
    });

    test('可过滤', async () => {
      const testId = 'test-id';
      const FilterableSelect = () => {
        const [value, setValue] = useState();
        const onChange = (nextValue) => {
          setValue(nextValue);
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

      expect(document.querySelector(popupSelector)).toBeNull();

      fireEvent.click(getByPlaceholderText(testId));
      fireEvent.change(getByPlaceholderText(testId), {
        target: { value: 'an' },
      });
      expect(getByPlaceholderText(testId)).toHaveValue('an');
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });

      fireEvent.change(getByPlaceholderText(testId), {
        target: { value: 'test' },
      });
      expect(getByPlaceholderText(testId)).toHaveValue('test');
      expect(document.querySelector(popupSelector)).toHaveTextContent('无数据');
    });

    test('可过滤中文输入法', async () => {
      const testId = 'test-id-ime';
      const onSelectedChange = vi.fn();
      const imeInput = (input: HTMLInputElement, value: string) => {
        fireEvent.compositionStart(input, { target: { value: input.value } });
        fireEvent.change(input, { target: { value } });
        fireEvent.compositionEnd(input, { target: { value } });
      };
      const cnOptions = [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '橙子', value: 'orange' },
      ];

      const FilterableSelect = () => {
        const [value, setValue] = useState();
        const onChange = (nextValue) => {
          onSelectedChange(nextValue);
          setValue(nextValue);
        };

        return (
          <Select filterable value={value} onChange={onChange} placeholder={testId}>
            {cnOptions.map((item, index) => (
              <Option key={index} label={item.label} value={item.value} />
            ))}
          </Select>
        );
      };
      const { getByPlaceholderText, getByText } = render(<FilterableSelect />);
      const input = getByPlaceholderText(testId) as HTMLInputElement;

      fireEvent.click(input);
      imeInput(input, '苹');
      expect(input).toHaveValue('苹');
      expect(document.querySelector(popupSelector)).toHaveTextContent('苹果');
      expect(document.querySelector(popupSelector)).not.toHaveTextContent('香蕉');
      expect(document.querySelector(popupSelector)).not.toHaveTextContent('橙子');
      expect(onSelectedChange).not.toHaveBeenCalled();

      fireEvent.click(getByText('苹果'));
      expect(input).toHaveValue('苹果');
      expect(onSelectedChange).toHaveBeenCalledTimes(1);
      expect(onSelectedChange).toHaveBeenLastCalledWith('apple');

      fireEvent.click(input);
      expect(input).toHaveValue('');
      fireEvent.compositionStart(input, { target: { value: input.value } });
      expect(input).toHaveValue('');
      fireEvent.change(input, { target: { value: 'xiang' } });
      expect(input).toHaveValue('xiang');
      expect(document.querySelector(popupSelector)).toHaveTextContent('苹果');
      expect(document.querySelector(popupSelector)).toHaveTextContent('香蕉');
      expect(document.querySelector(popupSelector)).toHaveTextContent('橙子');
      fireEvent.compositionEnd(input, { target: { value: '香' } });
      expect(input).toHaveValue('香');
      expect(document.querySelector(popupSelector)).toHaveTextContent('香蕉');
      expect(document.querySelector(popupSelector)).not.toHaveTextContent('苹果');
      expect(document.querySelector(popupSelector)).not.toHaveTextContent('橙子');
      expect(onSelectedChange).toHaveBeenCalledTimes(1);
      fireEvent.mouseDown(document.body);
      expect(input).toHaveValue('苹果');
      expect(onSelectedChange).toHaveBeenCalledTimes(1);
    });

    test('远程搜索', async () => {
      const user = userEvent.setup();
      render(<RemoteSearchSelect />);

      expect(document.querySelector(popupSelector)).toBeNull();
      fireEvent.click(document.querySelector('input'));

      fireEvent.change(document.querySelector('input'), {
        target: { value: '123' },
      });
      expect(document.querySelector('input')).toHaveValue('123');
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
      await user.keyboard('{Enter}');
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test1'), 100);
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test2'), 100);
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test3'), 100);

      fireEvent.change(document.querySelector('input'), {
        target: { value: '' },
      });
      expect(document.querySelector('input')).toHaveValue('');
      expect(document.querySelector(popupSelector)).toHaveStyle({
        display: 'block',
      });
      await user.keyboard('{Enter}');
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Apple'), 100);
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Orange'), 100);
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('Banana'), 100);
    });

    test('远程搜索多选', async () => {
      const { getByText, container } = render(<RemoteSearchSelect multiple />);

      expect(document.querySelector(popupSelector)).toBeNull();

      fireEvent.click(container.querySelector('input'));
      expect(document.querySelector(popupSelector)).not.toBeNull();

      fireEvent.change(container.querySelector('input'), {
        target: { value: '123' },
      });
      expect(container.querySelector('input').value).toBe('123');

      expect(document.querySelector(popupSelector)).toHaveTextContent('加载中');
      await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveTextContent('123_test1'));

      fireEvent.click(getByText('123_test1'));
      await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test1'));

      fireEvent.change(document.querySelector('input'), {
        target: { value: '' },
      });
      fireEvent.click(getByText('123_test2'));
      await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test1'));
      await mockTimeout(() => expect(document.querySelector(selectSelector)).toHaveTextContent('123_test2'));
    });

    test('collapsedItems 点击选择', async () => {
      const minCollapsedNum = 1;
      const MultipleSelect = () => {
        const [value, setValue] = useState([]);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };
        return (
          <Select
            options={options}
            multiple
            minCollapsedNum={1}
            onChange={onChange}
            value={value}
            collapsedItems={createCollapsedItems(minCollapsedNum, 'collapsed-items-popup')}
          />
        );
      };
      const { getByText, container } = render(<MultipleSelect />);

      const tags = container.querySelectorAll('.t-tag');
      expect(tags.length).toBe(0);

      expect(document.querySelectorAll(popupSelector).length).toBe(0);
      fireEvent.click(document.querySelector('.t-input'));
      fireEvent.click(getByText('Apple'));
      const tags0 = container.querySelectorAll('.t-tag');
      expect(tags0.length).toBe(0);

      fireEvent.click(getByText('Banana'));
      const tags1 = container.querySelectorAll('.t-tag');
      expect(tags1.length).toBe(1);
      expect(tags1[0]).toHaveTextContent('Banana');
      fireEvent.click(document.querySelector('.t-input'));
      expect(document.querySelectorAll(popupSelector).length).toBe(1);
      await mockTimeout(() => {
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'none',
        });
      });

      fireEvent.click(document.querySelector('.t-input'));
      await mockTimeout(() => {
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'block',
        });
      });
      fireEvent.click(getByText('Orange'));
      const tags2 = container.querySelectorAll('.t-tag');
      expect(tags2.length).toBe(2);
      expect(tags2[0]).toHaveTextContent('Banana');
      expect(tags2[1]).toHaveTextContent('More(1)');

      fireEvent.click(document.querySelector('.t-input'));
      await mockTimeout(() => {
        expect(document.querySelectorAll(popupSelector).length).toBe(1);
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'none',
        });
      });

      fireEvent.mouseEnter(tags2[1]);
      expect(document.querySelectorAll(popupSelector).length).toBe(2);
      const collapsedTags2 = document.querySelectorAll('.collapsed-items-popup .t-tag');
      expect(collapsedTags2.length).toBe(1);
      expect(collapsedTags2[0]).toHaveTextContent('Orange');

      fireEvent.click(document.querySelector('.t-input'));
      await mockTimeout(() => {
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'block',
        });
      });
      const selectOptions = document.querySelectorAll('.t-select-option');
      const orangeOption = Array.from(selectOptions).find((option) => option.textContent.includes('Orange'));
      fireEvent.click(orangeOption);
      const tags3 = container.querySelectorAll('.t-tag');
      expect(tags3.length).toBe(1);
      expect(tags3[0]).toHaveTextContent('Banana');

      fireEvent.click(document.querySelector('.t-input'));
      await mockTimeout(() => {
        expect(document.querySelectorAll(popupSelector).length).toBe(1);
        expect(document.querySelector(popupSelector)).toHaveStyle({
          display: 'none',
        });
      });
    });

    test.each([
      { source: 'options', destroyOnClose: false },
      { source: 'children', destroyOnClose: false },
      { source: 'options', destroyOnClose: true },
      { source: 'children', destroyOnClose: true },
    ])('筛选后关闭动画期间保持过滤列表: $source, destroyOnClose=$destroyOnClose', ({ source, destroyOnClose }) => {
      vi.useFakeTimers();
      const onChange = vi.fn();
      const onInputChange = vi.fn();
      const Demo = () => {
        const [value, setValue] = useState('');
        return (
          <Select
            value={value}
            onChange={(next) => {
              onChange(next);
              setValue(String(next));
            }}
            onInputChange={onInputChange}
            filterable
            popupProps={{ destroyOnClose }}
            options={source === 'options' ? filterableOptions : undefined}
          >
            {source === 'children'
              ? filterableOptions.map((option) => <Select.Option key={option.value} {...option} />)
              : undefined}
          </Select>
        );
      };
      const { getByRole, getByText, unmount } = render(<Demo />);
      try {
        const input = getByRole('textbox');
        fireEvent.click(input);
        act(() => vi.advanceTimersByTime(200));
        fireEvent.change(input, { target: { value: '一' } });
        const popup = document.querySelector('.t-popup');
        expect(popup).toHaveTextContent('选项一');
        expect(popup).not.toHaveTextContent('选项二');

        fireEvent.click(getByText('选项一'));
        expect(input).toHaveValue('选项一');
        expect(onChange).toHaveBeenLastCalledWith('1');
        expect(onInputChange).toHaveBeenLastCalledWith('', expect.objectContaining({ trigger: 'blur' }));
        expect(popup).toHaveStyle({ display: 'block' });
        expect(popup).not.toHaveTextContent('选项二');
        expect(popup).not.toHaveTextContent('选项三');

        act(() => vi.advanceTimersByTime(100));
        expect(popup).toHaveStyle({ display: 'block' });
        expect(popup).not.toHaveTextContent('选项二');
        act(() => vi.advanceTimersByTime(100));
        if (destroyOnClose) expect(document.querySelector('.t-popup')).toBeNull();
        else expect(popup).toHaveStyle({ display: 'none' });

        fireEvent.click(input);
        const reopenedPopup = document.querySelector('.t-popup');
        expect(reopenedPopup).toHaveTextContent('选项一');
        expect(reopenedPopup).toHaveTextContent('选项二');
        expect(reopenedPopup).toHaveTextContent('选项三');
        expect(onChange).toHaveBeenCalledTimes(1);
      } finally {
        unmount();
        vi.useRealTimers();
      }
    });

    test('关闭动画期间重新打开时使用最新 options 并取消待关闭', () => {
      vi.useFakeTimers();
      const onChange = vi.fn();
      const { getByRole, getByText, rerender, unmount } = render(
        <Select filterable options={filterableOptions} onChange={onChange} />,
      );
      try {
        const input = getByRole('textbox');
        fireEvent.click(input);
        act(() => vi.advanceTimersByTime(200));
        fireEvent.change(input, { target: { value: '一' } });
        fireEvent.click(getByText('选项一'));
        const popup = document.querySelector('.t-popup');
        expect(popup).not.toHaveTextContent('选项二');

        rerender(
          <Select filterable options={[...filterableOptions, { label: '选项四', value: '4' }]} onChange={onChange} />,
        );
        expect(popup).not.toHaveTextContent('选项四');
        fireEvent.click(input);
        expect(input).toHaveValue('');
        expect(popup).toHaveTextContent('选项二');
        expect(popup).toHaveTextContent('选项四');
        act(() => vi.advanceTimersByTime(200));
        expect(popup).toHaveStyle({ display: 'block' });
        expect(onChange).toHaveBeenCalledTimes(1);
      } finally {
        unmount();
        vi.useRealTimers();
      }
    });

    test.each([false, true])('多选筛选后列表保持更新: reserveKeyword=%s', (reserveKeyword) => {
      const { getByRole, getByText } = render(
        <Select multiple filterable options={filterableOptions} reserveKeyword={reserveKeyword} />,
      );
      const input = getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: '一' } });
      fireEvent.click(getByText('选项一'));
      const popup = document.querySelector('.t-popup');
      expect(popup).toHaveStyle({ display: 'block' });
      if (reserveKeyword) {
        expect(input).toHaveValue('一');
        expect(popup).not.toHaveTextContent('选项二');
      } else {
        expect(input).toHaveValue('');
        expect(popup).toHaveTextContent('选项二');
      }
    });

    test('受控 popupVisible 保持打开时列表继续更新', () => {
      const onPopupVisibleChange = vi.fn();
      const { getByRole, getByText } = render(
        <Select filterable options={filterableOptions} popupVisible onPopupVisibleChange={onPopupVisibleChange} />,
      );
      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: '一' } });
      fireEvent.click(getByText('选项一'));
      expect(onPopupVisibleChange).toHaveBeenLastCalledWith(false, expect.anything());
      expect(document.querySelector('.t-popup')).toHaveStyle({
        display: 'block',
      });
      expect(document.querySelector('.t-popup')).toHaveTextContent('选项二');
      fireEvent.change(input, { target: { value: '三' } });
      expect(document.querySelector('.t-popup')).toHaveTextContent('选项三');
      expect(document.querySelector('.t-popup')).not.toHaveTextContent('选项二');
    });
  });
});
