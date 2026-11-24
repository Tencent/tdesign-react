import React from 'react';
import { describe, expect, it, render } from '@test/utils';
import { Badge } from '../index';

describe('Badge', () => {
  describe('props', () => {
    it(':shape', () => {
      const shapes = ['circle', 'square', 'bubble', 'ribbon'] as const;
      function checkShape(shape: (typeof shapes)[number]) {
        const { container } = render(<Badge shape={shape} dot />);

        if (shape === 'ribbon') {
          expect(container.querySelector('.t-badge__ribbon-outer')).not.toBe(null);
        } else {
          expect(container.querySelector(`.t-badge--${shape}`)).not.toBe(null);
        }
      }

      shapes.forEach(checkShape);
    });

    it(':size', () => {
      const shapes = ['medium', 'large'] as const;

      function checkSize(size: (typeof shapes)[number]) {
        const { container } = render(<Badge size={size} dot />);
        expect(container.querySelector(`.t-badge--${size}`)).not.toBe(null);
      }

      shapes.forEach(checkSize);
    });

    it(':color', async () => {
      const colors = ['red', 'blue', ''];

      function checkColor(color: string) {
        const { container } = render(<Badge count={3} color={color} />);
        const node = container.querySelector('.t-badge--basic');
        if (color === '') {
          expect(node.getAttribute('style')).toBe(null);
          return;
        }
        expect(node.getAttribute('style')).contain(`background-color: ${color}`);
      }

      colors.forEach(checkColor);
    });

    it(':content', () => {
      const { container } = render(<Badge content="33" />);
      expect(container.querySelector('.t-badge__content-text').textContent.trim()).toBe('33');
    });

    it(':count', () => {
      const { container } = render(<Badge count={99} />);
      expect(container.querySelector('.t-badge--basic > .t-badge__count').innerHTML.trim()).toBe('99');
      const { container: container2 } = render(<Badge count={() => 33} />);
      expect(container2.querySelector('.t-badge--basic > .t-badge__count').innerHTML.trim()).toBe('33');
      const { container: container3 } = render(<Badge count={null} />);
      expect(container3.querySelector('.t-badge--basic > .t-badge__count')).toBe(null);
    });

    it(':dot', () => {
      const { container } = render(<Badge dot={false} />);
      expect(container.querySelector('.t-badge--basic')).toBe(null);
    });

    it(':maxCount', () => {
      const { container } = render(<Badge count={100} maxCount={99} />);
      expect(container.querySelector('.t-badge--basic > .t-badge__count').innerHTML.trim()).toBe('99+');
    });

    it(':offset', () => {
      const { container } = render(<Badge count={3} offset={[10, 10]} />);
      expect(container.querySelector('.t-badge--basic').getAttribute('style'))
        .contain('left: calc(100% + 10px);')
        .contain('top: 10px;');
      const { container: container1 } = render(<Badge count={3} offset={[]} />);
      expect(container1.querySelector('.t-badge--basic').getAttribute('style')).toBe(null);
      const { container: container2 } = render(<Badge count={3} offset={['10em', '10rem']} />);
      expect(container2.querySelector('.t-badge--basic').getAttribute('style'))
        .contain('left: calc(100% + 10em);')
        .contain('top: 10rem;');
    });

    it(':showZero', async () => {
      const { container } = render(<Badge count={0} showZero={true} />);
      expect(container.querySelector('.t-badge--basic').textContent.trim()).toBe('0');
    });

    it(':size', async () => {
      const sizes = ['medium', 'large'] as const;

      function checkSize(size: (typeof sizes)[number]) {
        const { container } = render(<Badge size={size} dot />);
        expect(container.querySelector(`.t-badge--${size}`)).toBeTruthy();
      }

      sizes.forEach(checkSize);
    });
  });

  describe('slot', () => {
    it(':content', () => {
      const testSlotContentId = 'badge-content-test-slot-id';
      const { container } = render(<Badge content={<div data-testid={testSlotContentId}>33</div>} />);

      expect(container.querySelector(`.t-badge__content`)).not.toBe(null);
      expect(container.querySelector(`[data-testid="${testSlotContentId}"]`)).not.toBe(null);
    });

    it(':default', () => {
      const testSlotContentId = 'badge-default-test-slot-id';

      const { container } = render(
        <Badge>
          <div data-testid={testSlotContentId}>default</div>
        </Badge>,
      );

      expect(container.querySelector(`.t-badge__content`)).not.toBe(null);
      expect(container.querySelector(`.t-badge__content`).textContent).toBe('default');
      expect(container.querySelector(`[data-testid="${testSlotContentId}"]`)).not.toBe(null);
    });

    it(':count', () => {
      const testCountSlotContentId = 'badge-content-test-slot-id';
      const { container } = render(<Badge count={<div data-testid={testCountSlotContentId}>33</div>} />);

      expect(container.querySelector(`.t-badge--count`)).not.toBe(null);
      expect(container.querySelector(`.t-badge--count`).textContent).toBe('33');
      expect(container.querySelector(`[data-testid="${testCountSlotContentId}"]`)).not.toBe(null);

      const { container: container1 } = render(<Badge count={null} showZero />);
      expect(container1.querySelector(`.t-badge--count`)).toBe(null);
    });
  });
});
