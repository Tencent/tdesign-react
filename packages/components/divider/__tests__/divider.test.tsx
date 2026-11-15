import React from 'react';
import { render } from '@test/utils';

import Divider from '../Divider';

import type { TdDividerProps } from '../type';

describe('Divider', () => {
  describe('props', () => {
    (['left', 'right', 'center'] as TdDividerProps['align'][]).forEach((item) => {
      test(`align[${item}]`, () => {
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
      test(`layout[${item}]`, () => {
        const { container } = render(<Divider layout={item}></Divider>);
        expect(container.firstChild).toHaveClass(`t-divider--${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('content and children', () => {
      const text = '腾讯中content';
      const { container: stringContentContainer, getByText } = render(<Divider content={text}></Divider>);
      expect(stringContentContainer.firstChild).toHaveClass(
        't-divider',
        't-divider--horizontal',
        't-divider--with-text',
      );
      expect(getByText(text).textContent).toBe(text);

      const childText = '腾讯中';
      const { container: childrenContainer, getByText: getChildText } = render(<Divider>{childText}</Divider>);
      expect(childrenContainer.firstChild).toHaveClass('t-divider', 't-divider--horizontal', 't-divider--with-text');
      expect(getChildText(childText).textContent).toBe(childText);

      const { container: nodeContainer } = render(
        <Divider content={<span className="custom-node">TNode</span>}></Divider>,
      );
      expect(nodeContainer.querySelector('.custom-node')).toBeTruthy();
      expect(nodeContainer).toMatchSnapshot();
    });

    test('size', () => {
      const text = '腾讯中content';
      const { container: numberHorizontalContainer } = render(<Divider content={text} size={20}></Divider>);
      expect(numberHorizontalContainer.querySelector('.t-divider')).toHaveStyle({ margin: '20px 0' });

      const { container: stringHorizontalContainer } = render(<Divider content={text} size="20px"></Divider>);
      expect(stringHorizontalContainer.querySelector('.t-divider')).toHaveStyle({ margin: '20px 0' });

      const { container: numberVerticalContainer } = render(
        <Divider content={text} size={20} layout="vertical"></Divider>,
      );
      expect(numberVerticalContainer.querySelector('.t-divider')).toHaveStyle({
        margin: '0 20px',
      });
    });
  });
});
