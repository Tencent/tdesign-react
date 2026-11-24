import React from 'react';
import { describe, expect, vi, it, cleanup } from '@test/utils';
import { render, fireEvent, screen, createEvent } from '@testing-library/react';

import Search from '../index';

const getSearch = () => screen.getByRole('searchbox');
const getActionBtn = () => screen.queryByText('搜索');
const prefix = 't';
const name = `.${prefix}-search`;

describe('Search', () => {
  describe('props', () => {
    it(': leftIcon', () => {
      const CustomSuffix = () => <span data-testid="custom-suffix">✓</span>;
      render(<Search leftIcon={<CustomSuffix />} />);
      expect(screen.getByTestId('custom-suffix')).toBeInTheDocument();
      cleanup();

      const { container } = render(<Search leftIcon="search" />);
      expect(container.querySelector('.t-search__input-box .t-icon')).toBeTruthy();
      cleanup();

      // leftIcon 为 null 时不渲染左侧图标
      const { container: container2 } = render(<Search leftIcon={null} />);
      expect(container2.querySelector('.t-search__input-box .t-icon')).toBeFalsy();
    });

    it(': clearable', () => {
      const { container } = render(<Search clearable value="test" />);
      expect(container.querySelector(`${name}__clear`)).toBeTruthy();
      cleanup();

      // clearable 为 false 时即使有值也不展示清除按钮
      const { container: container2 } = render(<Search clearable={false} value="test" />);
      expect(container2.querySelector(`${name}__clear`)).toBeFalsy();
      cleanup();

      // 没有值时不展示清除按钮
      const { container: container3 } = render(<Search clearable value="" />);
      expect(container3.querySelector(`${name}__clear`)).toBeFalsy();
    });

    it(': clearTrigger', () => {
      // clearTrigger=always 时，未聚焦也展示清除按钮
      const { container } = render(<Search clearable clearTrigger="always" value="test" />);
      expect(container.querySelector(`${name}__clear`)).toBeTruthy();
      cleanup();

      // clearTrigger=focus 时，未聚焦不展示清除按钮
      const { container: container2 } = render(<Search clearable clearTrigger="focus" value="test" />);
      expect(container2.querySelector(`${name}__clear`)).toBeFalsy();

      // clearTrigger=focus 时，聚焦后展示清除按钮
      fireEvent.focus(getSearch());
      expect(container2.querySelector(`${name}__clear`)).toBeTruthy();
    });

    it(': action', () => {
      const { rerender } = render(<Search action="搜索" />);
      // action 仅在有值时展示
      rerender(<Search action="搜索" value="test" />);
      expect(screen.getByText('搜索').parentElement).toBeInTheDocument();
      rerender(<Search action="搜索" value="" />);
      expect(getActionBtn()).not.toBeInTheDocument();
      rerender(<Search value="test" />);
      expect(getActionBtn()).not.toBeInTheDocument();
      cleanup();

      // action 支持 TNode
      const CustomAction = () => <span data-testid="custom-action">提交</span>;
      render(<Search action={<CustomAction />} value="test" />);
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it(': center', () => {
      const { container } = render(<Search center />);
      expect(container.querySelector(`${name}--center`)).toBeTruthy();
      cleanup();

      const { container: container2 } = render(<Search center={false} />);
      expect(container2.querySelector(`${name}--center`)).toBeFalsy();
    });

    it(': cursorColor', () => {
      const { container } = render(<Search cursorColor="#ff0000" />);
      const input = container.querySelector('input');
      expect(input?.getAttribute('style')).toContain('--td-search-cursor-color');
      expect(input?.getAttribute('style')).toContain('#ff0000');
      cleanup();

      // 未传入时不应有 style
      const { container: container2 } = render(<Search cursorColor={undefined as unknown as string} />);
      const input2 = container2.querySelector('input');
      expect(input2?.getAttribute('style')).toBeFalsy();
    });

    it(': disabled', () => {
      render(<Search disabled />);
      expect(getSearch()).toBeDisabled();
      expect(getActionBtn()).not.toBeInTheDocument();
      cleanup();

      render(<Search disabled value="test" clearable />);
      expect(getSearch()).toBeDisabled();
    });

    it(': focus', () => {
      render(<Search focus />);
      expect(getSearch()).toHaveFocus();

      cleanup();
      render(<Search focus={false} />);
      expect(getSearch()).not.toHaveFocus();
    });

    it(': placeholder', () => {
      const customPlaceholder = '自定义占位符';
      render(<Search placeholder={customPlaceholder} />);
      expect(getSearch()).toHaveAttribute('placeholder', customPlaceholder);
    });

    it(': maxlength', () => {
      const { container } = render(<Search maxlength={5} />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.maxLength).toBe(5);

      fireEvent.input(input, { target: { value: '123456' } });
      expect(input).toHaveValue('12345');
    });

    it(': maxcharacter', () => {
      render(<Search maxcharacter={5} />);
      const input = getSearch();
      // a(1) b(1) 中(2) d(1) => 5，e 超出后被截断
      fireEvent.input(input, { target: { value: 'ab中de' } });
      expect(input).toHaveValue('ab中d');
      // maxcharacter 时不透传原生 maxlength
      expect(input).not.toHaveAttribute('maxlength');
    });

    it(': readonly', () => {
      const { container } = render(<Search readonly />);
      expect(container.querySelector(`${name}__input-box`)).toBeTruthy();
      expect(getSearch()).toHaveAttribute('readonly');
    });

    it(': shape', () => {
      const shapes = ['square', 'round'] as const;
      shapes.forEach((shape) => {
        const { container } = render(<Search shape={shape} />);
        expect(container.querySelector(`${name}__input-box--${shape}`)).toBeTruthy();
        cleanup();
      });
    });

    it(': value', () => {
      render(<Search value="search" />);
      expect(getSearch()).toHaveValue('search');
    });

    it(': defaultValue', () => {
      // 非受控模式下传入 defaultValue 不应抛错，组件可正常渲染
      const { container } = render(<Search defaultValue="new" />);
      expect(container.querySelector('.t-search')).not.toBe(null);
    });

    it(': resultList', () => {
      // 初始未聚焦输入时不展示联想词
      const { container } = render(<Search resultList={['apple', 'banana']} value="ap" />);
      expect(container.querySelector(`${name}__result-list`)).toBeFalsy();

      // 输入后展示联想词列表
      fireEvent.input(getSearch(), { target: { value: 'ap' } });
      expect(container.querySelector(`${name}__result-list`)).toBeTruthy();
      expect(container.querySelectorAll(`${name}__result-item`).length).toBe(2);

      // 高亮匹配的关键字
      expect(container.querySelector(`${name}__result-item--highLight`)).toBeTruthy();
      cleanup();

      // resultList 为空数组时不展示
      const { container: container2 } = render(<Search resultList={[]} value="ap" />);
      fireEvent.input(getSearch(), { target: { value: 'ap' } });
      expect(container2.querySelector(`${name}__result-list`)).toBeFalsy();
      cleanup();

      // 未传入 resultList 不展示
      const { container: container3 } = render(<Search value="ap" />);
      fireEvent.input(getSearch(), { target: { value: 'ap' } });
      expect(container3.querySelector(`${name}__result-list`)).toBeFalsy();
    });
  });

  describe('event', () => {
    it(': onActionClick', () => {
      const handleActionClick = vi.fn();
      render(<Search action="搜索" value="test" onActionClick={handleActionClick} />);
      fireEvent.click(screen.getByText('搜索'));
      expect(handleActionClick).toHaveBeenCalledTimes(1);
      expect(handleActionClick).toHaveBeenCalledWith({ e: expect.anything() });
    });

    it(': onBlur', () => {
      const handleBlur = vi.fn();
      render(<Search value="abc" onBlur={handleBlur} />);
      const search = getSearch();
      fireEvent.focus(search);
      fireEvent.blur(search);
      expect(handleBlur).toHaveBeenCalledTimes(1);
      expect(handleBlur).toHaveBeenCalledWith({ value: 'abc', e: expect.anything() });
    });

    it(': onClear', () => {
      const handleClear = vi.fn();
      const handleChange = vi.fn();
      const { container } = render(<Search clearable value="test" onClear={handleClear} onChange={handleChange} />);
      fireEvent.click(container.querySelector(`${name}__clear`) as HTMLElement);
      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(handleClear).toHaveBeenCalledWith({ e: expect.anything() });
      // clear 也应触发 onChange，且 trigger 为 'clear'
      expect(handleChange).toHaveBeenCalledWith('', expect.objectContaining({ trigger: 'clear' }));
    });

    it(': onFocus', () => {
      const handleFocus = vi.fn();
      render(<Search value="hi" onFocus={handleFocus} />);
      fireEvent.focus(getSearch());
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(handleFocus).toHaveBeenCalledWith({ value: 'hi', e: expect.anything() });
    });

    it(': onChange', () => {
      const handleChange = vi.fn();
      render(<Search value="10" onChange={handleChange} />);
      const search = getSearch();
      fireEvent.input(search, { target: { value: '20' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('20', expect.objectContaining({ trigger: 'input-change' }));
    });

    it(': onChange 在合成输入(compositionEnd)结束后触发', () => {
      const handleChange = vi.fn();
      render(<Search onChange={handleChange} />);
      const search = getSearch();
      fireEvent.compositionStart(search, { target: { value: '' } });
      // 合成输入结束后应触发 onChange
      fireEvent.compositionEnd(search, { target: { value: '你好' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('你好', expect.objectContaining({ trigger: 'input-change' }));
    });

    it(': 中文合成输入过程中(insertCompositionText)不应触发 onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(<Search resultList={['a', 'b']} onChange={handleChange} />);
      const search = getSearch();

      fireEvent.compositionStart(search, { target: { value: '' } });
      // 构造一个 inputType=insertCompositionText 的 InputEvent，模拟中文输入过程
      const inputEvent = createEvent.input(search, { inputType: 'insertCompositionText', target: { value: '中' } });
      fireEvent(search, inputEvent);

      // 中文合成过程中不应该触发 onChange
      expect(handleChange).not.toHaveBeenCalled();
      // 但 resultList 仍应展示
      expect(container.querySelector(`${name}__result-list`)).toBeTruthy();
      // 输入框在合成态下应显示正在输入的内容
      expect(search).toHaveValue('中');

      fireEvent.compositionEnd(search, { target: { value: '中' } });
      expect(handleChange).toHaveBeenCalledWith('中', expect.objectContaining({ trigger: 'input-change' }));
    });

    it(': 普通 input 事件(非合成态)正常触发 onChange', () => {
      const handleChange = vi.fn();
      render(<Search onChange={handleChange} />);
      const search = getSearch();
      // 默认 inputType 为空字符串，不属于 insertCompositionText
      const inputEvent = createEvent.input(search, { inputType: 'insertText' });
      Object.defineProperty(search, 'value', { writable: true, value: 'hello' });
      fireEvent(search, inputEvent);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('hello', expect.objectContaining({ trigger: 'input-change' }));
    });

    it(': onSubmit 仅在按下 Enter 键时触发', () => {
      const handleSubmit = vi.fn();
      render(<Search onSubmit={handleSubmit} />);
      const input = getSearch();
      const testValue = '提交内容';
      fireEvent.input(input, { target: { value: testValue } });

      // 非 Enter 键不会触发 submit
      fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });
      expect(handleSubmit).not.toHaveBeenCalled();

      // Enter 键触发 submit
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        value: testValue,
        e: expect.anything(),
      });
    });

    it(': resultList 选择联想词后触发 onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(<Search resultList={['apple', 'banana']} value="ap" onChange={handleChange} />);
      // 触发 input 让联想词列表展示
      fireEvent.input(getSearch(), { target: { value: 'ap' } });
      const items = container.querySelectorAll(`${name}__result-item`);
      expect(items.length).toBe(2);
      // 点击第一个联想词
      fireEvent.click(items[0]);
      expect(handleChange).toHaveBeenCalledWith('apple', expect.objectContaining({ trigger: 'option-click' }));
      // 选择后联想词列表应隐藏
      expect(container.querySelector(`${name}__result-list`)).toBeFalsy();
    });

    it(': defaultValue 非受控模式下输入触发 onChange', () => {
      const handleChange = vi.fn();
      render(<Search defaultValue="abc" onChange={handleChange} />);
      const search = getSearch();
      fireEvent.input(search, { target: { value: 'abcd' } });
      expect(handleChange).toHaveBeenCalledWith('abcd', expect.objectContaining({ trigger: 'input-change' }));
      expect(search).toHaveValue('abcd');
    });

    it(': clear 后输入框重新聚焦', () => {
      const { container } = render(<Search clearable value="test" />);
      fireEvent.click(container.querySelector(`${name}__clear`) as HTMLElement);
      // 清空后 focusState 被设置为 true，input-box 应有 is-focused 样式
      expect(container.querySelector(`.${prefix}-is-focused`)).toBeTruthy();
    });
  });
});
