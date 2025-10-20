import React from 'react';
import { render } from '@test/utils';
import Divider from '../Divider';

describe('Divider 组件测试', () => {
  describe('props', () => {
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

    test('Divider size horizontal', () => {
      const text = '腾讯中content';
      const { container } = render(<Divider content={text} size={20}></Divider>);

      expect(container.querySelector('.t-divider')).toHaveStyle({
        margin: '20px 0',
      });
    });

    test('Divider size horizontal', () => {
      const text = '腾讯中content';
      const { container } = render(<Divider content={text} size="20px"></Divider>);

      expect(container.querySelector('.t-divider')).toHaveStyle({
        margin: '20px 0',
      });
    });

    test('Divider size vertical', () => {
      const text = '腾讯中content';
      const { container } = render(<Divider content={text} size={20} layout="vertical"></Divider>);

      expect(container.querySelector('.t-divider')).toHaveStyle({
        margin: '0 20px',
      });
    });
  });
});
