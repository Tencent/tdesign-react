import React from 'react';
import { testExamples, render } from '@test/utils';
import Divider from '../Divider';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Divider 组件测试', () => {
  test('Divider 水平分割线', async () => {
    const { container } = render(<Divider />);

    // 校验默认 className
    const defaultClass = ['t-divider', 't-divider--horizontal'];
    expect(container.firstChild).toHaveClass(...defaultClass);
  });
  test('Divider 虚线', () => {
    const { container } = render(<Divider dashed />);

    // 校验默认 className
    const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--dashed'];
    expect(container.firstChild).toHaveClass(...defaultClass);
  });
  test('Divider 带文字', () => {
    const text = '腾讯中';
    const { container, getByText } = render(<Divider>{text}</Divider>);

    // 校验默认 className
    const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--with-text'];
    expect(container.firstChild).toHaveClass(...defaultClass);

    expect(getByText(text).textContent).toBe(text);
  });
  test('Divider content带文字 ', () => {
    const text = '腾讯中content';
    const { container, getByText } = render(<Divider content={text}></Divider>);

    // 校验默认 className
    const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--with-text'];
    expect(container.firstChild).toHaveClass(...defaultClass);

    expect(getByText(text).textContent).toBe(text);
  });
});
