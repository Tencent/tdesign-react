import React from 'react';
import { act, fireEvent, mockDelay, render, vi } from '@test/utils';

import { SelectInput } from '..';

import type { TdSelectInputProps } from '../type';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: '4' },
  { label: 'tdesign-mobile-vue', value: '5' },
  { label: 'tdesign-mobile-react', value: '6' },
];

function Panel() {
  return (
    <ul className="t-select-input__panel">
      {OPTIONS.map((item) => (
        <li key={item.value}>
          <img src="https://tdesign.gtimg.com/demo/demo-image-1.png" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

const multipleValue = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-mobile-vue', value: 4 },
  { label: 'tdesign-react-vue', value: 5 },
];

function getSelectInputMultipleMount(props?: Partial<TdSelectInputProps>, events?: Record<string, any>) {
  return render(
    <SelectInput value={multipleValue} multiple={true} panel={<Panel />} {...props} {...events}></SelectInput>,
  );
}

describe('SelectInput', () => {
  describe('props', () => {
    test(`allowInput is equal to true`, () => {
      const { container } = render(<SelectInput allowInput={true}></SelectInput>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper.classList.contains('t-is-readonly')).toBeFalsy();
    });

    test('borderless', () => {
      // borderless default value is false
      const { container: container1 } = render(<SelectInput></SelectInput>);
      expect(container1.querySelector(`.${'t-select-input--borderless'}`)).toBeFalsy();
      // borderless = true
      const { container: container2 } = render(<SelectInput borderless={true}></SelectInput>);
      expect(container2.firstChild).toHaveClass('t-select-input--borderless');
      // borderless = false
      const { container: container3 } = render(<SelectInput borderless={false}></SelectInput>);
      expect(container3.querySelector(`.${'t-select-input--borderless'}`)).toBeFalsy();
    });

    test('clearable: empty value can not show clear icon', async () => {
      const { container } = render(<SelectInput clearable={true}></SelectInput>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeFalsy();
    });

    test('clearable: show clear icon on mouse enter in single select input', async () => {
      const { container } = render(<SelectInput value={'tdesign'} clearable={true} allowInput></SelectInput>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });

    test('clearable: show clear icon on mouse enter in multiple select input', async () => {
      const { container } = render(<SelectInput value={['tdesign']} multiple={true} clearable={true}></SelectInput>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-tag-input__suffix-clear')).toBeTruthy();
    });

    test('disabled', () => {
      // disabled default value is
      const wrapper1 = render(<SelectInput></SelectInput>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const wrapper2 = render(<SelectInput disabled={true}></SelectInput>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-disabled');
      // disabled = false
      const wrapper3 = render(<SelectInput disabled={false}></SelectInput>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
    });

    test('loading', () => {
      const { container } = render(<SelectInput loading={true}></SelectInput>);
      expect(container.querySelector('.t-loading')).toBeTruthy();
    });

    test('multiple', () => {
      // multiple default value is false
      const { container } = render(<SelectInput></SelectInput>);
      expect(container.querySelector('.t-tag-input')).toBeFalsy();
      // multiple = false
      const { container: container1 } = render(<SelectInput multiple={false}></SelectInput>);
      expect(container1.querySelector('.t-tag-input')).toBeFalsy();
      // multiple = true
      const { container: container2 } = render(<SelectInput multiple={true}></SelectInput>);
      expect(container2.querySelector('.t-tag-input')).toBeTruthy();
    });

    test('placeholder', () => {
      const wrapper = render(<SelectInput placeholder={'This is SelectInput placeholder'}></SelectInput>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('placeholder')).toBe('This is SelectInput placeholder');
    });

    const statusClassNameList = [{ 't-is-default': false }, 't-is-success', 't-is-warning', 't-is-error'];
    (['default', 'success', 'warning', 'error'] as TdSelectInputProps['status'][]).forEach((item, index) => {
      test(`status is equal to ${item}`, () => {
        const wrapper = render(<SelectInput status={item}></SelectInput>);
        const container = wrapper.container.querySelector('.t-input');
        if (typeof statusClassNameList[index] === 'string') {
          expect(container).toHaveClass(statusClassNameList[index]);
        } else if (typeof statusClassNameList[index] === 'object') {
          const classNameKey = Object.keys(statusClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    test('tips is equal this is a tip', () => {
      const { container } = render(<SelectInput tips="this is a tip"></SelectInput>);
      expect(container.querySelectorAll('.t-input__tips').length).toBe(1);
    });
  });

  describe('slots', () => {
    test('collapsedItems', () => {
      const { container } = getSelectInputMultipleMount({
        collapsedItems: <span className="custom-node">TNode</span>,
        minCollapsedNum: 3,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('collapsedItems is a function with params', () => {
      const fn = vi.fn();
      getSelectInputMultipleMount({ collapsedItems: fn, minCollapsedNum: 3 });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].count).toBe(2);
    });

    test('label', () => {
      const { container } = render(<SelectInput label={<span className="custom-node">TNode</span>}></SelectInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('panel', () => {
      const { container } = render(<SelectInput panel={<span className="custom-node">TNode</span>}></SelectInput>);
      fireEvent.click(container.querySelector('.t-input'));
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
    });

    test('suffix', () => {
      const { container } = render(<SelectInput suffix={<span className="custom-node">TNode</span>}></SelectInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffixIcon', () => {
      const { container } = render(<SelectInput suffixIcon={<span className="custom-node">TNode</span>}></SelectInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag', () => {
      const { container } = render(
        <SelectInput
          tag={<span className="custom-node">TNode</span>}
          multiple={true}
          value={['tdesign-vue']}
        ></SelectInput>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag is a function with params', () => {
      const fn = vi.fn();
      render(<SelectInput tag={fn} multiple={true} value={['tdesign-vue']}></SelectInput>);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].value).toBe('tdesign-vue');
    });

    test('label display', async () => {
      const text = 'test-label';
      const { getByText } = await render(<SelectInput label={text} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('prefixIcon display', async () => {
      const text = 'test-prefixIcon';
      const { getByText } = await render(<SelectInput prefixIcon={<span>{text}</span>} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });
  });

  describe('scenarios', () => {
    test('default select-input readonly', async () => {
      const { container } = await render(<SelectInput />);

      expect(container.querySelector('input')).toHaveAttribute('readonly');
    });
  });
});
