import React from 'react';
import { describe, expect, render, it } from '@test/utils';
import Row from '../Row';
import Col from '../Col';

const prefix = 't';
const rowName = `${prefix}-row`;
const colName = `${prefix}-col`;

const TEXT = 'tdesign-mobile-react';

describe('Layout', () => {
  describe('Row', () => {
    describe('props', () => {
      it(':gutter', () => {
        const { container } = render(
          <Row gutter={100}>
            <Col />
          </Row>,
        );
        expect(container.firstChild).toHaveStyle('margin-right: -50px; margin-left: -50px;');
        expect(container.firstChild).toHaveClass(rowName);
      });

      it(':gutter with zero value', () => {
        const { container } = render(
          <Row gutter={0}>
            <Col />
          </Row>,
        );
        expect(container.firstChild).not.toHaveStyle('margin-right: -0px');
        expect(container.firstChild).toHaveClass(rowName);
      });

      it(':className', () => {
        const { container } = render(
          <Row className="custom-row">
            <Col />
          </Row>,
        );
        expect(container.firstChild).toHaveClass(rowName);
        expect(container.firstChild).toHaveClass('custom-row');
      });

      it(':style', () => {
        const { container } = render(
          <Row style={{ backgroundColor: 'red' }}>
            <Col />
          </Row>,
        );
        expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)');
      });
    });
  });

  describe('Col', () => {
    describe('props', () => {
      it(':offset', () => {
        const { container } = render(
          <Row gutter={100}>
            <Col span={2} offset={1} />
          </Row>,
        );
        const col = container.querySelector(`.${colName}--offset-1`);
        expect(col).not.toBeNull();
        expect(col).toHaveClass(`${colName}--2`);
      });

      it(':span', () => {
        const { container } = render(
          <Row gutter={100}>
            <Col span={2}>{TEXT}</Col>
          </Row>,
        );

        const col = container.querySelector(`.${colName}--2`);
        expect(col).not.toBeNull();
        expect(container.querySelector(`.${colName}--2`).textContent).toBe(TEXT);
      });

      it(':className', () => {
        const { container } = render(
          <Row>
            <Col className="custom-col" span={2} />
          </Row>,
        );
        const col = container.querySelector('.custom-col');
        expect(col).toHaveClass(`${colName}--2`);
      });

      it(':style', () => {
        const { container } = render(
          <Row>
            <Col style={{ color: 'blue' }} span={2} />
          </Row>,
        );
        const col = container.querySelector(`.${colName}--2`);
        expect(col).toHaveStyle('color: rgb(0, 0, 255)');
      });

      it('should apply padding with gutter', () => {
        const { container } = render(
          <Row gutter={20}>
            <Col span={2} />
          </Row>,
        );
        const col = container.querySelector(`.${colName}--2`);
        expect(col).toHaveStyle('padding-right: 10px');
        expect(col).toHaveStyle('padding-left: 10px');
      });

      it('should not apply padding when gutter is not provided', () => {
        const { container } = render(
          <Row>
            <Col span={2} />
          </Row>,
        );
        const col = container.querySelector(`.${colName}--2`);
        expect(col).not.toHaveStyle('padding-right: 0px');
      });
    });

    describe('edge cases', () => {
      it('should handle zero values', () => {
        const { container } = render(
          <Row>
            <Col span={0} offset={0} />
          </Row>,
        );
        expect(container.querySelector(`.${colName}--0`)).not.toBeNull();
        expect(container.querySelector(`.${colName}--offset-0`)).not.toBeNull();
      });

      it('should handle negative offset', () => {
        const { container } = render(
          <Row>
            <Col span={2} offset={-1} />
          </Row>,
        );
        const col = container.querySelector(`.${colName}--offset--1`);
        expect(col).toBeNull();
      });
    });
  });

  describe('integration', () => {
    it('should work with multiple columns', () => {
      const { container } = render(
        <Row gutter={16}>
          <Col span={8}>Col-8</Col>
          <Col span={8} offset={8}>
            Col-8-offset-8
          </Col>
        </Row>,
      );

      const cols = container.querySelectorAll(`.${colName}`);
      expect(cols).toHaveLength(2);
      expect(cols[0]).toHaveClass(`${colName}--8`);
      expect(cols[1]).toHaveClass(`${colName}--8`);
      expect(cols[1]).toHaveClass(`${colName}--offset-8`);
    });

    it('should handle nested rows and columns', () => {
      const { container } = render(
        <Row gutter={20}>
          <Col span={12}>
            <Row gutter={10}>
              <Col span={6}>Nested</Col>
              <Col span={6}>Col</Col>
            </Row>
          </Col>
          <Col span={12}>Right</Col>
        </Row>,
      );

      const rows = container.querySelectorAll(`.${rowName}`);
      expect(rows).toHaveLength(2);

      const cols = container.querySelectorAll(`.${colName}`);
      expect(cols).toHaveLength(4);
    });
  });
});
