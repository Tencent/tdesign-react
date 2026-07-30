import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

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
          0,
          '重庆',
          { label: '全选', checkAll: true },
        ]}
      ></Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.lastChild);
    expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
    const options = container.firstChild.childNodes;
    // 0 is rendered as string '0'
    expect(options.item(4).textContent).toBe('0');
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

describe('CheckboxGroup button theme', () => {
  test('theme button renders checkbox-button with options', () => {
    const { container } = render(
      <Checkbox.Group theme="button" defaultValue={['北京']} options={['北京', '上海']}></Checkbox.Group>,
    );
    const group = container.firstChild;
    expect(group).toHaveClass('t-checkbox-group', 't-size-m', 't-checkbox-group--filled');
    expect(group.firstChild).toHaveClass('t-checkbox-button', 't-is-checked');
    expect(group.querySelector('.t-checkbox-button .t-checkbox__former')).not.toBeNull();
    expect(group.querySelector('.t-checkbox-button .t-checkbox__label')).not.toBeNull();
  });

  test('theme button works with children', () => {
    const { container } = render(
      <Checkbox.Group theme="button" defaultValue={['gz']}>
        <Checkbox.Button value="gz">广州</Checkbox.Button>
        <Checkbox.Button value="sz">深圳</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild.firstChild).toHaveClass('t-checkbox-button', 't-is-checked');
  });

  test('theme button works with max and children', () => {
    const { container } = render(
      <Checkbox.Group theme="button" max={2} defaultValue={['sz']}>
        <Checkbox.Button value="gz">广州</Checkbox.Button>
        <Checkbox.Button value="sz">深圳</Checkbox.Button>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
      </Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.firstChild);
    expect(container.firstChild.lastChild).toHaveClass('t-is-disabled');
  });

  test('variant outline', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="outline" options={['北京', '上海']}></Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group__outline');
    expect(container.firstChild).not.toHaveClass('t-checkbox-group--filled');
  });

  test('variant primary-filled', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="primary-filled" options={['北京', '上海']}></Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group--filled', 't-checkbox-group--primary-filled');
  });

  test('size', () => {
    const { container } = render(
      <Checkbox.Group theme="button" size="small" options={['北京', '上海']}></Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-size-s');
  });

  test('direction vertical', () => {
    const { container } = render(
      <Checkbox.Group theme="button" direction="vertical" options={['北京', '上海']}></Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group--vertical');
  });

  test('button theme does not affect default checkbox theme', () => {
    const { container } = render(<Checkbox.Group options={['北京', '上海']}></Checkbox.Group>);
    expect(container.firstChild).toHaveClass('t-checkbox-group');
    expect(container.firstChild).not.toHaveClass('t-size-m');
    expect(container.firstChild).not.toHaveClass('t-checkbox-group--filled');
    expect(container.firstChild.firstChild).toHaveClass('t-checkbox');
  });

  test('button theme onChange', () => {
    const fn = vi.fn();
    const { container } = render(
      <Checkbox.Group theme="button" defaultValue={['北京']} options={['北京', '上海']} onChange={fn}></Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.lastChild);
    expect(fn).toBeCalledTimes(1);
  });
});
