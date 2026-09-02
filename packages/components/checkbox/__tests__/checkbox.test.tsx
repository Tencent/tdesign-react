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
    expect(fn).toHaveBeenCalledTimes(0);
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
    expect(fn).toHaveBeenCalledTimes(0);
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
    expect(fn).toHaveBeenCalledTimes(1);
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

describe('Checkbox.Button', () => {
  test('button style', () => {
    const { container, queryByText } = render(<Checkbox.Button checked={true}>选中按钮</Checkbox.Button>);
    expect(container.firstChild).toHaveClass('t-checkbox-button', 't-is-checked');
    expect(queryByText('选中按钮')).toBeInTheDocument();
  });

  test('button disabled', () => {
    const fn = vi.fn();
    const { container } = render(<Checkbox.Button disabled={true} onChange={fn}></Checkbox.Button>);
    expect(container.firstChild).toHaveClass('t-is-disabled');
    fireEvent.click(container.firstChild);
    expect(fn).toBeCalledTimes(0);
  });
});

describe('CheckboxGroup button style', () => {
  test('theme=button with children', () => {
    const { container } = render(
      <Checkbox.Group theme="button" value={['bj']}>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
        <Checkbox.Button value="gz">广州</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group');
    expect(container.firstChild.firstChild).toHaveClass('t-checkbox-button', 't-is-checked');
  });

  test('variant outline', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="outline" value={['bj']}>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group__outline');
  });

  test('variant default-filled', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="default-filled" value={['bj']}>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group--filled', 't-checkbox-group--default-filled');
  });

  test('variant primary-filled', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="primary-filled" value={['bj']}>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group--primary-filled');
  });

  test('direction vertical', () => {
    const { container } = render(
      <Checkbox.Group theme="button" direction="vertical">
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group--vertical');
  });

  test('size small', () => {
    const { container } = render(
      <Checkbox.Group theme="button" size="small">
        <Checkbox.Button value="bj">北京</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-size-s');
  });

  test('size large', () => {
    const { container } = render(
      <Checkbox.Group theme="button" size="large">
        <Checkbox.Button value="bj">北京</Checkbox.Button>
      </Checkbox.Group>,
    );
    expect(container.firstChild).toHaveClass('t-size-l');
  });

  test('theme=button with options', () => {
    const { container } = render(
      <Checkbox.Group theme="button" variant="primary-filled" value={['北京']} options={['北京', '上海', '广州']} />,
    );
    expect(container.firstChild).toHaveClass('t-checkbox-group', 't-checkbox-group--primary-filled');
    expect(container.firstChild.firstChild).toHaveClass('t-checkbox-button', 't-is-checked');
  });

  test('button onChange', () => {
    const fn = vi.fn();
    const { container } = render(
      <Checkbox.Group theme="button" value={['bj']} onChange={fn}>
        <Checkbox.Button value="bj">北京</Checkbox.Button>
        <Checkbox.Button value="sh">上海</Checkbox.Button>
      </Checkbox.Group>,
    );
    fireEvent.click(container.firstChild.childNodes[1]);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(['bj', 'sh'], expect.any(Object));
  });
});
