import React from 'react';
import { act, fireEvent, mockDelay, render, simulateInputChange, simulateKeydownEvent, vi } from '@test/utils';

import { AutoComplete } from '..';

import type { TNode } from '../../common';
import type { AutoCompleteOption, TdAutoCompleteProps } from '../type';

type AutoCompleteEventHandlers = Pick<
  TdAutoCompleteProps,
  'onBlur' | 'onChange' | 'onClear' | 'onCompositionend' | 'onCompositionstart' | 'onEnter' | 'onFocus' | 'onSelect'
>;

function getNormalAutoCompleteMount(
  props: Partial<TdAutoCompleteProps> = {},
  events: Partial<AutoCompleteEventHandlers> = {},
) {
  const options: AutoCompleteOption[] = [
    'FirstKeyword',
    {
      // 自定义选项
      label: (() => <div className="custom-node">TNode SecondKeyword</div>) as unknown as TNode,
      // 用于搜索的纯文本
      text: 'SecondKeyword',
    },
    'ThirdKeyword',
    {
      label: 'READONLY_KEYWORD',
    },
    {
      text: 'DISABLED_KEYWORD',
    },
  ];
  return render(<AutoComplete value="" options={options} {...props} {...events} />);
}

function getOptionSlotAutoCompleteMount(
  props: Partial<TdAutoCompleteProps> = {},
  events: Partial<AutoCompleteEventHandlers> = {},
) {
  const options: AutoCompleteOption[] = [
    'First',
    {
      label: <div className="custom-slot-option">First Keyword</div>,
      text: 'First Keyword',
    },
  ];
  return render(<AutoComplete value="" options={options} {...props} {...events} />);
}

describe('AutoComplete', () => {
  describe('props', () => {
    test('autofocus', () => {
      const { container: falseContainer } = render(<AutoComplete autofocus={false}></AutoComplete>);
      expect(falseContainer.querySelector('input').getAttribute('autofocus')).toBeNull();

      const { container: trueContainer } = render(<AutoComplete autofocus={true}></AutoComplete>);
      expect(trueContainer.querySelector('input').getAttribute('autofocus')).toBeDefined();
    });

    test('clearable', async () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'Default Keyword',
        clearable: true,
      });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });

    test('disabled', () => {
      // disabled default value is
      const wrapper1 = render(<AutoComplete></AutoComplete>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const wrapper2 = render(<AutoComplete disabled={true}></AutoComplete>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-disabled');
      // disabled = false
      const wrapper3 = render(<AutoComplete disabled={false}></AutoComplete>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
    });

    test('filter', () => {
      const { container } = getNormalAutoCompleteMount({
        filter: (_filterWords, option) =>
          typeof option === 'string' ? option.includes('Second') : Boolean(option.text?.includes('Second')),
      });
      fireEvent.focus(container.querySelector('input'));
      const tSelectOptionDom = document.querySelectorAll('.t-select-option');
      expect(tSelectOptionDom.length).toBe(1);
    });

    test('filterable', () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'First',
        filterable: true,
      });
      fireEvent.focus(container.querySelector('input'));
      const tSelectOptionDom = document.querySelectorAll('.t-select-option');
      expect(tSelectOptionDom.length).toBe(1);
    });

    test('highlightKeyword', () => {
      const { container: trueContainer, unmount: unmountTrue } = getNormalAutoCompleteMount({
        value: 'First',
        highlightKeyword: true,
      });
      fireEvent.focus(trueContainer.querySelector('input'));
      expect(document.querySelectorAll('.t-select-option')).toHaveLength(1);
      expect(document.querySelector('.t-select-option .t-is-highlight')).toHaveTextContent('First');
      unmountTrue();

      const { container: falseContainer } = getNormalAutoCompleteMount({
        value: 'First',
        highlightKeyword: false,
        filterable: true,
      });
      fireEvent.focus(falseContainer.querySelector('input'));
      expect(document.querySelector('.t-is-highlight')).toBeFalsy();
    });

    test('filterable[false]', () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'zzz-no-match',
        filterable: false,
      });
      fireEvent.focus(container.querySelector('input'));
      expect(document.querySelectorAll('.t-select-option')).toHaveLength(5);
    });

    test('empty[TNode]', () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'no-match-keyword',
        filterable: true,
        empty: <span className="empty-custom">empty list</span>,
      });
      fireEvent.focus(container.querySelector('input'));
      expect(document.querySelector('.t-auto-complete__panel--empty .empty-custom')).toHaveTextContent('empty list');
    });

    test('empty', () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'no-match-keyword',
        filterable: true,
      });
      fireEvent.focus(container.querySelector('input'));
      expect(document.querySelector('.t-auto-complete__panel--empty')).toBeTruthy();
    });

    test('options use label when text is omitted', () => {
      const { container } = render(
        <AutoComplete
          value=""
          options={[{ label: 'LabelOnlyKeyword' }]}
          filterable={false}
          popupProps={{ overlayClassName: 'label-only-options' }}
        />,
      );
      fireEvent.focus(container.querySelector('input'));
      expect(document.querySelector('.label-only-options .t-select-option')).toHaveAttribute(
        'title',
        'LabelOnlyKeyword',
      );
    });

    test('options use text when label is omitted', () => {
      const { container } = render(
        <AutoComplete value="" options={[{ text: 'TextOnlyKeyword' }]} filterable={false} />,
      );
      fireEvent.focus(container.querySelector('input'));
      expect(document.querySelector('.t-select-option[title="TextOnlyKeyword"]')).toBeTruthy();
    });

    test('readonly', () => {
      const { container } = getNormalAutoCompleteMount({ readonly: true });
      expect(container.querySelector('.t-input')).toHaveClass('t-is-readonly');
    });

    test('borderless', () => {
      const { container } = render(<AutoComplete borderless={true} />);
      expect(container.querySelector('.t-input')).toHaveClass('t-input--borderless');
    });

    test('inputProps', () => {
      const { container } = render(<AutoComplete inputProps={{ size: 'small' }} />);
      expect(container.querySelector('.t-input')).toHaveClass('t-size-s');
    });

    test('options', () => {
      const { container: defaultContainer } = getNormalAutoCompleteMount();
      fireEvent.focus(defaultContainer.querySelector('input'));
      expect(document.querySelector('.custom-node')).toBeTruthy();
      expect(document.querySelectorAll('.t-select-option').length).toBe(5);

      const { container: emptyContainer } = render(
        <AutoComplete popupProps={{ overlayClassName: 'empty-options-class-name' }}></AutoComplete>,
      );
      fireEvent.focus(emptyContainer.querySelector('input'));
      expect(document.querySelectorAll('.empty-options-class-name .t-autocomplete__panel').length).toBe(0);

      const { container: slotContainer } = getOptionSlotAutoCompleteMount({
        popupProps: { overlayClassName: 'option-slot-class-name' },
      });
      fireEvent.focus(slotContainer.querySelector('input'));
      expect(document.querySelector('.option-slot-class-name .custom-slot-option').textContent).toBe('First Keyword');
    });

    test('placeholder', () => {
      const { container } = render(<AutoComplete placeholder="type keyword to search"></AutoComplete>);
      expect(container.querySelector('input').getAttribute('placeholder')).toBe('type keyword to search');
    });

    test('popupProps', () => {
      const { container: innerStyleContainer } = getNormalAutoCompleteMount({
        popupProps: { overlayInnerStyle: { maxHeight: 280 } },
      });
      fireEvent.focus(innerStyleContainer.querySelector('input'));
      expect(document.querySelector('.t-popup')).toBeTruthy();

      const { container: overlayClassContainer } = getNormalAutoCompleteMount({
        popupProps: { overlayClassName: 'custom-class-name' },
      });
      fireEvent.focus(overlayClassContainer.querySelector('input'));
      expect(document.querySelector('.custom-class-name')).toBeTruthy();

      const { container: innerClassContainer } = getNormalAutoCompleteMount({
        popupProps: { overlayInnerClassName: 'custom-inner-class-name' },
      });
      fireEvent.focus(innerClassContainer.querySelector('input'));
      expect(document.querySelector('.custom-inner-class-name')).toBeTruthy();
    });

    test('readOnly', () => {
      // readonly default value is
      const wrapper1 = getNormalAutoCompleteMount();
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
      // readonly = true
      const wrapper2 = getNormalAutoCompleteMount({ readOnly: true });
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-readonly');
      // readonly = false
      const wrapper3 = getNormalAutoCompleteMount({ readOnly: false });
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as const).forEach((item, index) => {
      test(`size[${item}]`, () => {
        const wrapper = getNormalAutoCompleteMount({ size: item });
        const container = wrapper.container.querySelector('.t-input');
        if (typeof sizeClassNameList[index] === 'string') {
          expect(container).toHaveClass(sizeClassNameList[index]);
        } else if (typeof sizeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(sizeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    const statusClassNameList = [{ 't-is-default': false }, 't-is-success', 't-is-warning', 't-is-error'];
    (['default', 'success', 'warning', 'error'] as const).forEach((item, index) => {
      test(`status[${item}]`, () => {
        const wrapper = getNormalAutoCompleteMount({ status: item });
        const container = wrapper.container.querySelector('.t-input');
        if (typeof statusClassNameList[index] === 'string') {
          expect(container).toHaveClass(statusClassNameList[index]);
        } else if (typeof statusClassNameList[index] === 'object') {
          const classNameKey = Object.keys(statusClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    test('tips[string]', () => {
      const { container } = render(<AutoComplete tips="this is a tip"></AutoComplete>);
      expect(container.querySelector('.t-input__tips')).toBeTruthy();
    });

    test('value[string]', () => {
      const { container } = render(<AutoComplete value="DefaultKeyword"></AutoComplete>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.value).toBe('DefaultKeyword');
    });

    test('children', () => {
      const { container } = render(
        <AutoComplete>
          <span className="custom-node">TNode</span>
        </AutoComplete>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('panelBottomContent', () => {
      const { container } = render(
        <AutoComplete panelBottomContent={<span className="custom-node">TNode</span>}></AutoComplete>,
      );
      fireEvent.focus(container.querySelector('input'));
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      const tPopupDom = document.querySelector('.t-popup');
      expect(tPopupDom).toBeTruthy();
    });

    test('panelTopContent', () => {
      const { container } = render(
        <AutoComplete panelTopContent={<span className="custom-node">TNode</span>}></AutoComplete>,
      );
      fireEvent.focus(container.querySelector('input'));
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
      const tPopupDom = document.querySelector('.t-popup');
      expect(tPopupDom).toBeTruthy();
    });

    test('triggerElement', () => {
      const { container } = render(
        <AutoComplete triggerElement={<span className="custom-node">TNode</span>}></AutoComplete>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const onChangeFn = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onChange: onChangeFn });
      fireEvent.focus(container.querySelector('input'));
      simulateInputChange(container.querySelector('input'), 'typed');
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls.at(-1)?.[0]).toBe('typed');
    });

    test('onClear', async () => {
      const onClearFn = vi.fn();
      const onChangeFn = vi.fn();
      const { container } = getNormalAutoCompleteMount(
        { value: 'Default Keyword', clearable: true },
        { onClear: onClearFn, onChange: onChangeFn },
      );
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect(onClearFn).toHaveBeenCalledTimes(1);
      expect(onClearFn.mock.calls[0][0].e.stopPropagation).toBeTruthy();
      expect(onClearFn.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn).toHaveBeenCalledTimes(1);
      expect(onChangeFn.mock.calls[0][0]).toBe('');
      expect(onChangeFn.mock.calls[0][1].e.stopPropagation).toBeTruthy();
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
    });

    test('onFocus and onBlur', async () => {
      const onFocusFn = vi.fn();
      const onBlurFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onFocus: onFocusFn, onBlur: onBlurFn1 });
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalledTimes(1);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
      fireEvent.blur(container.querySelector('input'));
      await mockDelay(300);
      expect(onBlurFn1).toHaveBeenCalledTimes(1);
      expect(onBlurFn1.mock.calls[0][0].e.type).toBe('blur');
    });

    test('onCompositionend', () => {
      const onCompositionendFn = vi.fn();
      const { container } = render(<AutoComplete onCompositionend={onCompositionendFn}></AutoComplete>);
      fireEvent.compositionEnd(container.querySelector('input'));
      expect(onCompositionendFn).toHaveBeenCalledTimes(1);
      expect(onCompositionendFn.mock.calls[0][0].e.type).toBe('compositionend');
    });

    test('onCompositionstart', () => {
      const onCompositionstartFn = vi.fn();
      const { container } = render(<AutoComplete onCompositionstart={onCompositionstartFn}></AutoComplete>);
      fireEvent.compositionStart(container.querySelector('input'));
      expect(onCompositionstartFn).toHaveBeenCalledTimes(1);
      expect(onCompositionstartFn.mock.calls[0][0].e.type).toBe('compositionstart');
    });

    test('onEnter', () => {
      const onEnterFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onEnter: onEnterFn1 });
      fireEvent.focus(container.querySelector('input'));
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(onEnterFn1).toHaveBeenCalledTimes(1);
      expect(onEnterFn1.mock.calls[0][0].e.type).toBe('keydown');
      expect(/Enter/i.test(onEnterFn1.mock.calls[0][0].e.key)).toBeTruthy();
    });

    test('onFocus', () => {
      const onFocusFn = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onFocus: onFocusFn });
      fireEvent.focus(container.querySelector('input'));
      expect(container.querySelector('.t-is-focused')).toBeTruthy();
      expect(onFocusFn).toHaveBeenCalledTimes(1);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
    });

    describe('onSelect', () => {
      test('click', () => {
        const onSelectFn1 = vi.fn();
        const { container } = getNormalAutoCompleteMount(
          { popupProps: { overlayClassName: 'select-event-class-name' } },
          { onSelect: onSelectFn1 },
        );
        fireEvent.focus(container.querySelector('input'));
        fireEvent.click(document.querySelector('.select-event-class-name .t-select-option'));
        expect(onSelectFn1).toHaveBeenCalledTimes(1);
        expect(onSelectFn1.mock.calls[0][0]).toBe('FirstKeyword');
        expect(onSelectFn1.mock.calls[0][1].e.type).toBe('click');
      });

      test('keyboard', async () => {
        const onSelectFn6 = vi.fn();
        const { container } = getNormalAutoCompleteMount({}, { onSelect: onSelectFn6 });
        fireEvent.focus(container.querySelector('input'));
        await mockDelay();
        act(() => {
          simulateKeydownEvent(document, 'ArrowDown');
        });
        expect(document.querySelector('.t-select-option:first-child')).toHaveClass('t-select-option--hover');
        act(() => {
          simulateKeydownEvent(document, 'ArrowDown');
        });
        expect(document.querySelector('.t-select-option:nth-child(2)')).toHaveClass('t-select-option--hover');
        act(() => {
          simulateKeydownEvent(document, 'ArrowUp');
        });
        expect(document.querySelector('.t-select-option:first-child')).toHaveClass('t-select-option--hover');
        act(() => {
          simulateKeydownEvent(document, 'ArrowUp');
        });
        expect(document.querySelector('.t-select-option:nth-child(5)')).toHaveClass('t-select-option--hover');
        act(() => {
          simulateKeydownEvent(document, 'ArrowDown');
        });
        expect(document.querySelector('.t-select-option:first-child')).toHaveClass('t-select-option--hover');
        act(() => {
          simulateKeydownEvent(document, 'Enter');
        });
        expect(onSelectFn6).toHaveBeenCalledTimes(1);
        expect(onSelectFn6.mock.calls[0][0]).toBe('FirstKeyword');
        expect(onSelectFn6.mock.calls[0][1].e.type).toBe('keydown');
      });
    });
  });
});
