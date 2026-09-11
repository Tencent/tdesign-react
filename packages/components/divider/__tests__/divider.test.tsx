import React from 'react';
import { render } from '@test/utils';

import Divider from '../Divider';

import type { TdDividerProps } from '../type';

describe('Divider', () => {
  describe('props', () => {
    (['left', 'right', 'center'] as TdDividerProps['align'][]).forEach((item) => {
      test(`align is equal to ${item}`, () => {
        const { container } = render(<Divider align={item}>Text</Divider>);
        expect(container.firstChild).toHaveClass(`t-divider--with-text-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('dashed', () => {
      // dashed default value is false
      const { container: container1 } = render(<Divider></Divider>);
      expect(container1.querySelector(`.${'t-divider--dashed'}`)).toBeFalsy();
      // dashed = true
      const { container: container2 } = render(<Divider dashed={true}></Divider>);
      expect(container2.firstChild).toHaveClass('t-divider--dashed');
      // dashed = false
      const { container: container3 } = render(<Divider dashed={false}></Divider>);
      expect(container3.querySelector(`.${'t-divider--dashed'}`)).toBeFalsy();
    });

    (['horizontal', 'vertical'] as TdDividerProps['layout'][]).forEach((item) => {
      test(`layout is equal to ${item}`, () => {
        const { container } = render(<Divider layout={item}></Divider>);
        expect(container.firstChild).toHaveClass(`t-divider--${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('Divider 虚线', () => {
      const { container } = render(<Divider dashed />);

      // 校验默认 className
      const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--dashed'];
      expect(container.firstChild).toHaveClass(...defaultClass);
    });

    test('Divider content带文字 ', () => {
      const text = '腾讯中content';
      const { container, getByText } = render(<Divider content={text}></Divider>);

      // 校验默认 className
      const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--with-text'];
      expect(container.firstChild).toHaveClass(...defaultClass);

      expect(getByText(text).textContent).toBe(text);
    });

    test('Divider size horizontal number', () => {
      const text = '腾讯中content';
      const { container } = render(<Divider content={text} size={20}></Divider>);

      expect(container.querySelector('.t-divider')).toHaveStyle({
        margin: '20px 0',
      });
    });

    test('Divider size horizontal string', () => {
      const text = '腾讯中content';
      const { container } = render(<Divider content={text} size="20px"></Divider>);

      expect(container.querySelector('.t-divider')).toHaveStyle({
        margin: '20px 0',
      });
    });
  });

  describe('slots', () => {
    test('content', () => {
      const { container } = render(<Divider content={<span className="custom-node">TNode</span>}></Divider>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('Divider 带文字', () => {
      const text = '腾讯中';
      const { container, getByText } = render(<Divider>{text}</Divider>);

      // 校验默认 className
      const defaultClass = ['t-divider', 't-divider--horizontal', 't-divider--with-text'];
      expect(container.firstChild).toHaveClass(...defaultClass);

      expect(getByText(text).textContent).toBe(text);
    });
  });

  describe('scenarios', () => {
    test('Divider 水平分割线', async () => {
      const { container } = render(<Divider />);

      // 校验默认 className
      const defaultClass = ['t-divider', 't-divider--horizontal'];
      expect(container.firstChild).toHaveClass(...defaultClass);
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
