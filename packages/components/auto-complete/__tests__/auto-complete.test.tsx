import React from 'react';
import { fireEvent, mockDelay, render, simulateKeydownEvent, vi } from '@test/utils';

import { AutoComplete } from '..';

function getNormalAutoCompleteMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  const options = [
    'FirstKeyword',
    {
      // 自定义选项
      label: () => <div className="custom-node">TNode SecondKeyword</div>,
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

function getOptionSlotAutoCompleteMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  const options = [
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
    test(`autofocus is equal to false`, () => {
      const { container } = render(<AutoComplete autofocus={false}></AutoComplete>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('autofocus')).toBeNull();
    });
    test(`autofocus is equal to true`, () => {
      const { container } = render(<AutoComplete autofocus={true}></AutoComplete>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('autofocus')).toBeDefined();
    });

    test('clearable: show clear icon on mouse enter', async () => {
      const { container } = getNormalAutoCompleteMount({
        value: 'Default Keyword',
        clearable: true,
      });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });
    test('clearable: expect trigger clear and change events after clear icon has been clicked', async () => {
      const onClearFn1 = vi.fn();
      const onChangeFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount(
        { value: 'Default Keyword', clearable: true },
        { onClear: onClearFn1, onChange: onChangeFn1 },
      );
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect(onClearFn1).toHaveBeenCalled(1);
      expect(onClearFn1.mock.calls[0][0].e.stopPropagation).toBeTruthy();
      expect(onClearFn1.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn1).toHaveBeenCalled(1);
      expect(onChangeFn1.mock.calls[0][0]).toBe('');
      expect(onChangeFn1.mock.calls[0][1].e.stopPropagation).toBeTruthy();
      expect(onChangeFn1.mock.calls[0][1].e.type).toBe('click');
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
        filter: (filterWords, option) => option.text.includes('Second'),
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
      const { container } = getNormalAutoCompleteMount({
        value: 'Second',
        highlightKeyword: true,
      });
      fireEvent.focus(container.querySelector('input'));
      const tSelectOptionDom = document.querySelectorAll('.t-select-option');
      expect(tSelectOptionDom.length).toBe(1);
    });

    test('options: option.label could be defined to any element', () => {
      const { container } = getNormalAutoCompleteMount();
      fireEvent.focus(container.querySelector('input'));
      const customNodeDom = document.querySelector('.custom-node');
      expect(customNodeDom).toBeTruthy();
    });
    test('options: 5 options should exist', () => {
      const { container } = getNormalAutoCompleteMount();
      fireEvent.focus(container.querySelector('input'));
      const tSelectOptionDom = document.querySelectorAll('.t-select-option');
      expect(tSelectOptionDom.length).toBe(5);
    });
    test('options: expect empty options with no panel', () => {
      const { container } = render(
        <AutoComplete popupProps={{ overlayClassName: 'empty-options-class-name' }}></AutoComplete>,
      );
      fireEvent.focus(container.querySelector('input'));
      const emptyOptionsClassNameTAutocompletePanelDom = document.querySelectorAll(
        '.empty-options-class-name .t-autocomplete__panel',
      );
      expect(emptyOptionsClassNameTAutocompletePanelDom.length).toBe(0);
    });
    test('options: define one option', () => {
      const { container } = getOptionSlotAutoCompleteMount({
        popupProps: { overlayClassName: 'option-slot-class-name' },
      });
      fireEvent.focus(container.querySelector('input'));
      const optionSlotClassNameCustomSlotOptionDom = document.querySelector(
        '.option-slot-class-name .custom-slot-option',
      );
      expect(optionSlotClassNameCustomSlotOptionDom.textContent).toBe('First Keyword');
    });

    test(`placeholder is equal to 'type keyword to search'`, () => {
      const { container } = render(<AutoComplete placeholder="type keyword to search"></AutoComplete>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('placeholder')).toBe('type keyword to search');
    });

    test('popupProps overlayClassName', () => {
      const { container } = getNormalAutoCompleteMount({
        popupProps: { overlayClassName: 'custom-class-name' },
      });
      fireEvent.focus(container.querySelector('input'));
      const customClassNameDom = document.querySelector('.custom-class-name');
      expect(customClassNameDom).toBeTruthy();
    });
    test('popupProps overlayInnerClassName', () => {
      const { container } = getNormalAutoCompleteMount({
        popupProps: { overlayInnerClassName: 'custom-class-name' },
      });
      fireEvent.focus(container.querySelector('input'));
      const customClassNameDom = document.querySelector('.custom-class-name');
      expect(customClassNameDom).toBeTruthy();
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
      test(`size is equal to ${item}`, () => {
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
      test(`status is equal to ${item}`, () => {
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

    test('tips is equal this is a tip', () => {
      const { container } = render(<AutoComplete tips="this is a tip"></AutoComplete>);
      expect(container.querySelector('.t-input__tips')).toBeTruthy();
    });

    test(`value is equal to 'DefaultKeyword'`, () => {
      const { container } = render(<AutoComplete value="DefaultKeyword"></AutoComplete>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.value).toBe('DefaultKeyword');
    });
  });

  describe('slots', () => {
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
    test('blur', async () => {
      const onFocusFn = vi.fn();
      const onBlurFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onFocus: onFocusFn, onBlur: onBlurFn1 });
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled(1);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
      fireEvent.blur(container.querySelector('input'));
      await mockDelay(300);
      expect(onBlurFn1).toHaveBeenCalled(1);
      expect(onBlurFn1.mock.calls[0][0].e.type).toBe('blur');
    });

    test('compositionend', () => {
      const onCompositionendFn = vi.fn();
      const { container } = render(<AutoComplete onCompositionend={onCompositionendFn}></AutoComplete>);
      fireEvent.compositionEnd(container.querySelector('input'));
      expect(onCompositionendFn).toHaveBeenCalled(1);
      expect(onCompositionendFn.mock.calls[0][0].e.type).toBe('compositionend');
    });

    test('compositionstart', () => {
      const onCompositionstartFn = vi.fn();
      const { container } = render(<AutoComplete onCompositionstart={onCompositionstartFn}></AutoComplete>);
      fireEvent.compositionStart(container.querySelector('input'));
      expect(onCompositionstartFn).toHaveBeenCalled(1);
      expect(onCompositionstartFn.mock.calls[0][0].e.type).toBe('compositionstart');
    });

    test('enter', () => {
      const onEnterFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onEnter: onEnterFn1 });
      fireEvent.focus(container.querySelector('input'));
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(onEnterFn1).toHaveBeenCalled(1);
      expect(onEnterFn1.mock.calls[0][0].e.type).toBe('keydown');
      expect(/Enter/i.test(onEnterFn1.mock.calls[0][0].e.key)).toBeTruthy();
    });

    test('focus', () => {
      const onFocusFn = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onFocus: onFocusFn });
      fireEvent.focus(container.querySelector('input'));
      expect(container.querySelector('.t-is-focused')).toBeTruthy();
      expect(onFocusFn).toHaveBeenCalled(1);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
    });

    test('select', () => {
      const onSelectFn1 = vi.fn();
      const { container } = getNormalAutoCompleteMount(
        { popupProps: { overlayClassName: 'select-event-class-name' } },
        { onSelect: onSelectFn1 },
      );
      fireEvent.focus(container.querySelector('input'));
      fireEvent.click(document.querySelector('.select-event-class-name .t-select-option'));
      expect(onSelectFn1).toHaveBeenCalled(1);
      expect(onSelectFn1.mock.calls[0][0]).toBe('FirstKeyword');
      expect(onSelectFn1.mock.calls[0][1].e.type).toBe('click');
    });
    test('select: keyboard operations: ArrowDown & ArrowUp & Enter', async () => {
      const onSelectFn6 = vi.fn();
      const { container } = getNormalAutoCompleteMount({}, { onSelect: onSelectFn6 });
      fireEvent.focus(container.querySelector('input'));
      simulateKeydownEvent(document, 'ArrowDown');
      await mockDelay(10);
      const domWrapper1 = document.querySelector('.t-select-option:first-child');
      expect(domWrapper1).toHaveClass('t-select-option--hover');
      simulateKeydownEvent(document, 'ArrowDown');
      await mockDelay(10);
      const domWrapper2 = document.querySelector('.t-select-option:nth-child(2)');
      expect(domWrapper2).toHaveClass('t-select-option--hover');
      simulateKeydownEvent(document, 'ArrowUp');
      await mockDelay(10);
      const domWrapper3 = document.querySelector('.t-select-option:first-child');
      expect(domWrapper3).toHaveClass('t-select-option--hover');
      simulateKeydownEvent(document, 'ArrowUp');
      await mockDelay(10);
      const domWrapper4 = document.querySelector('.t-select-option:nth-child(5)');
      expect(domWrapper4).toHaveClass('t-select-option--hover');
      simulateKeydownEvent(document, 'ArrowDown');
      await mockDelay(10);
      const domWrapper5 = document.querySelector('.t-select-option:first-child');
      expect(domWrapper5).toHaveClass('t-select-option--hover');
      simulateKeydownEvent(document, 'Enter');
      expect(onSelectFn6).toHaveBeenCalled(1);
      expect(onSelectFn6.mock.calls[0][0]).toBe('FirstKeyword');
      expect(onSelectFn6.mock.calls[0][1].e.type).toBe('keydown');
    });
  });
});
