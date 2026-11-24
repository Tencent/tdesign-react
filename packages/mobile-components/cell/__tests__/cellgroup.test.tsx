import { describe, it, expect, render } from '@test/utils';
import React from 'react';
import CellGroup from '../CellGroup';
import Cell from '../Cell';

describe('CellGroup', () => {
  describe('props', () => {
    it('renders correctly with default props', () => {
      const { container } = render(
        <CellGroup>
          <Cell title="Cell 1" />
          <Cell title="Cell 2" />
        </CellGroup>,
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector('.t-cell-group')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      const { getByText } = render(
        <CellGroup>
          <Cell title="First Cell" />
          <Cell title="Second Cell" />
          <div>Custom Content</div>
        </CellGroup>,
      );

      expect(getByText('First Cell')).toBeInTheDocument();
      expect(getByText('Second Cell')).toBeInTheDocument();
      expect(getByText('Custom Content')).toBeInTheDocument();
    });

    it(': className', () => {
      const { container } = render(
        <CellGroup className="custom-class">
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it(': style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { container } = render(
        <CellGroup style={customStyle}>
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it(':title', () => {
      const { container, getByText, rerender } = render(
        <CellGroup title="Group Title">
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(getByText('Group Title')).toBeInTheDocument();
      expect(getByText('Group Title')).toHaveClass('t-cell-group__title');

      rerender(
        <CellGroup>
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(container.querySelector('.t-cell-group__title')).not.toBeInTheDocument();
    });

    it(': bordered', async () => {
      const { container, rerender } = render(
        <CellGroup bordered>
          <Cell title="Cell 1" />
        </CellGroup>,
      );
      expect(container.querySelector('.t-cell-group--bordered')).toBeInTheDocument();

      rerender(
        <CellGroup bordered={false}>
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(container.querySelector('.t-cell-group--bordered')).not.toBeInTheDocument();
    });

    it(': theme', () => {
      const { container: defaultContainer } = render(
        <CellGroup theme="default">
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      const { container: cardContainer } = render(
        <CellGroup theme="card">
          <Cell title="Cell 1" />
        </CellGroup>,
      );

      expect(defaultContainer.querySelector('.t-cell-group--default')).toBeInTheDocument();
      expect(cardContainer.querySelector('.t-cell-group--card')).toBeInTheDocument();
    });
  });
});
