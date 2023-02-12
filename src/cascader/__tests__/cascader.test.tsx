import { render, fireEvent, mockTimeout, vi, userEvent, mockDelay } from '@test/utils';
import React, { useState } from 'react';
import Cascader, { CascaderPanel } from '../index';

const options = [
  {
    children: [
      {
        label: '子选项一',
        value: '1.1',
      },
      {
        label: '子选项二',
        value: '1.2',
      },
    ],
    label: '选项一',
    value: '1',
  },
  {
    children: [
      {
        label: '子选项一',
        value: '2.1',
      },
      {
        label: '子选项二',
        value: '2.2',
      },
    ],
    label: '选项二',
    value: '2',
  },
];
const popupSelector = '.t-popup';

// TODO
describe('Cascader 组件测试', () => {
  test('设置 checkStrictly 时每项应该可各自选中或取消', async () => {
    const btnText = 'change';
    const TestComponent = () => {
      const [strict, setStrict] = useState(false);
      return (
        <>
          <button onClick={() => setStrict(!strict)}>{btnText}</button>
          <Cascader options={options} checkStrictly={strict} />
        </>
      );
    };
    const { getByText } = render(<TestComponent />);
    // 默认值为 false
    fireEvent.click(document.querySelector('input'));
    fireEvent.click(getByText('选项一'));
    expect(getByText('子选项一')).toHaveTextContent('子选项一');
    fireEvent.click(getByText('子选项一'));
    expect(document.querySelector('.t-input__inner')).toHaveValue('选项一 / 子选项一');
    // 设置值为 true，可直接选择选项一
    await mockTimeout(() => fireEvent.click(getByText(btnText)));
    fireEvent.click(document.querySelector('input'));
    fireEvent.click(getByText('选项一'));
    expect(document.querySelector('.t-input__inner')).toHaveValue('选项一');
  });

  test('onBlur 测试，应该正确触发', async () => {
    const onBlur = vi.fn();
    const { container } = render(<Cascader options={options} onBlur={onBlur} filterable />);
    // 模拟 blur 时触发 onBlur
    fireEvent.click(container.querySelector('.t-input'));
    await mockDelay(100);
    fireEvent.mouseDown(document);
    expect(onBlur).toHaveBeenCalled();
  });

  test('selectInputProps.onInputChange 测试，应该正确触发', async () => {
    const selectInputProps = {
      onInputChange: () => 1,
    };
    const enterText = 'test';
    const spy = vi.spyOn(selectInputProps, 'onInputChange');
    render(<Cascader options={options} selectInputProps={selectInputProps} filterable />);
    // 模拟用户键盘输入 "test" ，一共会触发四次 onInputChange
    userEvent.type(document.querySelector('input'), enterText);
    await mockTimeout(() => expect(spy).toHaveBeenCalledTimes(enterText.length));
  });

  test('selectInputProps.onTagChange 测试，应该正确触发且页面展示正常', async () => {
    const selectInputProps = {
      onTagChange: () => 1,
      allowInput: true,
    };
    const TextComponent = (props) => {
      const [value, setValue] = useState(['1.1', '1.2']);
      const onChange = (val) => {
        setValue(val);
      };

      return (
        <Cascader
          options={options}
          value={value}
          onChange={onChange}
          selectInputProps={props.selectInputProps}
          multiple
        />
      );
    };

    const spy = vi.spyOn(selectInputProps, 'onTagChange');
    const { container } = render(<TextComponent selectInputProps={selectInputProps} />);
    const wrapper = container.querySelector('.t-input__prefix');
    // 初始时有两个 tag
    expect(wrapper.querySelectorAll('.t-tag').length).toBe(2);
    fireEvent.click(container.querySelector('.t-icon-close'));
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('.t-icon-close'));
    // 删除两次后清空全部 tag，触发两次 onTagChange
    expect(wrapper.querySelectorAll('.t-tag').length).toBe(0);
    expect(spy).toHaveBeenCalledTimes(2);
    // trigger 为 'enter' 时不执行，调用次数依然为 2
    const input = container.querySelector('input');
    await userEvent.type(input, 'abc{enter}');
    expect(input).toHaveValue('abc');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('selectInputProps.onClear 测试，应该正确触发且页面展示正常', () => {
    const selectInputProps = {
      onClear: () => 1,
    };
    const TextComponent = (props) => {
      const [value, setValue] = useState(['1.1', '1.2']);
      const onChange = (val) => {
        setValue(val);
      };

      return (
        <Cascader
          options={options}
          value={value}
          onChange={onChange}
          selectInputProps={props.selectInputProps}
          multiple
          clearable
        />
      );
    };
    const spy = vi.spyOn(selectInputProps, 'onClear');
    const { container } = render(<TextComponent selectInputProps={selectInputProps} />);
    const wrapper = container.querySelector('.t-input__prefix');
    fireEvent.mouseOver(wrapper);
    fireEvent.click(container.querySelector('.t-input__suffix').querySelector('.t-icon'));
    expect(wrapper.querySelectorAll('.t-tag').length).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  test('selectInputProps.onPopupVisibleChange 测试，应该正确触发', async () => {
    const selectInputProps = {
      onPopupVisibleChange: () => 1,
    };
    const placeholderId = 'placeholder-id';
    const btnText = 'change';
    const TextComponent = (props) => {
      const [disabled, setDisabled] = useState(false);
      const onClick = () => {
        setDisabled(!disabled);
      };
      return (
        <>
          <button onClick={onClick}>{btnText}</button>
          <Cascader
            options={options}
            selectInputProps={props.selectInputProps}
            disabled={disabled}
            placeholder={placeholderId}
          />
        </>
      );
    };
    const spy = vi.spyOn(selectInputProps, 'onPopupVisibleChange');
    const { getByPlaceholderText, getByText } = render(<TextComponent selectInputProps={selectInputProps} />);
    // 展开收起一共触发 onPopupVisibleChange 2次
    fireEvent.click(getByPlaceholderText(placeholderId));
    expect(spy).toHaveBeenCalled();
    fireEvent.click(getByPlaceholderText(placeholderId));
    expect(spy).toHaveBeenCalledTimes(2);
    await mockTimeout(() => expect(document.querySelector(popupSelector)).toHaveStyle({ display: 'none' }));

    // disabled 不会展开 popup，且不执行 onPopupVisibleChange
    fireEvent.click(getByText(btnText));
    fireEvent.click(getByPlaceholderText(placeholderId));
    expect(document.querySelector(popupSelector)).toHaveStyle({ display: 'none' });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('filterable 测试', async () => {
    const placeholder = 'filter';
    const filterContent = '子选项一';
    const { getByPlaceholderText, getByText } = render(
      <Cascader placeholder={placeholder} options={options} filterable />,
    );
    // 搜索 子选项一 ，共有两个结果，成功匹配的内容应该高亮
    fireEvent.focus(getByPlaceholderText(placeholder));
    userEvent.type(getByPlaceholderText(placeholder), filterContent);
    await mockTimeout(() =>
      expect(document.querySelector(popupSelector).querySelectorAll('.t-cascader__item-label--filter').length).toBe(2),
    );
    // 清空搜索项，无匹配任何高亮内容
    userEvent.type(getByPlaceholderText(placeholder), '{backspace}{backspace}{backspace}{backspace}');
    await mockTimeout(() =>
      expect(document.querySelector(popupSelector).querySelectorAll('.t-cascader__item-label--filter').length).toBe(0),
    );
    // 匹配不到任何内容
    userEvent.type(getByPlaceholderText(placeholder), 'null');
    await mockTimeout(() => expect(getByText('暂无数据')).toBeInTheDocument());
  });

  test('value is zero should be selected', async () => {
    const popupSelector = '.t-popup';
    const labelText = 'my value is 0 that typeof number';
    const TestComponent = () => {
      const [value, setValue] = useState('');
      const options = [
        {
          value: 0,
          label: labelText,
        },
      ];
      const onChange = (value) => {
        setValue(value);
      };

      return <Cascader options={options} value={value} onChange={onChange} checkStrictly />;
    };
    const { getByText } = render(<TestComponent />);
    fireEvent.click(document.querySelector('input'));
    expect(document.querySelector(popupSelector)).toHaveTextContent(labelText);
    await mockTimeout(() => fireEvent.click(getByText(labelText)));
    expect(document.querySelector('.t-input__inner')).toHaveValue(labelText);
  });
});

describe('Cascader Panel 组件测试', () => {
  test('CascaderPanel 基础测试', () => {
    const btnText = 'change';
    const TestComponent = () => {
      const [value, setValue] = useState();
      const [multiple, setMultiple] = useState(false);
      const onChange = (value) => {
        setValue(value);
      };
      const onClick = () => {
        setMultiple(!multiple);
      };
      return (
        <>
          <button onClick={onClick}>{btnText}</button>
          <CascaderPanel options={options} value={value} onChange={onChange} multiple={multiple} />
        </>
      );
    };

    const { container, getByText } = render(<TestComponent />);
    expect(getByText('选项一')).toBeInTheDocument();
    expect(container.querySelectorAll('.t-cascader__menu').length).toBe(1);
    // 首次展开子选项会插入新的 ul
    fireEvent.click(getByText('选项一'));
    expect(getByText('子选项一')).toBeInTheDocument();
    expect(container.querySelectorAll('.t-cascader__menu').length).toBe(2);
    // multiple 测试，存在 checkbox
    expect(container.querySelector('input')).toBeNull();
    fireEvent.click(getByText(btnText));
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  test('Panel组件 trigger 为 hover 时，应该正确展开下一层级', () => {
    const { container, getByText } = render(<CascaderPanel options={options} trigger="hover" />);
    expect(container.querySelectorAll('.t-cascader__menu').length).toBe(1);
    fireEvent.mouseEnter(getByText('选项一'));
    expect(getByText('子选项一')).toBeInTheDocument();
    expect(container.querySelectorAll('.t-cascader__menu').length).toBe(2);
  });

  test('Panel组件 multiple 测试', () => {
    const { getByText, getByTitle } = render(<CascaderPanel options={options} multiple />);
    fireEvent.click(getByText('选项一'));
    expect(getByTitle('子选项一')).not.toHaveClass('t-is-checked');
    // 选中一个子选项，父级应为 indeterminate 状态
    fireEvent.click(getByText('子选项一'));
    expect(getByTitle('选项一')).toHaveClass('t-is-indeterminate');
    expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
    // 选中全部子选项，父级应该为 checked 状态
    fireEvent.click(getByText('子选项二'));
    expect(getByTitle('选项一')).toHaveClass('t-is-checked');
    expect(getByTitle('子选项二')).toHaveClass('t-is-checked');
  });

  test('Panel组件 multiple 时设置 max 测试', async () => {
    const btnText = 'set max 1';
    const TestComponent = () => {
      const [max, setMax] = useState(3);
      return (
        <>
          <button onClick={() => setMax(1)}>{btnText}</button>
          <CascaderPanel options={options} multiple max={max} />
        </>
      );
    };
    const { getByText, getByTitle } = render(<TestComponent />);
    // 所选内容不超过 max ，都可选中
    fireEvent.click(getByTitle('选项一').querySelector('input'));
    expect(getByTitle('选项一')).toHaveClass('t-is-checked');
    expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
    expect(getByTitle('子选项二')).toHaveClass('t-is-checked');
    // 清空所有选中
    fireEvent.click(getByTitle('选项一').querySelector('input'));
    // 设置 max 为 1，点击父级无法选中任何节点
    fireEvent.click(getByText(btnText));
    fireEvent.click(getByTitle('选项一'));
    fireEvent.click(getByTitle('选项一').querySelector('input'));
    expect(getByTitle('选项一')).not.toHaveClass('t-is-checked');
    expect(getByTitle('子选项一')).not.toHaveClass('t-is-checked');
    // 选中一个子节点后所有节点为 disabled
    fireEvent.click(getByTitle('子选项一'));
    expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
    expect(getByTitle('选项二')).toHaveClass('t-is-disabled');
  });
});
