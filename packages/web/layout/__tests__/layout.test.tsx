import { render } from '@test/utils';
import React from 'react';
import Layout from '../index';

const { Header, Content, Footer, Aside } = Layout;

// TODO
describe('Layout 组件测试', () => {
  test('Layout direction ', () => {
    const { container } = render(<Layout direction="horizontal" />);
    const layoutElement = container.querySelector('.t-layout');
    expect(layoutElement).not.toBeNull();
    const horizontal = container.querySelector('.t-layout__direction-horizontal');
    expect(horizontal).not.toBeNull();
  });

  test('Header ', () => {
    const { container } = render(<Header />);
    expect(container).not.toBeNull();
  });

  test('Content ', () => {
    const { container } = render(<Content />);
    expect(container).not.toBeNull();
  });

  test('Footer ', () => {
    const { container } = render(<Footer />);
    expect(container).not.toBeNull();
  });

  test('Aside ', () => {
    const { container } = render(<Aside />);
    expect(container).not.toBeNull();
  });
});
