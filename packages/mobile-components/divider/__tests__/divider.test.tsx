import React from 'react';
import { describe, expect, it, render } from '@test/utils';
import Divider from '../Divider';

describe('Divider', () => {
  describe('props', () => {
    it(':align', () => {
      const aligns = ['left', 'right', 'center'] as const;

      function checkAlign(align: (typeof aligns)[number]) {
        const { container } = render(<Divider align={align}>Text</Divider>);
        expect(container.firstChild).toHaveClass(`t-divider--${align}`);
      }

      aligns.forEach(checkAlign);
    });

    it(':layout', () => {
      const layouts = ['horizontal', 'vertical'] as const;

      function checkLayout(layout: (typeof layouts)[number]) {
        const { container } = render(<Divider layout={layout} />);
        expect(container.firstChild).toHaveClass(`t-divider--${layout}`);
      }

      layouts.forEach(checkLayout);
    });

    it(':content', () => {
      // Test content as a function
      const { container: container1 } = render(<Divider content={() => <span className="custom-node">TNode</span>} />);
      expect(container1.querySelector('.custom-node')).toBeTruthy();
      expect(container1).toMatchSnapshot();

      // Test content as a string
      const { container: container2 } = render(<Divider content="TDesign" />);
      expect(container2.textContent).toBe('TDesign');
      expect(container2).toMatchSnapshot();
    });

    it(':dashed', () => {
      // Test default value (false)
      const { container: container1 } = render(<Divider />);
      expect(container1.firstChild).not.toHaveClass('t-divider--dashed');

      // Test dashed = true
      const { container: container2 } = render(<Divider dashed={true} />);
      expect(container2.firstChild).toHaveClass('t-divider--dashed');

      // Test dashed = false
      const { container: container3 } = render(<Divider dashed={false} />);
      expect(container3.firstChild).not.toHaveClass('t-divider--dashed');
    });
  });

  describe('slot', () => {
    it(':default', () => {
      const { container } = render(<Divider>TDesign</Divider>);
      expect(container).toMatchSnapshot();
    });

    it(':content', () => {
      const testSlotContentId = 'divider-content-test-slot-id';
      const { container } = render(
        <Divider>
          <span className="custom-node" data-testid={testSlotContentId}>
            TNode
          </span>
        </Divider>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector(`[data-testid="${testSlotContentId}"]`)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  it('content prop and default slot exist meanwhile', () => {
    const { container } = render(<Divider content="prop content">TDesign</Divider>);
    expect(container.textContent).toBe('prop content');
  });

  describe('vertical divider', () => {
    it('applies dashed class on vertical divider', () => {
      const { container } = render(<Divider layout="vertical" dashed={true} />);
      expect(container.firstChild).toHaveClass('t-divider--dashed');
      expect(container).toMatchSnapshot();
    });

    it('applies align class on vertical divider', () => {
      const { container } = render(
        <Divider layout="vertical" align="left">
          text
        </Divider>,
      );
      expect(container.firstChild).toHaveClass('t-divider--left');
      expect(container).toMatchSnapshot();
    });
  });
});
