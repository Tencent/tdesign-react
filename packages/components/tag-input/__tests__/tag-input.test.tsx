import React from 'react';
import { act, fireEvent, mockDelay, render, simulateInputChange, simulateInputEnter, vi } from '@test/utils';

import { TagInput } from '..';

import type { TdTagInputProps } from '../type';

function getTagInputDefaultMount(props?: Record<string, any>, events?: Record<string, any>) {
  return render(<TagInput {...props} {...events}></TagInput>);
}

function getTagInputValueMount(props?: Record<string, any>, events?: Record<string, any>) {
  const value = ['tdesign-vue', 'tdesign-react', 'tdesign-miniprogram', 'tdesign-mobile-vue', 'tdesign-mobile-react'];
  return render(<TagInput value={value} {...props} {...events}></TagInput>);
}

describe('TagInput', () => {
  describe('props', () => {
    test('clearable', async () => {
      const { container: emptyContainer } = render(<TagInput clearable={true}></TagInput>);
      fireEvent.mouseEnter(emptyContainer.querySelector('.t-input'));
      await mockDelay();
      expect(emptyContainer.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();

      const { container: valueContainer } = getTagInputValueMount({
        clearable: true,
      });
      fireEvent.mouseEnter(valueContainer.querySelector('.t-input'));
      await mockDelay();
      expect(valueContainer.querySelector('.t-tag-input__suffix-clear')).toBeTruthy();

      const { container: disabledClearContainer } = getTagInputValueMount({
        disabled: true,
        clearable: true,
      });
      fireEvent.mouseEnter(disabledClearContainer.querySelector('.t-input'));
      await mockDelay();
      expect(disabledClearContainer.querySelector('.t-input__suffix-clear')).toBeFalsy();

      const { container: readonlyClearContainer } = getTagInputValueMount({
        readonly: true,
        clearable: true,
      });
      fireEvent.mouseEnter(readonlyClearContainer.querySelector('.t-input'));
      await mockDelay();
      expect(readonlyClearContainer.querySelector('.t-input__suffix-clear')).toBeFalsy();
    });

    test('disabled', async () => {
      // disabled default value is
      const wrapper1 = render(<TagInput></TagInput>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const wrapper2 = render(<TagInput disabled={true}></TagInput>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-disabled');
      // disabled = false
      const wrapper3 = render(<TagInput disabled={false}></TagInput>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();

      const { container: disabledClearContainer } = getTagInputValueMount({
        disabled: true,
      });
      fireEvent.mouseEnter(disabledClearContainer.querySelector('.t-input'));
      await mockDelay();
      expect(disabledClearContainer.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();
    });

    const excessTagsDisplayTypeClassNameList = [{ 't-tag-input--break-line': false }, 't-tag-input--break-line'];
    (['scroll', 'break-line'] as TdTagInputProps['excessTagsDisplayType'][]).forEach((item, index) => {
      test(`excessTagsDisplayType[${item}]`, () => {
        const { container } = getTagInputValueMount({
          excessTagsDisplayType: item,
        });
        if (typeof excessTagsDisplayTypeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(excessTagsDisplayTypeClassNameList[index]);
        } else if (typeof excessTagsDisplayTypeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(excessTagsDisplayTypeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    test('inputProps.size', () => {
      const { container } = render(<TagInput inputProps={{ size: 'small' }}></TagInput>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper).toHaveClass('t-size-s');
    });

    test('inputValue', () => {
      const { container } = render(<TagInput inputValue={'input value text'}></TagInput>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.value).toBe('input value text');
    });

    test('max', () => {
      const { container } = getTagInputDefaultMount({ max: 1 });
      fireEvent.focus(container.querySelector('input'));
      const inputDom1 = container.querySelector('input');
      simulateInputChange(inputDom1, 'Tag3');
      const inputDom2 = container.querySelector('input');
      simulateInputEnter(inputDom2);
      expect(container.querySelectorAll('.t-tag').length).toBe(1);
      const inputDom3 = container.querySelector('input');
      simulateInputChange(inputDom3, 'Tag5');
      const inputDom4 = container.querySelector('input');
      simulateInputEnter(inputDom4);
      expect(container.querySelectorAll('.t-tag').length).toBe(1);
    });

    test('minCollapsedNum', () => {
      const { container } = getTagInputValueMount({ minCollapsedNum: 3 });
      expect(container.querySelectorAll('.t-tag').length).toBe(4);
    });

    test('placeholder', () => {
      const wrapper = render(<TagInput placeholder={'This is TagInput placeholder'}></TagInput>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('placeholder')).toBe('This is TagInput placeholder');
    });

    test('readOnly', async () => {
      const wrapper1 = render(<TagInput></TagInput>);
      expect(wrapper1.container.querySelector('.t-input').querySelector(`.${'t-is-readonly'}`)).toBeFalsy();

      const wrapper2 = render(<TagInput readOnly={true}></TagInput>);
      expect(wrapper2.container.querySelector('.t-input')).toHaveClass('t-is-readonly');

      const wrapper3 = render(<TagInput readOnly={false}></TagInput>);
      expect(wrapper3.container.querySelector('.t-input').querySelector(`.${'t-is-readonly'}`)).toBeFalsy();

      const onRemoveFn = vi.fn();
      const editableMount = getTagInputValueMount({ readOnly: false }, { onRemove: onRemoveFn });
      fireEvent.keyDown(editableMount.container.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFn).toHaveBeenCalled();

      const onRemoveFnUn = vi.fn();
      const readonlyMount = getTagInputValueMount({ readOnly: true }, { onRemove: onRemoveFnUn });
      fireEvent.keyDown(readonlyMount.container.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFnUn).not.toHaveBeenCalled();

      fireEvent.mouseEnter(readonlyMount.container.querySelector('.t-input'));
      await mockDelay();
      expect(readonlyMount.container.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();

      const onFocusFn = vi.fn();
      const { container: readonlyFocusContainer } = render(<TagInput readOnly={true} onFocus={onFocusFn}></TagInput>);
      fireEvent.click(readonlyFocusContainer.querySelector('.t-input'));
      expect(onFocusFn).toHaveBeenCalled();
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdTagInputProps['size'][]).forEach((item, index) => {
      test(`size[${item}]`, () => {
        const wrapper = render(<TagInput size={item}></TagInput>);
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
    (['default', 'success', 'warning', 'error'] as TdTagInputProps['status'][]).forEach((item, index) => {
      test(`status[${item}]`, () => {
        const wrapper = render(<TagInput status={item}></TagInput>);
        const container = wrapper.container.querySelector('.t-input');
        if (typeof statusClassNameList[index] === 'string') {
          expect(container).toHaveClass(statusClassNameList[index]);
        } else if (typeof statusClassNameList[index] === 'object') {
          const classNameKey = Object.keys(statusClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    test('tagProps', () => {
      const { container: themeContainer } = getTagInputValueMount({
        tagProps: { theme: 'warning' },
        multiple: true,
      });
      expect(themeContainer.querySelectorAll('.t-tag--warning').length).toBe(5);

      const { container: sizeContainer } = render(
        <TagInput
          size="large"
          tagProps={{ size: 'small' }}
          value={['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter']}
          minCollapsedNum={1}
        ></TagInput>,
      );
      expect(sizeContainer.querySelectorAll('.t-tag')[0]).toHaveClass('t-size-s');
      expect(sizeContainer.querySelectorAll('.t-tag')[1]).toHaveClass('t-size-s');
    });

    test('tips[string]', () => {
      const { container } = render(<TagInput tips={'this is a tip'}></TagInput>);
      expect(container.querySelectorAll('.t-input__tips').length).toBe(1);
    });

    test('value', () => {
      const { container: controlledContainer } = getTagInputDefaultMount({
        value: [],
      });
      fireEvent.focus(controlledContainer.querySelector('input'));
      simulateInputChange(controlledContainer.querySelector('input'), 'Tag1');
      simulateInputEnter(controlledContainer.querySelector('input'));
      expect(controlledContainer.querySelector('.t-tag')).toBeFalsy();

      const { container: uncontrolledContainer } = getTagInputDefaultMount();
      fireEvent.focus(uncontrolledContainer.querySelector('input'));
      simulateInputChange(uncontrolledContainer.querySelector('input'), 'Tag2');
      simulateInputEnter(uncontrolledContainer.querySelector('input'));
      expect(uncontrolledContainer.querySelectorAll('.t-tag').length).toBe(1);
    });

    test('collapsedItems', () => {
      const { container } = getTagInputValueMount({
        collapsedItems: <span className="custom-node">TNode</span>,
        minCollapsedNum: 3,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('label[TNode]', () => {
      const { container } = render(<TagInput label={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('label[string]', async () => {
      const text = 'test-label';
      const { getByText } = await render(<TagInput label={text} />);
      act(() => {
        expect(getByText(text)).toBeTruthy();
      });

      const { container: withTagsContainer } = render(<TagInput value={['Vue', 'React']} label="Controlled: " />);
      const wrapper = withTagsContainer.querySelector('.t-tag-input');
      const inputPrefix = withTagsContainer.querySelector('.t-input__prefix');
      const label = withTagsContainer.querySelector('.t-tag-input__prefix');
      expect(wrapper).toHaveClass('t-tag-input--break-line');
      expect(wrapper).toHaveClass('t-tag-input--with-tag');
      expect(inputPrefix).toContainElement(label as HTMLElement);
      expect(inputPrefix.querySelectorAll('.t-tag')).toHaveLength(2);
    });

    test('prefixIcon[TNode]', async () => {
      const text = 'test-prefixIcon';
      const { getByText } = await render(<TagInput prefixIcon={<span>{text}</span>} />);
      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('suffix', () => {
      const { container } = render(<TagInput suffix={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffixIcon', () => {
      const { container } = render(<TagInput suffixIcon={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag[TNode]', () => {
      const { container } = getTagInputValueMount({
        tag: <span className="custom-node">TNode</span>,
        value: ['tdesign-vue'],
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag[function]', () => {
      const fn = vi.fn();
      getTagInputValueMount({ tag: fn, value: ['tdesign-vue'] });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].value).toBe('tdesign-vue');
    });

    test('valueDisplay[TNode]', () => {
      const { container } = getTagInputValueMount({
        valueDisplay: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('valueDisplay[function]', () => {
      const fn = vi.fn();
      getTagInputValueMount({ valueDisplay: fn });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].value).toEqual([
        'tdesign-vue',
        'tdesign-react',
        'tdesign-miniprogram',
        'tdesign-mobile-vue',
        'tdesign-mobile-react',
      ]);
    });
  });

  describe('events', () => {
    test('blur', () => {
      const onBlurFn2 = vi.fn();
      const onInputChangeFn2 = vi.fn();
      const { container } = render(<TagInput onBlur={onBlurFn2} onInputChange={onInputChangeFn2}></TagInput>);
      fireEvent.focus(container.querySelector('input'));
      const inputDom1 = container.querySelector('input');
      simulateInputChange(inputDom1, 'tag1');
      fireEvent.blur(container.querySelector('input'));
      const attrDom2 = container.querySelector('input');
      expect(attrDom2.value).toBe('');
      expect(onBlurFn2).toHaveBeenCalled();
      expect(onBlurFn2.mock.calls[0][0]).toEqual([]);
      expect(onBlurFn2.mock.calls[0][1].e.type).toBe('blur');
      // blur 回调中 inputValue 保留用户输入值
      expect(onBlurFn2.mock.calls[0][1].inputValue).toBe('tag1');
      expect(onInputChangeFn2).toHaveBeenCalled();
      // 但 input 本身立刻被清空
      expect(onInputChangeFn2.mock.calls[1][0]).toBe('');
      expect(onInputChangeFn2.mock.calls[1][1].e.type).toBe('blur');
      expect(onInputChangeFn2.mock.calls[1][1].trigger).toBe('blur');
    });

    test('clear', async () => {
      const onClearFn1 = vi.fn();
      const onChangeFn1 = vi.fn();
      const { container } = getTagInputValueMount({ clearable: true }, { onClear: onClearFn1, onChange: onChangeFn1 });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      fireEvent.click(container.querySelector('.t-tag-input__suffix-clear'));
      expect(onClearFn1).toHaveBeenCalled();
      expect(onClearFn1.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn1).toHaveBeenCalled();
      expect(onChangeFn1.mock.calls[0][0]).toEqual([]);
      expect(onChangeFn1.mock.calls[0][1].trigger).toBe('clear');
    });

    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<TagInput onClick={fn}></TagInput>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });

    test('enter', () => {
      const onEnterFn = vi.fn();
      const { container: callbackContainer } = getTagInputDefaultMount({ value: ['tag'] }, { onEnter: onEnterFn });
      simulateInputEnter(callbackContainer.querySelector('input'));
      expect(onEnterFn).toHaveBeenCalled();
      expect(onEnterFn.mock.calls[0][0]).toEqual(['tag']);

      const { container: addTagContainer } = render(<TagInput></TagInput>);
      fireEvent.focus(addTagContainer.querySelector('input'));
      simulateInputChange(addTagContainer.querySelector('input'), 'Tag');
      simulateInputEnter(addTagContainer.querySelector('input'));
      expect(addTagContainer.querySelectorAll('.t-tag').length).toBe(1);
    });

    test('focus', () => {
      const onFocusFn = vi.fn();
      const { container: emptyInputContainer } = getTagInputDefaultMount({}, { onFocus: onFocusFn });
      fireEvent.focus(emptyInputContainer.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][1].inputValue).toBe('');

      onFocusFn.mockClear();
      const { container: presetInputContainer } = getTagInputDefaultMount(
        { inputValue: 'tag' },
        { onFocus: onFocusFn },
      );
      fireEvent.focus(presetInputContainer.querySelector('input'));
      expect(onFocusFn.mock.calls[0][1].inputValue).toBe('tag');

      const disabledFocusFn = vi.fn();
      const { container: disabledContainer } = render(<TagInput disabled={true} onFocus={disabledFocusFn}></TagInput>);
      fireEvent.click(disabledContainer.querySelector('.t-input'));
      expect(disabledFocusFn).not.toHaveBeenCalled();
    });

    test('mouseenter', async () => {
      const onMouseenterFn = vi.fn();
      const { container } = render(<TagInput onMouseenter={onMouseenterFn}></TagInput>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(onMouseenterFn).toHaveBeenCalled();
      expect(onMouseenterFn.mock.calls[0][0].e.type).toBe('mouseenter');
    });

    test('mouseleave', async () => {
      const onMouseleaveFn = vi.fn();
      const { container } = render(<TagInput onMouseleave={onMouseleaveFn}></TagInput>);
      fireEvent.mouseLeave(container.querySelector('.t-input'));
      await mockDelay();
      expect(onMouseleaveFn).toHaveBeenCalled();
      expect(onMouseleaveFn.mock.calls[0][0].e.type).toBe('mouseleave');
    });

    test('paste', () => {
      const onPasteFn = vi.fn();
      const { container } = render(<TagInput onPaste={onPasteFn}></TagInput>);
      fireEvent.paste(container.querySelector('input'));
      expect(onPasteFn).toHaveBeenCalled();
      expect(onPasteFn.mock.calls[0][0].e.type).toBe('paste');
    });

    test('remove', () => {
      const onRemoveBackspace = vi.fn();
      const { container: backspaceContainer } = getTagInputValueMount({}, { onRemove: onRemoveBackspace });
      fireEvent.keyDown(backspaceContainer.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveBackspace).toHaveBeenCalled();
      expect(onRemoveBackspace.mock.calls[0][0].trigger).toBe('backspace');

      const onRemoveClick = vi.fn();
      const { container: closeContainer } = getTagInputValueMount({}, { onRemove: onRemoveClick });
      fireEvent.click(closeContainer.querySelector('.t-tag__icon-close'));
      expect(onRemoveClick).toHaveBeenCalled();
      expect(onRemoveClick.mock.calls[0][0].trigger).toBe('tag-remove');
    });

    test('dragSort', () => {
      const defaultValue = ['Vue', 'React', 'Angular'];
      const onDragSort = vi.fn(() => {
        const tagBox = document.querySelectorAll('.t-input__prefix').item(0);
        const vueTag = document.querySelectorAll('.t-tag').item(0);
        const reactTag = document.querySelectorAll('.t-tag').item(1);
        const cloneReact = reactTag.cloneNode(true);
        tagBox.insertBefore(cloneReact, vueTag);
        tagBox.removeChild(reactTag);
      });
      const { container } = getTagInputValueMount({ dragSort: true, value: defaultValue }, { onDragSort });

      fireEvent.dragStart(container.querySelectorAll('.t-tag').item(1), {
        dataTransfer: {
          currentIndex: 1,
          targetIndex: 0,
        },
      });

      fireEvent.dragOver(container.querySelectorAll('.t-tag').item(0), {
        dataTransfer: {
          currentIndex: 1,
          targetIndex: 0,
        },
      });

      expect(container).toBeTruthy();
    });
  });
});
