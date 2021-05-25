import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import { Pagination } from '@tencent/tdesign-react';

testExamples(__dirname);

describe('Pagination test', () => {
  test('mount and unmount', () => {
    const wrapper = render(<Pagination />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  test('click page', () => {
    const wrapper = render(<Pagination total={300} pageSize={15} />);

    fireEvent.click(wrapper.getByText('20'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.click(document.querySelector('.t-pagination__btn--next'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.click(document.querySelector('.t-pagination__btn--prev'));
    expect(document.querySelector('.t-is-current')).toHaveTextContent('19');
  });

  test('jumper', () => {
    render(<Pagination total={300} pageSize={15} showJumper />);

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '5' } });
    fireEvent.keyUp(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('5');

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '30' } });
    fireEvent.keyUp(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

    fireEvent.change(document.querySelector('.t-pagination__jump .t-input__inner'), { target: { value: '-1' } });
    fireEvent.keyUp(document.querySelector('.t-pagination__jump .t-input__inner'), { keyCode: 13 });
    expect(document.querySelector('.t-is-current')).toHaveTextContent('1');
  });

  // test('select', () => {
  //   render(<Pagination showSizer total={600} pageSize={20} pageSizeOption={[20, 30, 100, 200]} />);
  //   expect(document.querySelector('.t-pagination__pager').lastElementChild).toHaveTextContent('30');

  //   fireEvent.change(document.querySelector('select'), { target: { value: 30 } });
  //   expect(document.querySelector('.t-pagination__pager').lastElementChild).toHaveTextContent('20');

  //   fireEvent.click(document.querySelector('.t-pagination__pager').lastElementChild);
  //   expect(document.querySelector('.t-is-current')).toHaveTextContent('20');

  //   fireEvent.change(document.querySelector('select'), { target: { value: 200 } });
  //   expect(document.querySelector('.t-pagination__pager').lastElementChild).toHaveTextContent('3');
  //   expect(document.querySelector('.t-is-current')).toHaveTextContent('3');
  // });
});
