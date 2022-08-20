import React from 'react';
import { testExamples, render } from '@test/utils';
import Divider from 'tdesign-react/divider/Divider';
import Space, { AlignType } from '../index';
import { SizeMap } from '../Space';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Space 组件测试', () => {
  test('render', async () => {
    const { container } = render(<Space></Space>);
    expect(container).toMatchSnapshot();
  });

  test('direction and size', async () => {
    const sizeMap = new Map<any, string>(
      Object.entries({
        ...SizeMap,
        '100pt': '100pt',
      }),
    );
    sizeMap.set(0, '0px');
    sizeMap.set(123.456, '123.456px');
    sizeMap.set([], '');
    sizeMap.set([123, 45], '123px 45px');
    sizeMap.set(['large', '123px'], `${SizeMap.large} 123px`);

    ['vertical', 'horizontal'].forEach((direction: 'vertical' | 'horizontal') => {
      sizeMap.forEach((value, key) => {
        const { container } = render(
          <Space direction={direction} size={key}>
            <div>child1</div>
            <div>child2</div>
          </Space>,
        );
        expect(container.firstChild).toHaveClass(`t-space-${direction}`);
        expect((container.firstChild as HTMLDivElement).style.gap).toEqual(value);
      });
    });
  });

  test('align', async () => {
    AlignType.forEach((align) => {
      const { container } = render(
        <Space align={align}>
          <div></div>
        </Space>,
      );
      expect(container.firstChild).toHaveClass(`t-space-align-${align}`);
    });
  });

  test('break line', async () => {
    const { container } = render(
      <Space breakLine={true}>
        <div></div>
      </Space>,
    );
    expect((container.firstChild as HTMLDivElement).style.flexWrap).toBe('wrap');
  });

  test('separator', async () => {
    const { container } = render(
      <Space align="center" separator={<Divider layout="vertical" />}>
        <div>child1</div>
        <div>child2</div>
      </Space>,
    );
    expect(container.firstChild.childNodes.item(1)).toHaveClass('t-space-item-separator');
    expect(container.querySelector('.t-space-item-separator').firstChild).toHaveClass('t-divider');
  });

  test('children', async () => {
    function renderSpace(children?: React.ReactNode) {
      return render(<Space>{children}</Space>).container;
    }
    expect(renderSpace().firstChild.childNodes).toHaveLength(0);
    expect(
      renderSpace(
        <>
          <div></div>
          {[<div key="1"></div>, <div key="2"></div>]}
        </>,
      ).firstChild.childNodes,
    ).toHaveLength(3);
  });
});
