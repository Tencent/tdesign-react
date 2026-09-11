import React from 'react';
import { act, fireEvent, mockDelay, render, simulateInputChange, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';

import { Input } from '..';

import type { TdInputProps } from '../type';

const InputPlaceholder = '请输入内容';
const InputValue = '24/05/2020';

describe('Input', () => {
  describe('props', () => {
    const alignClassNameList = [{ 't-align-left': false }, 't-align-center', 't-align-right'];
    (['left', 'center', 'right'] as TdInputProps['align'][]).forEach((item, index) => {
      test(`align is equal to ${item}`, () => {
        const wrapper = render(<Input align={item}></Input>);
        const container = wrapper.container.querySelector('.t-input');
        if (typeof alignClassNameList[index] === 'string') {
          expect(container).toHaveClass(alignClassNameList[index]);
        } else if (typeof alignClassNameList[index] === 'object') {
          const classNameKey = Object.keys(alignClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    test('allowInputOverMax', () => {
      const { container } = render(<Input value="Hello" maxlength={5} allowInputOverMax={true}></Input>);
      const inputDom = container.querySelector('input');
      simulateInputChange(inputDom, 'Hello TDesign');
      const attrDom = container.querySelector('input');
      expect(attrDom.value).toBe('Hello');
    });

    test('autocomplete', () => {
      const wrapper = render(<Input autocomplete="https://tdesign.tencent.com/"></Input>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('autocomplete')).toBe('https://tdesign.tencent.com/');
    });

    test(`autofocus is equal to false`, () => {
      const { container } = render(<Input autofocus={false}></Input>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('autofocus')).toBeNull();
    });

    test(`autofocus is equal to true`, () => {
      const { container } = render(<Input autofocus={true}></Input>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('autofocus')).toBeDefined();
    });

    test('clearable: clear icon should exist on input mouseenter', async () => {
      const { container } = render(<Input value="Default Keyword" clearable={true}></Input>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });

    test('clearable: click clear icon could clear input value to be empty', async () => {
      const onClearFn1 = vi.fn();
      const onChangeFn1 = vi.fn();
      const { container } = render(
        <Input value="Default Keyword" clearable={true} onClear={onClearFn1} onChange={onChangeFn1}></Input>,
      );
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay(300);
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect(onClearFn1).toHaveBeenCalled();
      expect(onClearFn1.mock.calls[0][0].e.stopPropagation).toBeTruthy();
      expect(onClearFn1.mock.calls[0][0].e.type).toBe('click');
      expect(onChangeFn1).toHaveBeenCalled();
      expect(onChangeFn1.mock.calls[0][0]).toBe('');
      expect(onChangeFn1.mock.calls[0][1].e.stopPropagation).toBeTruthy();
      expect(onChangeFn1.mock.calls[0][1].e.type).toBe('click');
    });

    test('clearable: type=password, browseIcon and clearableIcon', async () => {
      const { container } = render(<Input type="password" value="this is my password" clearable={true}></Input>);
      expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay(300);
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });

    test('disabled', () => {
      // disabled default value is
      const wrapper1 = render(<Input></Input>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const wrapper2 = render(<Input disabled={true}></Input>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-disabled');
      // disabled = false
      const wrapper3 = render(<Input disabled={false}></Input>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
    });

    test('format: focus and blur states have different value', () => {
      const { container } = render(<Input format={(val) => `${val} 元`} value="100"></Input>);
      fireEvent.focus(container.querySelector('input'));
      const attrDom = container.querySelector('input');
      expect(attrDom.value).toBe('100');
      fireEvent.blur(container.querySelector('input'));
      const attrDom1 = container.querySelector('input');
      expect(attrDom1.value).toBe('100 元');
    });

    test(`inputClass is equal to name1 name2`, () => {
      const { container } = render(<Input inputClass="name1 name2"></Input>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper).toHaveClass('name1');
      expect(domWrapper).toHaveClass('name2');
    });

    test(`inputClass is equal to ['name1', 'name2']`, () => {
      const { container } = render(<Input inputClass={['name1', 'name2']}></Input>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper).toHaveClass('name1');
      expect(domWrapper).toHaveClass('name2');
    });

    test(`inputClass is equal to { name1: true, name2: false }`, () => {
      const { container } = render(<Input inputClass={{ name1: true, name2: false }}></Input>);
      const domWrapper = container.querySelector('.t-input');
      expect(domWrapper).toHaveClass('name1');
      expect(domWrapper.classList.contains('name2')).toBeFalsy();
    });

    test('maxcharacter: length of value is over than maxcharacter', () => {
      const onChangeFn = vi.fn();
      render(<Input value="你好 TDesign" maxcharacter={4} onChange={onChangeFn}></Input>);
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe('你好');
      expect(onChangeFn.mock.calls[0][1].trigger).toBe('initial');
    });

    test('maxlength: length of value is over than maxlength', () => {
      const onChangeFn = vi.fn();
      render(<Input value="Hello TDesign" maxlength={5} onChange={onChangeFn}></Input>);
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe('Hello');
      expect(onChangeFn.mock.calls[0][1].trigger).toBe('initial');
    });

    test('name', () => {
      const wrapper = render(<Input name="input-name"></Input>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('name')).toBe('input-name');
    });

    test('placeholder', () => {
      const wrapper = render(<Input placeholder="this is input placeholder"></Input>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('placeholder')).toBe('this is input placeholder');
    });

    test('readonly', () => {
      // readonly default value is false
      const wrapper1 = render(<Input></Input>);
      const container1 = wrapper1.container.querySelector('.t-input');
      expect(container1.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
      // readonly = true
      const wrapper2 = render(<Input readOnly={true}></Input>);
      const container2 = wrapper2.container.querySelector('.t-input');
      expect(container2).toHaveClass('t-is-readonly');
      // readonly = false
      const wrapper3 = render(<Input readOnly={false}></Input>);
      const container3 = wrapper3.container.querySelector('.t-input');
      expect(container3.querySelector(`.${'t-is-readonly'}`)).toBeFalsy();
    });

    test('showClearIconOnEmpty', async () => {
      const { container } = render(<Input showClearIconOnEmpty={true}></Input>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(container.querySelector('.t-input__suffix-clear')).toBeTruthy();
    });

    test('showLimitNumber: `{".t-input__limit-number":{"text":"2/5"}}` should exist', () => {
      const { container } = render(<Input showLimitNumber={true} maxlength={5} value="TD"></Input>);
      expect(container.querySelector('.t-input__limit-number').textContent).toBe('2/5');
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdInputProps['size'][]).forEach((item, index) => {
      test(`size is equal to ${item}`, () => {
        const wrapper = render(<Input size={item}></Input>);
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
    (['default', 'success', 'warning', 'error'] as TdInputProps['status'][]).forEach((item, index) => {
      test(`status is equal to ${item}`, () => {
        const wrapper = render(<Input status={item}></Input>);
        const container = wrapper.container.querySelector('.t-input');
        if (typeof statusClassNameList[index] === 'string') {
          expect(container).toHaveClass(statusClassNameList[index]);
        } else if (typeof statusClassNameList[index] === 'object') {
          const classNameKey = Object.keys(statusClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    test('tips is equal this is a tip', () => {
      const { container } = render(<Input tips="this is a tip"></Input>);
      expect(container.querySelectorAll('.t-input__tips').length).toBe(1);
    });

    const attributeValues = ['text', 'number', 'url', 'tel', 'password', 'search', 'submit', 'hidden'];
    (['text', 'number', 'url', 'tel', 'password', 'search', 'submit', 'hidden'] as TdInputProps['type'][]).forEach(
      (item, index) => {
        test(`type is equal to ${item}`, () => {
          const wrapper = render(<Input type={item}></Input>);
          const container = wrapper.container.querySelector('input');
          expect(container.getAttribute('type')).toBe(attributeValues[index]);
        });
      },
    );

    test('type is equal password', () => {
      const { container } = render(<Input type="password"></Input>);
      expect(container.querySelectorAll('.t-icon-browse-off').length).toBe(1);
    });

    test('type: password could be visible by click browse icon', () => {
      const { container } = render(<Input type="password"></Input>);
      fireEvent.click(container.querySelector('.t-icon-browse-off'));
      expect(container.querySelector('.t-icon-browse')).toBeTruthy();
      const attrDom = container.querySelector('input');
      expect(attrDom.getAttribute('type')).toBe('text');
      fireEvent.click(container.querySelector('.t-icon-browse'));
      expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
      const attrDom1 = container.querySelector('input');
      expect(attrDom1.getAttribute('type')).toBe('password');
    });

    test('disabled', async () => {
      const changeFn = vi.fn();
      const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} disabled onChange={changeFn} />);
      expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).disabled).toBeTruthy();
    });
    test('status', async () => {
      const { container } = render(<Input placeholder={InputPlaceholder} status="error" />);
      expect(container.children[0].children[0].classList.contains('t-is-error')).toBeTruthy();
    });
    test('size', async () => {
      const { container } = render(<Input placeholder={InputPlaceholder} size="large" />);
      expect(container.children[0].children[0].classList.contains('t-size-l')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('blur', async () => {
      const onFocusFn = vi.fn();
      const onBlurFn1 = vi.fn();
      const { container } = render(<Input value="initial-input-value" onFocus={onFocusFn} onBlur={onBlurFn1}></Input>);
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0]).toBe('initial-input-value');
      expect(onFocusFn.mock.calls[0][1].e.type).toBe('focus');
      fireEvent.blur(container.querySelector('input'));
      await mockDelay(300);
      expect(onBlurFn1).toHaveBeenCalled();
      expect(onBlurFn1.mock.calls[0][0]).toBe('initial-input-value');
      expect(onBlurFn1.mock.calls[0][1].e.type).toBe('blur');
    });

    test('change: empty value could trigger change event', () => {
      const onChangeFn = vi.fn();
      const { container } = render(<Input onChange={onChangeFn}></Input>);
      const inputDom = container.querySelector('input');
      simulateInputChange(inputDom, 'initial value');
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe('initial value');
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('change');
    });

    test('change: controlled value test', () => {
      const onChangeFn = vi.fn();
      const { container } = render(<Input value="TDesign" onChange={onChangeFn}></Input>);
      const inputDom = container.querySelector('input');
      simulateInputChange(inputDom, 'Hello TDesign');
      const attrDom = container.querySelector('input');
      expect(attrDom.value).toBe('TDesign');
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe('Hello TDesign');
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('change');
    });

    test('change: uncontrolled value test', () => {
      const onChangeFn = vi.fn();
      const { container } = render(<Input defaultValue="Hello" onChange={onChangeFn}></Input>);
      const inputDom = container.querySelector('input');
      simulateInputChange(inputDom, 'Hello TDesign');
      const attrDom = container.querySelector('input');
      expect(attrDom.value).toBe('Hello TDesign');
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe('Hello TDesign');
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('change');
    });

    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<Input onClick={fn}></Input>);
      fireEvent.click(container.querySelector('.t-input'));
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });

    test('compositionend', () => {
      const onCompositionendFn = vi.fn();
      const { container } = render(<Input value="输入结束" onCompositionend={onCompositionendFn}></Input>);
      fireEvent.compositionEnd(container.querySelector('input'));
      expect(onCompositionendFn).toHaveBeenCalled();
      expect(onCompositionendFn.mock.calls[0][0]).toBe('输入结束');
      expect(onCompositionendFn.mock.calls[0][1].e.type).toBe('compositionend');
    });

    test('compositionstart', () => {
      const onCompositionstartFn = vi.fn();
      const { container } = render(<Input value="输入开始" onCompositionstart={onCompositionstartFn}></Input>);
      fireEvent.compositionStart(container.querySelector('input'));
      expect(onCompositionstartFn).toHaveBeenCalled();
      expect(onCompositionstartFn.mock.calls[0][0]).toBe('输入开始');
      expect(onCompositionstartFn.mock.calls[0][1].e.type).toBe('compositionstart');
    });

    test('enter', () => {
      const onEnterFn1 = vi.fn();
      const { container } = render(<Input value="text" onEnter={onEnterFn1}></Input>);
      fireEvent.focus(container.querySelector('input'));
      fireEvent.keyDown(container.querySelector('input'), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
      expect(onEnterFn1).toHaveBeenCalled();
      expect(onEnterFn1.mock.calls[0][0]).toBe('text');
      expect(onEnterFn1.mock.calls[0][1].e.type).toBe('keydown');
    });

    test('focus', () => {
      const onFocusFn = vi.fn();
      const { container } = render(<Input onFocus={onFocusFn}></Input>);
      fireEvent.focus(container.querySelector('input'));
      expect(onFocusFn).toHaveBeenCalled();
      expect(onFocusFn.mock.calls[0][0]).toBe('');
      expect(onFocusFn.mock.calls[0][1].e.type).toBe('focus');
    });

    test('keydown', () => {
      const onKeydownFn = vi.fn();
      const { container } = render(<Input value="text" onKeydown={onKeydownFn}></Input>);
      fireEvent.keyDown(container.querySelector('input'));
      expect(onKeydownFn).toHaveBeenCalled();
      expect(onKeydownFn.mock.calls[0][0]).toBe('text');
      expect(onKeydownFn.mock.calls[0][1].e.type).toBe('keydown');
    });

    test('keypress', () => {
      const onKeydownFn = vi.fn();
      const { container } = render(<Input value="text" onKeydown={onKeydownFn}></Input>);
      fireEvent.keyDown(container.querySelector('input'));
      expect(onKeydownFn).toHaveBeenCalled();
      expect(onKeydownFn.mock.calls[0][0]).toBe('text');
      expect(onKeydownFn.mock.calls[0][1].e.type).toBe('keydown');
    });

    test('keyup', () => {
      const onKeyupFn = vi.fn();
      const { container } = render(<Input value="text" onKeyup={onKeyupFn}></Input>);
      fireEvent.keyUp(container.querySelector('input'));
      expect(onKeyupFn).toHaveBeenCalled();
      expect(onKeyupFn.mock.calls[0][0]).toBe('text');
      expect(onKeyupFn.mock.calls[0][1].e.type).toBe('keyup');
    });

    test('mouseenter', async () => {
      const onMouseenterFn = vi.fn();
      const { container } = render(<Input onMouseenter={onMouseenterFn}></Input>);
      fireEvent.mouseEnter(container.querySelector('.t-input'));
      await mockDelay();
      expect(onMouseenterFn).toHaveBeenCalled();
      expect(onMouseenterFn.mock.calls[0][0].e.type).toBe('mouseenter');
    });

    test('mouseleave', async () => {
      const onMouseleaveFn = vi.fn();
      const { container } = render(<Input onMouseleave={onMouseleaveFn}></Input>);
      fireEvent.mouseLeave(container.querySelector('.t-input'));
      await mockDelay();
      expect(onMouseleaveFn).toHaveBeenCalled();
      expect(onMouseleaveFn.mock.calls[0][0].e.type).toBe('mouseleave');
    });

    test('paste', () => {
      const onPasteFn = vi.fn();
      const { container } = render(<Input onPaste={onPasteFn}></Input>);
      fireEvent.paste(container.querySelector('input'));
      expect(onPasteFn).toHaveBeenCalled();
      expect(onPasteFn.mock.calls[0][0].e.type).toBe('paste');
    });

    test('validate', () => {
      const onValidateFn = vi.fn();
      render(<Input value="Hello World" maxlength={5} onValidate={onValidateFn}></Input>);
      expect(onValidateFn).toHaveBeenCalled();
      expect(onValidateFn.mock.calls[0][0].error).toBe('exceed-maximum');
    });

    test('wheel', () => {
      const onWheelFn = vi.fn();
      const { container } = render(<Input onWheel={onWheelFn}></Input>);
      fireEvent.wheel(container.querySelector('input'));
      expect(onWheelFn).toHaveBeenCalled();
      expect(onWheelFn.mock.calls[0][0].e.type).toBe('wheel');
    });

    test('onComposition can be call', async () => {
      const user = userEvent.setup();
      const onCompositionStartFn = vi.fn();
      const onCompositionEndFn = vi.fn();
      const { queryByPlaceholderText } = render(
        <Input
          placeholder={InputPlaceholder}
          onCompositionstart={onCompositionStartFn}
          onCompositionend={onCompositionEndFn}
        />,
      );
      const InputDom = queryByPlaceholderText(InputPlaceholder) as HTMLInputElement;
      await user.type(InputDom, InputValue);
      fireEvent.compositionStart(InputDom);
      await user.type(InputDom, InputValue);
      fireEvent.compositionEnd(InputDom);
      fireEvent.compositionEnd(InputDom);
      await user.type(InputDom, InputValue);
      expect(onCompositionStartFn).toHaveBeenCalled();
      expect(onCompositionEndFn).toHaveBeenCalled();
      expect(InputDom.value).toBe([InputValue, InputValue, InputValue].join(''));
    });

    test('keyDown', async () => {
      const user = userEvent.setup();
      const onEnterFn = vi.fn();
      const onKeydownFn = vi.fn();
      const { queryByPlaceholderText } = render(
        <Input placeholder={InputPlaceholder} onEnter={onEnterFn} onKeydown={onKeydownFn} />,
      );
      const InputDom = queryByPlaceholderText(InputPlaceholder);
      await user.type(InputDom, 'abc{enter}');
      expect(onEnterFn).toHaveBeenCalled();
      expect(onKeydownFn).toHaveBeenCalled();
    });
  });

  describe('slots', () => {
    test('label', () => {
      const { container } = render(<Input label={<span className="custom-node">TNode</span>}></Input>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-input__prefix')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('prefixIcon', () => {
      const { container } = render(<Input prefixIcon={<span className="custom-node">TNode</span>}></Input>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-input__prefix-icon')).toBeTruthy();
    });

    test('suffix', () => {
      const { container } = render(<Input suffix={<span className="custom-node">TNode</span>}></Input>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-input__suffix')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('suffixIcon', () => {
      const { container } = render(<Input suffixIcon={<span className="custom-node">TNode</span>}></Input>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-input__suffix-icon')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('label display', async () => {
      const text = 'test-label';
      const { getByText } = await render(<Input label={text} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });

    test('prefixIcon display', async () => {
      const text = 'test-prefixIcon';
      const { getByText } = await render(<Input prefixIcon={<span>{text}</span>} />);

      act(() => {
        expect(getByText(text)).toBeTruthy();
      });
    });
  });

  describe('scenarios', () => {
    test('create', async () => {
      const changeFn = vi.fn();
      const { container, queryByPlaceholderText } = render(
        <Input placeholder={InputPlaceholder} onChange={changeFn} />,
      );
      expect(container.children[0].children[0].classList.contains('t-input')).toBeTruthy();
      expect(queryByPlaceholderText(InputPlaceholder)).toBeInTheDocument();
      fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
        target: { value: InputValue },
      });
      expect(changeFn).toHaveBeenCalledTimes(1);
      expect(changeFn.mock.calls[0][0]).toBe(InputValue);
    });
    test('clearable', async () => {
      const clearFn = vi.fn();
      const { queryByPlaceholderText, container } = render(
        <Input placeholder={InputPlaceholder} clearable onClear={clearFn} />,
      );
      fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
        target: { value: InputValue },
      });
      expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).value).toEqual(InputValue);
      fireEvent.mouseEnter(container.firstChild.firstChild);
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).value).toEqual('');
    });
    test('clearable can not work when mouseLeave', async () => {
      const { queryByPlaceholderText, container } = render(<Input placeholder={InputPlaceholder} clearable />);
      fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
        target: { value: InputValue },
      });
      fireEvent.mouseEnter(container.firstChild.firstChild);
      expect(container.querySelector('.t-input__suffix-clear')).toBeInTheDocument();
      fireEvent.mouseLeave(container.firstChild.firstChild);
      expect(container.querySelector('.t-input__suffix-clear')).not.toBeInTheDocument();
    });
    test('should not lost focus when clear input', async () => {
      const blurFn = vi.fn();
      const { queryByPlaceholderText, container } = render(
        <Input placeholder={InputPlaceholder} clearable onBlur={blurFn} />,
      );
      const InputDom = queryByPlaceholderText(InputPlaceholder);
      fireEvent.change(InputDom, { target: { value: InputValue } });
      fireEvent.mouseEnter(container.firstChild.firstChild);
      const clearIcon = container.querySelector('.t-input__suffix-clear');
      fireEvent.mouseDown(clearIcon);
      fireEvent.mouseUp(clearIcon);
      fireEvent.click(clearIcon);
      expect(blurFn).toHaveBeenCalledTimes(0);
      fireEvent.blur(InputDom);
      expect(blurFn).toHaveBeenCalledTimes(1);
    });
    test('composing value should not be kept when value is reset by outside', async () => {
      // 模拟中文输入法的一次合成输入
      const imeInput = (input: HTMLInputElement, value: string) => {
        fireEvent.compositionStart(input, { target: { value: input.value } });
        fireEvent.change(input, { target: { value } });
        fireEvent.compositionEnd(input, { target: { value } });
      };

      const ControlledInput = () => {
        const [value, setValue] = React.useState('');
        const [, setCompositionCount] = React.useState(0);
        return (
          <>
            <Input
              placeholder={InputPlaceholder}
              value={value}
              onChange={(v) => setValue(v as string)}
              // 开始合成时触发重渲染，复现 SelectInput 的 setIsTyping 更新。
              onCompositionstart={() => setCompositionCount((count) => count + 1)}
            />
            <button type="button" onClick={() => setValue('')}>
              reset
            </button>
          </>
        );
      };
      const { queryByPlaceholderText, getByText } = render(<ControlledInput />);
      const InputDom = queryByPlaceholderText(InputPlaceholder) as HTMLInputElement;

      imeInput(InputDom, '苹');
      expect(InputDom.value).toBe('苹');

      // 外部清空输入框内容后，再次进入合成态不应残留上一次的输入
      fireEvent.click(getByText('reset'));
      expect(InputDom.value).toBe('');

      fireEvent.compositionStart(InputDom, {
        target: { value: InputDom.value },
      });
      expect(InputDom.value).toBe('');

      fireEvent.change(InputDom, { target: { value: 'xiang' } });
      fireEvent.compositionEnd(InputDom, { target: { value: '香' } });
      expect(InputDom.value).toBe('香');
    });
    test('password', async () => {
      const { queryByPlaceholderText, container } = render(<Input placeholder={InputPlaceholder} type="password" />);
      expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).type).toEqual('password');

      expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect(container.querySelector('.t-icon-browse')).toBeTruthy();
    });
    test('password can be toggle when disabled', async () => {
      const { container } = render(<Input placeholder={InputPlaceholder} type="password" disabled />);

      expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
      fireEvent.click(container.querySelector('.t-input__suffix-clear'));
      expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
    });
  });
});
