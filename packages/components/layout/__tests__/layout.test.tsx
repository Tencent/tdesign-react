import React from 'react';
import { render } from '@test/utils';

import Layout from '../index';

const { Header, Content, Footer, Aside } = Layout;

describe('Layout', () => {
  describe('props', () => {
    test('direction[horizontal]', () => {
      const { container } = render(<Layout direction="horizontal" />);
      const layoutElement = container.querySelector('.t-layout');
      expect(layoutElement).not.toBeNull();
      const horizontal = container.querySelector('.t-layout__direction-horizontal');
      expect(horizontal).not.toBeNull();
    });
  });
});

describe('Header', () => {
  describe('props', () => {
    test('default', () => {
      const { container } = render(<Header />);
      expect(container).not.toBeNull();
    });
  });
});

describe('Content', () => {
  describe('props', () => {
    test('default', () => {
      const { container } = render(<Content />);
      expect(container).not.toBeNull();
    });
  });
});

describe('Footer', () => {
  describe('props', () => {
    test('default', () => {
      const { container } = render(<Footer />);
      expect(container).not.toBeNull();
    });
  });
});

describe('Aside', () => {
  describe('props', () => {
    test('default', () => {
      const { container } = render(<Aside />);
      expect(container).not.toBeNull();
    });
  });
});
