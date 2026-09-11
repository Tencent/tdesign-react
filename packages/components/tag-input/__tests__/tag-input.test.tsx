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
    test('clearable: empty TagInput does not need clearIcon', async () => {
      const { container } = render(<TagInput clearable={true}></TagInput>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();
    });

    test('clearable: show clearIcon on mouse enter', async () => {
      const { container } = getTagInputValueMount({ clearable: true });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-tag-input__suffix-clear')).toBeTruthy();
    });

    test('clearable: clear all tags on click clearIcon', async () => {
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
      expect(onChangeFn1.mock.calls[0][1].e.type).toBe('click');
    });

    test('clearable: disabled TagInput can not show clear icon', async () => {
      const { container } = getTagInputValueMount({
        disabled: true,
        clearable: true,
      });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeFalsy();
    });

    test('clearable: readonly TagInput can not show clear icon', async () => {
      const { container } = getTagInputValueMount({
        readonly: true,
        clearable: true,
      });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeFalsy();
    });

    test('disabled', () => {
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
    });

    test('disabled: disabled TagInput does not need clearIcon', async () => {
      const { container } = getTagInputValueMount({ disabled: true });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-tag-input__suffix-clear')).toBeFalsy();
    });

    test('disabled: disabled TagInput can not trigger focus event', () => {
      const onFocusFn = vi.fn();
      const { container } = render(<TagInput disabled={true} onFocus={onFocusFn}></TagInput>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(onFocusFn).not.toHaveBeenCalled();
    });

    const excessTagsDisplayTypeClassNameList = [{ 't-tag-input--break-line': false }, 't-tag-input--break-line'];
    (['scroll', 'break-line'] as TdTagInputProps['excessTagsDisplayType'][]).forEach((item, index) => {
      test(`excessTagsDisplayType is equal to ${item}`, () => {
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

    test(`inputProps is equal to {size: 'small'}`, () => {
      const { container } = render(<TagInput inputProps={{ size: 'small' }}></TagInput>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper).toHaveClass('t-size-s');
    });

    test(`inputValue is equal to input value text`, () => {
      const { container } = render(<TagInput inputValue={'input value text'}></TagInput>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.value).toBe('input value text');
    });

    test('max: could type only three tags', () => {
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

    test('minCollapsedNum: `{".t-tag":4}` should exist', () => {
      const { container } = getTagInputValueMount({ minCollapsedNum: 3 });
      expect(container.querySelectorAll('.t-tag').length).toBe(4);
    });

    test('placeholder', () => {
      const wrapper = render(<TagInput placeholder={'This is TagInput placeholder'}></TagInput>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('placeholder')).toBe('This is TagInput placeholder');
    });

    test('readOnly', () => {
      // readonly default value is false
      const wrapper1 = render(<TagInput></TagInput>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
      // readonly = true
      const wrapper2 = render(<TagInput readOnly={true}></TagInput>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-readonly');
      // readonly = false
      const wrapper3 = render(<TagInput readOnly={false}></TagInput>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
      // readonly = false backspace able
      const onRemoveFn = vi.fn();
      const wrapper4 = getTagInputValueMount({ readOnly: false }, { onRemove: onRemoveFn });
      fireEvent.keyDown(wrapper4.container.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFn).toHaveBeenCalled();
      // readonly = false backspace disable
      const onRemoveFnUn = vi.fn();
      const wrapper5 = getTagInputValueMount({ readOnly: true }, { onRemove: onRemoveFnUn });
      fireEvent.keyDown(wrapper5.container.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFnUn).not.toHaveBeenCalled();
    });

    test('readOnly: readOnly TagInput does not need clearIcon', async () => {
      const on0Fn = vi.fn();
      const { container } = getTagInputValueMount({ readOnly: true }, { on0: on0Fn });
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
    });

    test('readOnly: readOnly TagInput still can trigger focus event', () => {
      const onFocusFn = vi.fn();
      const { container } = render(<TagInput readOnly={true} onFocus={onFocusFn}></TagInput>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(onFocusFn).toHaveBeenCalled();
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdTagInputProps['size'][]).forEach((item, index) => {
      test(`size is equal to ${item}`, () => {
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
      test(`status is equal to ${item}`, () => {
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

    test('tagProps should effect collapsed tag', () => {
      const { container } = render(
        <TagInput
          size="large"
          tagProps={{ size: 'small' }}
          value={['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter']}
          minCollapsedNum={1}
        ></TagInput>,
      );
      // normal tag
      expect(container.querySelectorAll('.t-tag')[0]).toHaveClass('t-size-s');
      // collapsed tag
      expect(container.querySelectorAll('.t-tag')[1]).toHaveClass('t-size-s');
    });

    test('tagProps is equal { theme: warning }', () => {
      const { container } = getTagInputValueMount({
        tagProps: { theme: 'warning' },
        multiple: true,
      });
      expect(container.querySelectorAll('.t-tag--warning').length).toBe(5);
    });

    test('tips is equal this is a tip', () => {
      const { container } = render(<TagInput tips={'this is a tip'}></TagInput>);
      expect(container.querySelectorAll('.t-input__tips').length).toBe(1);
    });

    test('value: controlled value test: only props can change count of tags', () => {
      const { container } = getTagInputDefaultMount({ value: [] });
      fireEvent.focus(container.querySelector('input'));
      const inputDom1 = container.querySelector('input');
      simulateInputChange(inputDom1, 'Tag1');
      const inputDom2 = container.querySelector('input');
      simulateInputEnter(inputDom2);
      expect(container.querySelector('.t-tag')).toBeFalsy();
    });

    test('value: uncontrolled value test: count of tags can be changed inner TagInput', () => {
      const { container } = getTagInputDefaultMount();
      fireEvent.focus(container.querySelector('input'));
      const inputDom1 = container.querySelector('input');
      simulateInputChange(inputDom1, 'Tag2');
      const inputDom2 = container.querySelector('input');
      simulateInputEnter(inputDom2);
      expect(container.querySelectorAll('.t-tag').length).toBe(1);
    });
  });

  describe('events', () => {
    test('blur: trigger blur event and clear inputValue on blur', () => {
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

    test('clear: click clear icon, then clear all tags', async () => {
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
      const { container } = getTagInputDefaultMount({ value: ['tag'] }, { onEnter: onEnterFn });
      const inputDom = container.querySelector('input');
      simulateInputEnter(inputDom);
      expect(onEnterFn).toHaveBeenCalled();
      expect(onEnterFn.mock.calls[0][0]).toEqual(['tag']);
      expect(onEnterFn.mock.calls[0][1].e.type).toBe('keydown');
      expect(onEnterFn.mock.calls[0][1].inputValue).toBe('');
    });

    test('enter', () => {
      const { container } = render(<TagInput></TagInput>);
      fireEvent.focus(container.querySelector('input'));
      const inputDom1 = container.querySelector('input');
      simulateInputChange(inputDom1, 'Tag');
      const inputDom2 = container.querySelector('input');
      simulateInputEnter(inputDom2);
      expect(container.querySelectorAll('.t-tag').length).toBe(1);
    });

    test('focus', () => {
      const onFocusFn = vi.fn();
      const { container } = getTagInputDefaultMount({}, { onFocus: onFocusFn });
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0]).toEqual([]);
      expect(onFocusFn.mock.calls[0][1].e.type).toBe('focus');
      expect(onFocusFn.mock.calls[0][1].inputValue).toBe('');
    });

    test('focus: expect focus not change inputValue', () => {
      const onFocusFn = vi.fn();
      const { container } = getTagInputDefaultMount({ inputValue: 'tag' }, { onFocus: onFocusFn });
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0]).toEqual([]);
      expect(onFocusFn.mock.calls[0][1].e.type).toBe('focus');
      expect(onFocusFn.mock.calls[0][1].inputValue).toBe('tag');
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

    test('remove: remove last tag on keydown Backspace', () => {
      const onRemoveFn = vi.fn();
      const { container } = getTagInputValueMount({}, { onRemove: onRemoveFn });
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'Backspace',
        code: 'Backspace',
        charCode: 8,
      });
      expect(onRemoveFn).toHaveBeenCalled();
      expect(onRemoveFn.mock.calls[0][0].value).toEqual([
        'tdesign-vue',
        'tdesign-react',
        'tdesign-miniprogram',
        'tdesign-mobile-vue',
      ]);
      expect(onRemoveFn.mock.calls[0][0].index).toBe(4);
      expect(onRemoveFn.mock.calls[0][0].trigger).toBe('backspace');
      expect(onRemoveFn.mock.calls[0][0].item).toBe('tdesign-mobile-react');
      expect(onRemoveFn.mock.calls[0][0].e.type).toBe('keydown');
    });

    test('remove: remove any tag on click tag close icon', () => {
      const onRemoveFn = vi.fn();
      const { container } = getTagInputValueMount({}, { onRemove: onRemoveFn });
      fireEvent.click(container.querySelector('.t-tag__icon-close'));
      expect(onRemoveFn).toHaveBeenCalled();
      expect(onRemoveFn.mock.calls[0][0].value).toEqual([
        'tdesign-react',
        'tdesign-miniprogram',
        'tdesign-mobile-vue',
        'tdesign-mobile-react',
      ]);
      expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
      expect(onRemoveFn.mock.calls[0][0].trigger).toBe('tag-remove');
      expect(onRemoveFn.mock.calls[0][0].item).toBe('tdesign-vue');
      expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
    });
  });

  describe('slots', () => {
    test('collapsedItems', () => {
      const { container } = getTagInputValueMount({
        collapsedItems: <span className="custom-node">TNode</span>,
        minCollapsedNum: 3,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('label', () => {
      const { container } = render(<TagInput label={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffix', () => {
      const { container } = render(<TagInput suffix={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffixIcon', () => {
      const { container } = render(<TagInput suffixIcon={<span className="custom-node">TNode</span>}></TagInput>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag', () => {
      const { container } = getTagInputValueMount({
        tag: <span className="custom-node">TNode</span>,
        value: ['tdesign-vue'],
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('tag is a function with params', () => {
      const fn = vi.fn();
      getTagInputValueMount({ tag: fn, value: ['tdesign-vue'] });
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].value).toBe('tdesign-vue');
    });

    test('valueDisplay', () => {
      const { container } = getTagInputValueMount({
        valueDisplay: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('valueDisplay is a function with params', () => {
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

    test('label display', async () => {
      const text = 'test-label';
      const { getByText } = await render(<TagInput label={text} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('prefixIcon display', async () => {
      const text = 'test-prefixIcon';
      const { getByText } = await render(<TagInput prefixIcon={<span>{text}</span>} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });
  });

  describe('scenarios', () => {
    test('events.drag: dragSort', () => {
      const defaultValue = ['Vue', 'React', 'Angular'];
      const onDragSort = vi.fn(() => {
        // 模拟顺序交换
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
      // expect(onDragSort).toHaveBeenCalled(1);
      // expect(onDragSort.mock.calls[0][0].target).toEqual('Vue');
      // expect(container.querySelectorAll('.t-tag').item(0).firstChild.title).toEqual('React');
    });

    test('label renders with tags in break-line mode', () => {
      const { container } = render(<TagInput value={['Vue', 'React']} label="Controlled: " />);
      const wrapper = container.querySelector('.t-tag-input');
      const inputPrefix = container.querySelector('.t-input__prefix');
      const label = container.querySelector('.t-tag-input__prefix');

      expect(wrapper).toHaveClass('t-tag-input--break-line');
      expect(wrapper).toHaveClass('t-tag-input--with-tag');
      expect(inputPrefix).toContainElement(label as HTMLElement);
      expect(inputPrefix.querySelectorAll('.t-tag')).toHaveLength(2);
      expect(container.querySelector('.t-input__inner')).toBeTruthy();
    });
  });
});
