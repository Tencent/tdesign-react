import React from 'react';
import { render } from '@test/utils';

import { Button } from '../../button';
import Divider from '../../divider';
import Space from '../index';
import { SizeMap } from '../Space';

import type { TdSpaceProps } from '../type';

function getSpaceDefaultMount(props?: Partial<TdSpaceProps>, events?: Record<string, unknown>) {
  return render(
    <Space {...props} {...events}>
      <Button>Text</Button>
      <Button>Text</Button>
      <Button>Text</Button>
    </Space>,
  );
}

describe('Space', () => {
  describe('props', () => {
    (['start', 'end', 'center', 'baseline'] as TdSpaceProps['align'][]).forEach((item) => {
      test(`align is equal to ${item}`, () => {
        const { container } = getSpaceDefaultMount({ align: item });
        expect(container.firstChild).toHaveClass(`t-space-align-${item}`);
      });
    });

    test('breakLine', () => {
      // breakLine default value is false
      const { container: container1 } = getSpaceDefaultMount();
      expect(container1.querySelector(`.${'t-space--break-line'}`)).toBeFalsy();
      // breakLine = true
      const { container: container2 } = getSpaceDefaultMount({
        breakLine: true,
      });
      expect(container2.firstChild).toHaveClass('t-space--break-line');
      // breakLine = false
      const { container: container3 } = getSpaceDefaultMount({
        breakLine: false,
      });
      expect(container3.querySelector(`.${'t-space--break-line'}`)).toBeFalsy();
    });

    (['vertical', 'horizontal'] as TdSpaceProps['direction'][]).forEach((item) => {
      test(`direction is equal to ${item}`, () => {
        const { container } = getSpaceDefaultMount({ direction: item });
        expect(container.firstChild).toHaveClass(`t-space-${item}`);
      });
    });

    test(`size is equal to 'small'`, () => {
      const { container } = getSpaceDefaultMount({ size: 'small' });
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.gap).toBe('8px');
    });

    test(`size is equal to 'large'`, () => {
      const { container } = getSpaceDefaultMount({ size: 'large' });
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.gap).toBe('24px');
    });

    test(`size is equal to '38px'`, () => {
      const { container } = getSpaceDefaultMount({ size: '38px' });
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.gap).toBe('38px');
    });

    test(`size is equal to ['20px', '80px']`, () => {
      const { container } = getSpaceDefaultMount({ size: ['20px', '80px'] });
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.gap).toBe('20px 80px');
    });

    test('align', async () => {
      (['start', 'end', 'center', 'baseline'] as TdSpaceProps['align'][]).forEach((align) => {
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
      expect((container.firstChild as HTMLDivElement).classList.contains('t-space--break-line')).toBeTruthy();
    });
  });

  describe('slots', () => {
    test('separator', () => {
      const { container } = getSpaceDefaultMount({
        separator: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('separator divider', async () => {
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

  describe('scenarios', () => {
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

      (['vertical', 'horizontal'] as TdSpaceProps['direction'][]).forEach((direction) => {
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
  });
});
