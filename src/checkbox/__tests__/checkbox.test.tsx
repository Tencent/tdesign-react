import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  test('checked & children', () => {
    const { container, queryByText } = render(<Checkbox checked={true}>选中项</Checkbox>);
    expect(container.firstChild).toHaveClass('t-checkbox', 't-is-checked');
    expect(queryByText('选中项')).toBeInTheDocument();
  });

  test('defaultChecked', () => {
    const { container } = render(<Checkbox defaultChecked={true}></Checkbox>);
    expect(container.firstChild).toHaveClass('t-checkbox', 't-is-checked');
  });

  test('disabled', () => {
    const fn = vi.fn();
    const { container } = render(<Checkbox disabled={true} onChange={fn}></Checkbox>);
    expect(container.firstChild).toHaveClass('t-is-disabled');
    fireEvent.click(container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });

  test('indeterminate', () => {
    const { container } = render(<Checkbox indeterminate={true}></Checkbox>);
    expect(container.firstChild).toHaveClass('t-is-indeterminate');
  });

  test('label', () => {
    const { queryByText } = render(<Checkbox label="选中项"></Checkbox>);
    expect(queryByText('选中项')).toBeInTheDocument();
  });

  test('onChange', () => {
    const fn = vi.fn();
    const { container } = render(<Checkbox disabled={true} onChange={fn}></Checkbox>);
    fireEvent.click(container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('CheckboxGroup', () => {
  test('value', () => {
    const { container } = render(
      <Checkbox.Group value={['gz']}>
        <Checkbox value="gz">广州</Checkbox>
        <Checkbox value="sz" disabled>
          深圳
        </Checkbox>
      </Checkbox.Group>,
    );
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('onChange', () => {
    const fn = vi.fn();
    const { container } = render(
      <Checkbox.Group value={['gz']} onChange={fn}>
        <Checkbox value="gz">广州</Checkbox>
        <Checkbox value="sz" disabled>
          深圳
        </Checkbox>
      </Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.firstChild);
    expect(fn).toBeCalledTimes(1);
  });

  test('option', () => {
    const { container } = render(
      <Checkbox.Group
        defaultValue={['北京']}
        options={[
          { value: '上海', label: '上海' },
          { value: '广州', label: '广州', disabled: true },
          { value: '北京', label: '北京', name: '北京' },
          1,
          '重庆',
          { label: '全选', checkAll: true },
        ]}
      ></Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.lastChild);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('value is string', () => {
    const { container } = render(<Checkbox.Group options={['北京', '广州']} value={['北京']}></Checkbox.Group>);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('value is number', () => {
    const { container } = render(<Checkbox.Group options={[1, 2]} value={[1]}></Checkbox.Group>);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('defaultValue', () => {
    const { container } = render(
      <Checkbox.Group defaultValue={['gz']}>
        <Checkbox value="gz">广州</Checkbox>
        <Checkbox value="sz" disabled>
          深圳
        </Checkbox>
      </Checkbox.Group>,
    );
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
  });

  test('max', () => {
    const { container } = render(
      <Checkbox.Group max={2} defaultValue={['sz']}>
        <Checkbox value="gz">广州</Checkbox>
        <Checkbox value="sz">深圳</Checkbox>
        <Checkbox value="bj">北京</Checkbox>
      </Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.firstChild);
    expect(container.firstChild.lastChild).toHaveClass('t-is-disabled');
  });
});
