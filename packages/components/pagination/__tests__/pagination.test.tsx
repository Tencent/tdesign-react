import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Pagination from '../index';

describe('Pagination test', () => {
  test('mount and unmount', () => {
    const wrapper = render(<Pagination />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  test('click page works fine', () => {
    const wrapper = render(<Pagination total={300} pageSize={15} />);

    fireEvent.click(wrapper.getByText('20'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.click(document.querySelector('.t-pagination__btn-next'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.click(document.querySelector('.t-pagination__btn-prev'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('19');
  });

  test('pageSize works fine', async () => {
    const changeFn = vi.fn();
    const pageSizeChangeFn = vi.fn();
    const { getByText, container, getByDisplayValue } = render(
      <Pagination total={100} defaultPageSize={5} onChange={changeFn} onPageSizeChange={pageSizeChangeFn} />,
    );
    const pager = container.querySelector('.t-pagination__pager');
    expect(pager.childNodes.length).toBe(7);

    fireEvent.click(getByDisplayValue('5 条/页'));
    fireEvent.click(getByText('10 条/页'));
    expect(pager.childNodes.length).toBe(10);

    fireEvent.click(getByText('10'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('10');

    fireEvent.click(getByDisplayValue('10 条/页'));
    fireEvent.click(getByText('20 条/页'));
    expect(container.querySelector('.t-pagination__pager').childNodes.length).toBe(5);
    expect(document.querySelector('.t-is-current')).toHaveTextContent('5');
  });
  test('folded works fine', () => {
    const changeFn = vi.fn();
    const pageSizeChangeFn = vi.fn();
    const { getByText, container } = render(
      <Pagination total={100} defaultPageSize={5} onChange={changeFn} onPageSizeChange={pageSizeChangeFn} />,
    );
    expect(container.querySelector('.t-icon-ellipsis')).toBeInTheDocument();

    fireEvent.click(getByText('2'));
    expect(changeFn.mock.calls[0][0]).toEqual({
      current: 2,
      previous: 1,
      pageSize: 5,
    });
    fireEvent.mouseOver(container.querySelector('.t-pagination__number--more'));
    expect(container.querySelector('.t-icon-chevron-right-double')).toBeInTheDocument();
    fireEvent.mouseOut(container.querySelector('.t-pagination__number--more'));
    expect(container.querySelector('.t-icon-chevron-right-double')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector('.t-pagination__number--more'));
    expect(changeFn.mock.calls[1][0]).toEqual({
      current: 7,
      previous: 2,
      pageSize: 5,
    });
    fireEvent.mouseOver(container.querySelector('.t-pagination__number--more'));
    expect(container.querySelector('.t-icon-chevron-left-double')).toBeInTheDocument();
    fireEvent.mouseOut(container.querySelector('.t-pagination__number--more'));
    expect(container.querySelector('.t-icon-chevron-left-double')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector('.t-pagination__number--more'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('2');
  });
  test('theme works fine', () => {
    const changeFn = vi.fn();
    render(<Pagination total={100} defaultPageSize={5} theme="simple" onChange={changeFn} />);

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '5' } });
    fireEvent.keyDown(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-pagination__jump .t-input__inner').value).toEqual('5');
  });
  test('totalContent works fine', () => {
    const changeFn = vi.fn();
    const { getByText, rerender } = render(
      <Pagination total={100} defaultPageSize={5} totalContent="总条数" onChange={changeFn} />,
    );

    expect(getByText('总条数')).toBeInTheDocument();

    const totalContentFn = vi.fn();
    rerender(<Pagination total={100} defaultPageSize={5} totalContent={totalContentFn} onChange={changeFn} />);
    expect(totalContentFn).toBeCalled();
  });
  test('jumper works fine', () => {
    render(<Pagination total={300} pageSize={15} showJumper />);

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '5' } });
    fireEvent.keyDown(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('5');

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '30' } });
    fireEvent.keyDown(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '-1' } });
    fireEvent.keyDown(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('1');
  });
  test('jump input number return integral part', () => {
    // 测试输入小数会自动处理整数
    const changeFn = vi.fn();
    render(<Pagination total={100} defaultPageSize={20} theme="simple" onChange={changeFn} />);

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '5.555' } });
    fireEvent.keyDown(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-pagination__jump .t-input__inner').value).toEqual('5');
  });
});
