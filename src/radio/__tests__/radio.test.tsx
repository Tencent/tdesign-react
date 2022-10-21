import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Radio from '../Radio';

describe('Radio', () => {
  test('checked & children', () => {
    const { container, queryByText } = render(<Radio checked={true}>单选框</Radio>);
    expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
    expect(queryByText('单选框')).toBeInTheDocument();
  });

  test('defaultChecked', () => {
    const { container } = render(<Radio defaultChecked={true}></Radio>);
    expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
  });

  test('allowUncheck', () => {
    const { container } = render(<Radio allowUncheck={true} checked={true} />);
    fireEvent.click(container.firstChild);
    expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
  });

  test('disable', () => {
    const fn = vi.fn();
    const { container } = render(<Radio disabled={true} onChange={fn}></Radio>);
    expect(container.firstChild).toHaveClass('t-is-disabled', 't-radio');
    fireEvent.click(container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });

  test('label', () => {
    const { queryByText } = render(<Radio label="选中项" />);
    expect(queryByText('选中项')).toBeInTheDocument();
  });

  test('onChange', () => {
    const fn = vi.fn();
    const { container } = render(<Radio disabled={true} onChange={fn} />);
    fireEvent.click(container.firstElementChild);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('RadioGroup', () => {
  test('value', () => {
    const { container } = render(
      <Radio.Group value="gz">
        <Radio value="gz">广州</Radio>
        <Radio value="sz" disabled>
          深圳
        </Radio>
      </Radio.Group>,
    );
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('onChange', () => {
    const fn = vi.fn();
    const { container } = render(
      <Radio.Group defaultValue="sz" onChange={fn}>
        <Radio value="gz">广州</Radio>
        <Radio value="sz" disabled>
          深圳
        </Radio>
      </Radio.Group>,
    );
    fireEvent.click(container.firstChild.firstChild);
    expect(fn).toBeCalledTimes(1);
  });

  test('options', () => {
    const { container } = render(
      <Radio.Group
        defaultValue="北京"
        options={[{ value: '上海', label: '上海' }, { value: '广州', label: '广州', disabled: true }, '北京', 1]}
      ></Radio.Group>,
    );
    fireEvent.click(container.firstChild.lastChild);
    expect(container.firstChild.lastChild).toHaveClass('t-is-checked');
  });

  test('value is string', () => {
    const { container } = render(<Radio.Group options={['北京', '广州']} value="北京"></Radio.Group>);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('value is number', () => {
    const { container } = render(<Radio.Group options={[1, 2]} value={1}></Radio.Group>);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('defaultValue', () => {
    const { container } = render(
      <Radio.Group defaultValue="gz">
        <Radio value="gz">广州</Radio>
        <Radio value="sz" disabled>
          深圳
        </Radio>
      </Radio.Group>,
    );
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });
});
