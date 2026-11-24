import { render } from '@test/utils';
import { describe, test, expect } from 'vitest';
import React from 'react';
import Footer from '../Footer';

describe('Footer', () => {
  describe('props', () => {
    test(': text', () => {
      const text = 'Hello. TDesign Footer.';
      const { container } = render(<Footer text={text} />);
      const textElement = container.querySelector('.t-footer__text');
      expect(textElement).toBeTruthy();
      expect(textElement.innerHTML).toBe(text);
    });

    test('logo with title', () => {
      const logo = {
        icon: 'https://tdesign.gtimg.com/mobile/demos/logo2.png',
        title: '品牌名称',
      };
      const { container } = render(<Footer logo={logo} />);
      const imgElement = container.querySelector('.t-footer__icon img');
      expect(imgElement).toBeTruthy();
      expect(imgElement.getAttribute('src')).toBe(logo.icon);
      const logoTitleElement = container.querySelector('.t-footer__title');
      expect(logoTitleElement).toBeTruthy();
      expect(logoTitleElement.innerHTML).toBe(logo.title);
    });

    test('logo without title', () => {
      const logo = {
        icon: 'https://tdesign.gtimg.com/mobile/demos/logo2.png',
      };
      const { container } = render(<Footer logo={logo} />);
      const imgElement = container.querySelector('.t-footer__title-url');
      expect(imgElement).toBeTruthy();
    });

    test(': links', () => {
      const links = [
        {
          name: '底部链接A',
          url: 'https://a',
        },
        {
          name: '底部链接B',
          url: 'https://b',
        },
      ];
      const { container } = render(<Footer links={links} />);
      expect(container.querySelector('.t-footer__link-list')).toBeTruthy();
      const itemsElement = container.querySelectorAll('.t-footer__link-item');
      expect(itemsElement.length).toBe(links.length);
      expect(itemsElement[0].innerHTML).toBe(links[0].name);
    });

    test(': className', () => {
      const { container } = render(<Footer text="hello" className="custom-class" />);
      expect(container.querySelector('.t-footer.custom-class')).toBeTruthy();
    });

    test(': style', () => {
      const { container } = render(<Footer text="hello" style={{ fontSize: '100px' }} />);
      expect(window.getComputedStyle(container.querySelector('.t-footer')).fontSize).toBe('100px');
    });
  });
});
