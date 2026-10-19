import React from 'react';
import {
  fireEvent,
  mockDelay,
  render,
  simulateDocumentMouseEvent,
  simulateInputChange,
  simulateInputEnter,
  vi,
} from '@test/utils';

import { TreeSelect } from '..';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  {
    label: 'tdesign-react',
    value: 2,
    children: [
      { label: 'tdesign-web-react', value: '2.1' },
      { label: 'tdesign-mobile-react', value: '2.2' },
    ],
  },
  { label: 'tdesign-miniprogram', value: 3 },
  {
    label: <span>tdesign-mobile-react</span>,
    text: 'tdesign-mobile-react',
    value: '4',
  },
  { label: 'tdesign-angular', value: '5' },
  { label: 'tdesign-mobile-vue', value: '6' },
];

function getTreeSelectDefaultMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  return render(<TreeSelect data={OPTIONS} {...props} {...events}></TreeSelect>);
}

function getTreeSelectMultipleMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  const value = [1, 2, 3, '4', '5'];
  return render(<TreeSelect value={value} data={OPTIONS} multiple={true} {...props} {...events}></TreeSelect>);
}

describe('TreeSelect', () => {
  describe('props', () => {
    test('autofocus[boolean]', () => {
      const { container: falseContainer } = render(<TreeSelect autofocus={false}></TreeSelect>);
      expect(falseContainer.querySelector('input').getAttribute('autofocus')).toBeNull();

      const { container: trueContainer } = render(<TreeSelect autofocus={true}></TreeSelect>);
      expect(trueContainer.querySelector('input').getAttribute('autofocus')).toBeDefined();
    });

    test('borderless[boolean]', () => {
      const { container: container1 } = render(<TreeSelect></TreeSelect>);
      expect(container1.querySelector(`.${'t-select-input--borderless'}`)).toBeFalsy();

      const { container: container2 } = render(<TreeSelect borderless={true}></TreeSelect>);
      expect(container2.firstChild).toHaveClass('t-select-input--borderless');

      const { container: container3 } = render(<TreeSelect borderless={false}></TreeSelect>);
      expect(container3.querySelector(`.${'t-select-input--borderless'}`)).toBeFalsy();
    });

    test('clearable', async () => {
      const { container: emptyContainer } = render(<TreeSelect clearable={true}></TreeSelect>);
      fireEvent.mouseEnter(emptyContainer.querySelector('.t-input'));
      await mockDelay();
      expect(emptyContainer.querySelector('.t-input__suffix-clear')).toBeFalsy();

      const { container: singleContainer } = getTreeSelectDefaultMount({
        value: 1,
        clearable: true,
      });
      fireEvent.mouseEnter(singleContainer.querySelector('.t-input'));
      await mockDelay();
      expect(singleContainer.querySelector('.t-input__suffix-clear')).toBeTruthy();

      const { container: multipleContainer } = getTreeSelectMultipleMount({
        value: [1],
        clearable: true,
      });
      fireEvent.mouseEnter(multipleContainer.querySelector('.t-input'));
      await mockDelay();
      expect(multipleContainer.querySelector('.t-tag-input__suffix-clear')).toBeTruthy();
    });

    test('data[array<DataOption>]', () => {
      const { container } = render(<TreeSelect data={[]}></TreeSelect>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(document.querySelector('.t-select__empty')).toBeTruthy();
    });

    test('disabled[boolean]', async () => {
      const wrapper1 = render(<TreeSelect></TreeSelect>);
      expect(wrapper1.container.querySelector('.t-input').querySelector(`.${'t-is-disabled'}`)).toBeFalsy();

      const wrapper2 = render(<TreeSelect disabled={true}></TreeSelect>);
      expect(wrapper2.container.querySelector('.t-input')).toHaveClass('t-is-disabled');

      const wrapper3 = render(<TreeSelect disabled={false}></TreeSelect>);
      expect(wrapper3.container.querySelector('.t-input').querySelector(`.${'t-is-disabled'}`)).toBeFalsy();

      const onPopupVisibleChangeFn = vi.fn();
      const { container: disabledPopupContainer } = render(
        <TreeSelect disabled={true} onPopupVisibleChange={onPopupVisibleChangeFn}></TreeSelect>,
      );
      fireEvent.click(disabledPopupContainer.querySelector('.t-input'));
      expect(onPopupVisibleChangeFn).not.toHaveBeenCalled();

      const { container: disabledSingleClear } = getTreeSelectDefaultMount({
        value: 1,
        disabled: true,
      });
      fireEvent.mouseEnter(disabledSingleClear.querySelector('.t-input'));
      await mockDelay();
      expect(disabledSingleClear.querySelector('.t-input__suffix-clear')).toBeFalsy();

      const { container: disabledMultipleClear } = getTreeSelectMultipleMount({
        value: [1],
        disabled: true,
      });
      fireEvent.mouseEnter(disabledMultipleClear.querySelector('.t-input'));
      await mockDelay();
      expect(disabledMultipleClear.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();
    });

    test('inputProps.name[string]', () => {
      const { container } = render(<TreeSelect inputProps={{ name: 'tree-select-input-name' }}></TreeSelect>);
      expect(container.querySelector('input').getAttribute('name')).toBe('tree-select-input-name');
    });

    test('inputValue[string]', () => {
      const onInputChangeFn1 = vi.fn();
      const { container: uncontrolledContainer } = getTreeSelectMultipleMount(
        { filterable: true },
        { onInputChange: onInputChangeFn1 },
      );
      fireEvent.click(uncontrolledContainer.querySelector('.t-input'));
      simulateInputChange(uncontrolledContainer.querySelector('input'), 'tdesign');
      expect(uncontrolledContainer.querySelector('input').value).toBe('tdesign');
      expect(onInputChangeFn1).toHaveBeenCalled();
      expect(onInputChangeFn1.mock.calls[0][0]).toBe('tdesign');
      expect(onInputChangeFn1.mock.calls[0][1].e.type).toBe('change');
      expect(onInputChangeFn1.mock.calls[0][1].trigger).toBe('input');

      const onInputChangeFn = vi.fn();
      const { container: controlledContainer } = getTreeSelectMultipleMount(
        { filterable: true, inputValue: 'tdesign', popupVisible: true },
        { onInputChange: onInputChangeFn },
      );
      simulateInputChange(controlledContainer.querySelector('input'), 'Hello TDesign');
      expect(controlledContainer.querySelector('input').value).toBe('tdesign');
      expect(onInputChangeFn).toHaveBeenCalled();
      expect(onInputChangeFn.mock.calls[0][0]).toBe('Hello TDesign');
      expect(onInputChangeFn.mock.calls[0][1].e.type).toBe('change');
      expect(onInputChangeFn.mock.calls[0][1].trigger).toBe('input');
    });

    test('loading[boolean]', () => {
      const { container } = render(<TreeSelect></TreeSelect>);
      expect(container.querySelector('.t-loading')).toBeFalsy();

      const { container: container1 } = render(<TreeSelect loading={false}></TreeSelect>);
      expect(container1.querySelector('.t-loading')).toBeFalsy();

      const { container: container2 } = render(<TreeSelect loading={true}></TreeSelect>);
      expect(container2.querySelector('.t-loading')).toBeTruthy();
    });

    test('loadingText[TNode]', async () => {
      const { container: defaultTextContainer } = render(<TreeSelect loading={true}></TreeSelect>);
      fireEvent.click(defaultTextContainer.querySelector('.t-input'));
      expect(document.querySelector('.t-select__loading-tips')).toBeTruthy();

      const { container: customTextContainer } = render(
        <TreeSelect loadingText={<span className="custom-node">TNode</span>} loading={true}></TreeSelect>,
      );
      fireEvent.click(customTextContainer.querySelector('.t-input'));
      expect(document.querySelector('.custom-node')).toBeTruthy();
      expect(document.querySelector('.t-select__loading-tips')).toBeTruthy();
    });

    test('max[number]', async () => {
      const onChangeFn1 = vi.fn();
      const { container } = getTreeSelectMultipleMount({ max: 2, value: [1, '4'] }, { onChange: onChangeFn1 });
      fireEvent.click(container.querySelector('.t-input'));
      await mockDelay(300);
      fireEvent.click(document.querySelector('.t-popup .t-tree__item:last-child .t-checkbox__label'));
      expect(onChangeFn1).not.toHaveBeenCalled();
    });

    test('minCollapsedNum[number]', () => {
      const { container } = getTreeSelectMultipleMount({ minCollapsedNum: 2 });
      expect(container.querySelectorAll('.t-tag').length).toBe(3);
      expect(container.querySelector('.t-tag:last-child').textContent).toBe('+3');
    });

    test('placeholder[string]', () => {
      const wrapper = render(<TreeSelect placeholder={'this is tree select placeholder'}></TreeSelect>);
      expect(wrapper.container.querySelector('input').getAttribute('placeholder')).toBe(
        'this is tree select placeholder',
      );
    });

    test('popupProps.overlayClassName[string]', () => {
      const { container } = render(
        <TreeSelect popupProps={{ overlayClassName: 'custom-popup-class-name' }}></TreeSelect>,
      );
      fireEvent.click(container.querySelector('.t-input'));
      expect(document.querySelector('.t-popup')).toHaveClass('custom-popup-class-name');
    });

    test('popupVisible[boolean]', () => {
      const { container: container1 } = render(<TreeSelect></TreeSelect>);
      expect(container1.querySelector(`.${'t-select-input--popup-visible'}`)).toBeFalsy();

      const { container: container2 } = render(<TreeSelect popupVisible={true}></TreeSelect>);
      expect(container2.firstChild).toHaveClass('t-select-input--popup-visible');

      const { container: container3 } = render(<TreeSelect popupVisible={false}></TreeSelect>);
      expect(container3.querySelector(`.${'t-select-input--popup-visible'}`)).toBeFalsy();
    });

    test('readOnly', () => {
      const onPopupVisibleChangeFn = vi.fn();
      const { container } = render(
        <TreeSelect readOnly={true} onPopupVisibleChange={onPopupVisibleChangeFn}></TreeSelect>,
      );
      fireEvent.click(container.querySelector('.t-input'));
      expect(onPopupVisibleChangeFn).not.toHaveBeenCalled();
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as const).forEach((item, index) => {
      test(`size[${item}]`, () => {
        const wrapper = render(<TreeSelect size={item}></TreeSelect>);
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
        const wrapper = render(<TreeSelect status={item}></TreeSelect>);
        const container = wrapper.container.querySelector('.t-input');
        if (typeof statusClassNameList[index] === 'string') {
          expect(container).toHaveClass(statusClassNameList[index]);
        } else if (typeof statusClassNameList[index] === 'object') {
          const classNameKey = Object.keys(statusClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    test('tagProps.theme[warning]', () => {
      const { container } = getTreeSelectMultipleMount({
        tagProps: { theme: 'warning' },
      });
      expect(container.querySelectorAll('.t-tag--warning').length).toBe(5);
    });

    test('tips[string]', () => {
      const { container } = render(<TreeSelect tips={'this is a tip'}></TreeSelect>);
      expect(container.querySelectorAll('.t-input__tips').length).toBe(1);
    });

    test('value[string]', () => {
      const { container } = render(<TreeSelect value={'tdesign-vue'}></TreeSelect>);
      expect(container.querySelector('input').value).toBe('tdesign-vue');
    });

    test('valueType[object]', () => {
      const { container } = getTreeSelectDefaultMount({
        valueType: 'object',
        multiple: true,
        value: [{ label: 'tdesign-vue', value: 1 }],
      });
      expect(container.querySelectorAll('.t-tag').length).toBe(1);
    });

    const collapsedItemsData = [
      { label: 'tdesign-vue', value: 1 },
      { label: 'tdesign-react', value: 2 },
      { label: 'tdesign-miniprogram', value: 3 },
      { label: 'tdesign-angular', value: '5' },
      { label: 'tdesign-mobile-vue', value: '6' },
    ];

    test('collapsedItems[TNode]', () => {
      const { container } = getTreeSelectMultipleMount({
        collapsedItems: <span className="custom-node">TNode</span>,
        minCollapsedNum: 2,
        value: [1, 3, '5'],
        data: collapsedItemsData,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('collapsedItems[function]', () => {
      const fn = vi.fn();
      getTreeSelectMultipleMount({
        collapsedItems: fn,
        minCollapsedNum: 2,
        value: [1, 3, '5'],
        data: collapsedItemsData,
      });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].count).toBe(1);
      expect(fn.mock.calls[0][0].value).toEqual(['tdesign-vue', 'tdesign-miniprogram', 'tdesign-angular']);
      expect(fn.mock.calls[0][0].collapsedSelectedItems).toEqual(['tdesign-angular']);
    });

    test('empty[TNode]', () => {
      const { container } = render(<TreeSelect empty={<span className="custom-node">TNode</span>}></TreeSelect>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(document.querySelector('.custom-node')).toBeTruthy();
    });

    test('prefixIcon[TNode]', () => {
      const { container } = render(<TreeSelect prefixIcon={<span className="custom-node">TNode</span>}></TreeSelect>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    const valueDisplayData = [{ label: 'tdesign-vue', value: 1 }];

    test('valueDisplay[TNode]', () => {
      const { container } = getTreeSelectMultipleMount({
        valueDisplay: <span className="custom-node">TNode</span>,
        value: 1,
        data: valueDisplayData,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('valueDisplay[function]', () => {
      const fn = vi.fn();
      getTreeSelectMultipleMount({
        valueDisplay: fn,
        value: 1,
        data: valueDisplayData,
      });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].value).toEqual([{ label: 'tdesign-vue', value: 1 }]);
      expect(fn.mock.calls[0][0].onClose).toBeTruthy();
    });
  });

  describe('scenarios', () => {
    test('filter supports custom, searchable, multiple, and controlled modes', async () => {
      const customFilterMount = getTreeSelectMultipleMount({
        filter: (filterWord, node) => !filterWord || node.data.label === filterWord,
      });
      fireEvent.click(customFilterMount.container.querySelector('.t-input'));
      simulateInputChange(customFilterMount.container.querySelector('input'), 'tdesign-react');
      await mockDelay(100);
      expect(document.querySelectorAll('.t-tree__item:not(.t-tree__item--hidden)').length).toBe(1);
      customFilterMount.unmount();

      const onSearchPriorityMount = getTreeSelectMultipleMount({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSearch: () => {},
        filter: (filterWord, option) => !filterWord || option.label === filterWord,
      });
      fireEvent.click(onSearchPriorityMount.container.querySelector('.t-input'));
      simulateInputChange(onSearchPriorityMount.container.querySelector('input'), 'tdesign-react');
      await mockDelay(100);
      expect(document.querySelectorAll('.t-tree__item:not(.t-tree__item--hidden)').length).toBe(8);
      onSearchPriorityMount.unmount();

      const multipleFilterMount = getTreeSelectMultipleMount({
        filterable: true,
      });
      fireEvent.click(multipleFilterMount.container.querySelector('.t-input'));
      simulateInputChange(multipleFilterMount.container.querySelector('input'), 'tdesign-vue');
      await mockDelay(100);
      fireEvent.click(document.querySelector('.t-tree__item:first-child'));
      multipleFilterMount.unmount();

      const onChangeFn2 = vi.fn();
      const singleFilterMount = getTreeSelectDefaultMount({ filterable: true }, { onChange: onChangeFn2 });
      fireEvent.click(singleFilterMount.container.querySelector('.t-input'));
      simulateInputChange(singleFilterMount.container.querySelector('input'), 'tdesign-vue');
      await mockDelay(100);
      fireEvent.click(document.querySelector('.t-tree__item:first-child'));
      expect(onChangeFn2).toHaveBeenCalled();
      expect(onChangeFn2.mock.calls[0][0]).toBe(1);
      expect(onChangeFn2.mock.calls[0][1].node).toBeTruthy();
      expect(onChangeFn2.mock.calls[0][1].data).toEqual({
        label: 'tdesign-vue',
        value: 1,
      });
      expect(onChangeFn2.mock.calls[0][1].trigger).toBe('check');
      expect(onChangeFn2.mock.calls[0][1].e.type).toBe('click');
      singleFilterMount.unmount();

      const filterableMount = getTreeSelectDefaultMount({
        inputValue: 'tdesign-vue',
        filterable: true,
      });
      fireEvent.click(filterableMount.container.querySelector('.t-input'));
      await mockDelay(100);
      expect(document.querySelectorAll('.t-tree__item:not(.t-tree__item--hidden)').length).toBe(1);
      filterableMount.unmount();
    });
  });

  describe('events', () => {
    test('blur', async () => {
      const onFocusFn = vi.fn();
      const onBlurFn1 = vi.fn();
      const { container: singleContainer } = getTreeSelectDefaultMount(
        { filterable: true, value: 1 },
        { onFocus: onFocusFn, onBlur: onBlurFn1 },
      );
      fireEvent.click(singleContainer.querySelector('.t-input'));
      await mockDelay(100);
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
      expect(onFocusFn.mock.calls[0][0].value).toBe(1);
      simulateDocumentMouseEvent(document, 'mousedown');
      expect(onBlurFn1).toHaveBeenCalled();
      expect(onBlurFn1.mock.calls[0][0].e.type).toBe('mousedown');
      expect(onBlurFn1.mock.calls[0][0].value).toBe(1);

      const onFocusMultipleFn = vi.fn();
      const onBlurMultipleFn = vi.fn();
      const { container: multipleContainer } = getTreeSelectMultipleMount(
        { filterable: true, value: [1] },
        { onFocus: onFocusMultipleFn, onBlur: onBlurMultipleFn },
      );
      fireEvent.click(multipleContainer.querySelector('.t-input'));
      expect(onFocusMultipleFn).toHaveBeenCalled();
      expect(onFocusMultipleFn.mock.calls[0][0].e.type).toBe('focus');
      simulateDocumentMouseEvent(document, 'mousedown');
      expect(onBlurMultipleFn).toHaveBeenCalled();
      expect(onBlurMultipleFn.mock.calls[0][0].e.type).toBe('mousedown');
      expect(onBlurMultipleFn.mock.calls[0][0].value).toEqual([1]);
    });

    test('change', async () => {
      const onChangeSingle = vi.fn();
      const { container: singleContainer } = getTreeSelectDefaultMount(
        { treeProps: { expandAll: true } },
        { onChange: onChangeSingle },
      );
      fireEvent.click(singleContainer.querySelector('.t-input'));
      await mockDelay(200);
      fireEvent.click(document.querySelector('.t-tree__item:nth-child(3)'));
      expect(onChangeSingle).toHaveBeenCalled();
      expect(onChangeSingle.mock.calls[0][0]).toBe('2.1');
      expect(onChangeSingle.mock.calls[0][1].e.type).toBe('click');
      expect(onChangeSingle.mock.calls[0][1].node.label).toBe('tdesign-web-react');
      expect(onChangeSingle.mock.calls[0][1].data).toEqual({
        label: 'tdesign-web-react',
        value: '2.1',
      });

      const onChangeMultiple = vi.fn();
      const { container: multipleContainer } = getTreeSelectMultipleMount(
        { treeProps: { expandAll: true } },
        { onChange: onChangeMultiple },
      );
      fireEvent.click(multipleContainer.querySelector('.t-input'));
      await mockDelay(200);
      fireEvent.click(document.querySelector('.t-tree__item:last-child .t-checkbox__label'));
      expect(onChangeMultiple).toHaveBeenCalled();
      expect(onChangeMultiple.mock.calls[0][0]).toEqual([1, 3, '4', '5', '2.1', '2.2', '6']);
      expect(onChangeMultiple.mock.calls[0][1].trigger).toBe('check');
      expect(onChangeMultiple.mock.calls[0][1].e.type).toBe('change');
      expect(onChangeMultiple.mock.calls[0][1].node.label).toBe('tdesign-mobile-vue');
      expect(onChangeMultiple.mock.calls[0][1].data).toEqual({
        label: 'tdesign-mobile-vue',
        value: '6',
      });

      onChangeMultiple.mockClear();
      const { container: uncheckContainer } = getTreeSelectMultipleMount(
        { treeProps: { expandAll: true } },
        { onChange: onChangeMultiple },
      );
      fireEvent.click(uncheckContainer.querySelector('.t-input'));
      await mockDelay(200);
      fireEvent.click(document.querySelector('.t-tree__item:first-child .t-checkbox__label'));
      expect(onChangeMultiple).toHaveBeenCalled();
      expect(onChangeMultiple.mock.calls[0][0]).toEqual([3, '4', '5', '2.1', '2.2']);
      expect(onChangeMultiple.mock.calls[0][1].trigger).toBe('uncheck');
      expect(onChangeMultiple.mock.calls[0][1].e.type).toBe('change');
      expect(onChangeMultiple.mock.calls[0][1].node.label).toBe('tdesign-vue');
    });

    test('clear', async () => {
      const onClearFn1 = vi.fn();
      const onChangeFn1 = vi.fn();
      const onPopupVisibleChangeFn1 = vi.fn();
      const { container: multipleContainer } = getTreeSelectMultipleMount(
        { clearable: true },
        {
          onClear: onClearFn1,
          onChange: onChangeFn1,
          onPopupVisibleChange: onPopupVisibleChangeFn1,
        },
      );
      fireEvent.mouseEnter(multipleContainer.querySelector('.t-input'));
      await mockDelay();
      fireEvent.click(multipleContainer.querySelector('.t-tag-input__suffix-clear'));
      expect(onClearFn1).toHaveBeenCalled();
      expect(onClearFn1.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn1).toHaveBeenCalled();
      expect(onChangeFn1.mock.calls[0][0]).toEqual([]);
      expect(onChangeFn1.mock.calls[0][1].trigger).toBe('clear');
      expect(onPopupVisibleChangeFn1).toHaveBeenCalled();
      expect(onPopupVisibleChangeFn1.mock.calls[0][0]).toBe(false);
      expect(onPopupVisibleChangeFn1.mock.calls[0][1].trigger).toBe('clear');

      onClearFn1.mockClear();
      onChangeFn1.mockClear();
      onPopupVisibleChangeFn1.mockClear();
      const { container: singleContainer } = getTreeSelectDefaultMount(
        { value: 1, clearable: true },
        {
          onClear: onClearFn1,
          onChange: onChangeFn1,
          onPopupVisibleChange: onPopupVisibleChangeFn1,
        },
      );
      fireEvent.mouseEnter(singleContainer.querySelector('.t-input'));
      await mockDelay();
      fireEvent.click(singleContainer.querySelector('.t-input__suffix-clear'));
      expect(onClearFn1).toHaveBeenCalled();
      expect(onClearFn1.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn1).toHaveBeenCalled();
      expect(onChangeFn1.mock.calls[0][0]).toBe(undefined);
      expect(onChangeFn1.mock.calls[0][1].trigger).toBe('clear');
      expect(onPopupVisibleChangeFn1).toHaveBeenCalled();
      expect(onPopupVisibleChangeFn1.mock.calls[0][0]).toBe(false);
      expect(onPopupVisibleChangeFn1.mock.calls[0][1].trigger).toBe('clear');
    });

    test('focus', () => {
      const onFocusFn = vi.fn();
      const { container: primitiveContainer } = getTreeSelectMultipleMount(
        { filterable: true, value: [1] },
        { onFocus: onFocusFn },
      );
      fireEvent.focus(primitiveContainer.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0].value).toEqual([1]);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');

      onFocusFn.mockClear();
      const { container: objectValueContainer } = getTreeSelectMultipleMount(
        { filterable: true, value: [{ label: 'tdesign-vue', value: 1 }] },
        { onFocus: onFocusFn },
      );
      fireEvent.focus(objectValueContainer.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0].value).toEqual([{ label: 'tdesign-vue', value: 1 }]);
      expect(onFocusFn.mock.calls[0][0].e.type).toBe('focus');
    });

    test('popupVisibleChange', async () => {
      const onPopupVisibleChangeFn = vi.fn();
      const { container } = getTreeSelectMultipleMount(
        { inputValue: 'tdesign' },
        { onPopupVisibleChange: onPopupVisibleChangeFn },
      );
      fireEvent.click(container.querySelector('.t-input'));
      await mockDelay(200);
      expect(onPopupVisibleChangeFn).toHaveBeenCalled();
      expect(onPopupVisibleChangeFn.mock.calls[0][0]).toBe(true);
    });

    test('remove', () => {
      const onRemoveFn = vi.fn();
      const { container: tagRemoveContainer } = getTreeSelectMultipleMount({}, { onRemove: onRemoveFn });
      fireEvent.click(tagRemoveContainer.querySelector('.t-tag__icon-close'));
      expect(onRemoveFn).toHaveBeenCalled();
      expect(onRemoveFn.mock.calls[0][0].value).toBe(1);
      expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
      expect(onRemoveFn.mock.calls[0][0].trigger).toBe('tag-remove');
      expect(onRemoveFn.mock.calls[0][0].data).toEqual({
        label: 'tdesign-vue',
        value: 1,
      });
      expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');

      const onRemoveFn1 = vi.fn();
      const { container: backspaceContainer } = getTreeSelectMultipleMount(
        { filterable: true },
        { onRemove: onRemoveFn1 },
      );
      fireEvent.click(backspaceContainer.querySelector('.t-input'));
      fireEvent.keyDown(backspaceContainer.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFn1).toHaveBeenCalled();
      expect(onRemoveFn1.mock.calls[0][0].value).toBe('5');
      expect(onRemoveFn1.mock.calls[0][0].index).toBe(4);
      expect(onRemoveFn1.mock.calls[0][0].trigger).toBe('backspace');
      expect(onRemoveFn1.mock.calls[0][0].data).toEqual({
        label: 'tdesign-angular',
        value: '5',
      });
      expect(onRemoveFn1.mock.calls[0][0].e.type).toBe('keydown');
    });

    test('search', () => {
      const onSearchSingleInput = vi.fn();
      const { container: singleInputContainer } = getTreeSelectDefaultMount(
        { filterable: true },
        { onSearch: onSearchSingleInput },
      );
      fireEvent.click(singleInputContainer.querySelector('.t-input'));
      simulateInputChange(singleInputContainer.querySelector('input'), 'tdesign-vue');
      expect(onSearchSingleInput).toHaveBeenCalled();
      expect(onSearchSingleInput.mock.calls[0][0]).toBe('tdesign-vue');

      const onSearchSingleEnter = vi.fn();
      const { container: singleEnterContainer } = getTreeSelectDefaultMount(
        { filterable: true },
        { onSearch: onSearchSingleEnter },
      );
      fireEvent.click(singleEnterContainer.querySelector('.t-input'));
      simulateInputChange(singleEnterContainer.querySelector('input'), 'tdesign-vue');
      simulateInputEnter(singleEnterContainer.querySelector('input'));
      expect(onSearchSingleEnter).toHaveBeenCalled();
      expect(onSearchSingleEnter.mock.calls[1][0]).toBe('tdesign-vue');

      const onSearchMultipleInput = vi.fn();
      const { container: multipleInputContainer } = getTreeSelectMultipleMount(
        { filterable: true },
        { onSearch: onSearchMultipleInput },
      );
      fireEvent.click(multipleInputContainer.querySelector('.t-input'));
      simulateInputChange(multipleInputContainer.querySelector('input'), 'tdesign-vue');
      expect(onSearchMultipleInput).toHaveBeenCalled();
      expect(onSearchMultipleInput.mock.calls[0][0]).toBe('tdesign-vue');

      const onSearchMultipleEnter = vi.fn();
      const { container: multipleEnterContainer } = getTreeSelectMultipleMount(
        { filterable: true },
        { onSearch: onSearchMultipleEnter },
      );
      fireEvent.click(multipleEnterContainer.querySelector('.t-input'));
      simulateInputChange(multipleEnterContainer.querySelector('input'), 'tdesign-vue');
      simulateInputEnter(multipleEnterContainer.querySelector('input'));
      expect(onSearchMultipleEnter).toHaveBeenCalled();
      expect(onSearchMultipleEnter.mock.calls[1][0]).toBe('tdesign-vue');
    });
  });
});
