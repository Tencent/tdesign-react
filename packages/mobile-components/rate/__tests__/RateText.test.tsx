import React from 'react';
import { describe, it, expect, render, screen } from '@test/utils';
import { RateText } from '../RateText';

describe('RateText', () => {
  describe('props', () => {
    it(':value', () => {
      render(<RateText value={3} texts={undefined} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':value with zero', () => {
      render(<RateText value={0} texts={undefined} />);
      expect(screen.getByText('未评分')).toBeInTheDocument();
    });

    it(':texts', () => {
      const texts = ['很差', '差', '一般', '好', '很好'];
      render(<RateText value={3} texts={texts} />);
      expect(screen.getByText('一般')).toBeInTheDocument();
    });

    it('should apply active class when value > 0', () => {
      const { container } = render(<RateText value={3} texts={undefined} />);
      const text = container.querySelector('.t-rate__text');
      expect(text).toHaveClass('t-rate__text--active');
    });

    it('should not apply active class when value is 0', () => {
      const { container } = render(<RateText value={0} texts={undefined} />);
      const text = container.querySelector('.t-rate__text');
      expect(text).not.toHaveClass('t-rate__text--active');
    });

    it(':texts shorter than value', () => {
      const texts = ['很差', '差'];
      render(<RateText value={5} texts={texts} />);
      expect(screen.getByText('5 分')).toBeInTheDocument();
    });

    it(':texts with empty array', () => {
      render(<RateText value={3} texts={[]} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':texts with undefined', () => {
      render(<RateText value={3} texts={undefined} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':texts with null', () => {
      render(<RateText value={3} texts={null as any} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':texts with string instead of array', () => {
      render(<RateText value={3} texts={'test' as any} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':value at array boundary', () => {
      const texts = ['很差', '差', '一般', '好', '很好'];
      render(<RateText value={5} texts={texts} />);
      expect(screen.getByText('很好')).toBeInTheDocument();
    });

    it(':value at array start', () => {
      const texts = ['很差', '差', '一般', '好', '很好'];
      render(<RateText value={1} texts={texts} />);
      expect(screen.getByText('很差')).toBeInTheDocument();
    });

    it(':value zero with texts', () => {
      const texts = ['很差', '差', '一般', '好', '很好'];
      render(<RateText value={0} texts={texts} />);
      expect(screen.getByText('未评分')).toBeInTheDocument();
    });

    it(':value with negative', () => {
      render(<RateText value={-1} texts={undefined} />);
      expect(screen.getByText('-1 分')).toBeInTheDocument();
    });

    it(':value with large number', () => {
      render(<RateText value={100} texts={undefined} />);
      expect(screen.getByText('100 分')).toBeInTheDocument();
    });

    it(':value with decimal', () => {
      render(<RateText value={2.5} texts={undefined} />);
      expect(screen.getByText('2.5 分')).toBeInTheDocument();
    });

    it(':texts with empty string', () => {
      const texts = ['很差', '', '一般', '好', '很好'];
      render(<RateText value={2} texts={texts} />);
      expect(screen.getByText('2 分')).toBeInTheDocument();
    });

    it(':texts with null element', () => {
      const texts = ['很差', null as any, '一般', '好', '很好'];
      render(<RateText value={2} texts={texts} />);
      expect(screen.getByText('2 分')).toBeInTheDocument();
    });

    it(':texts with undefined element', () => {
      const texts = ['很差', undefined as any, '一般', '好', '很好'];
      render(<RateText value={2} texts={texts} />);
      expect(screen.getByText('2 分')).toBeInTheDocument();
    });

    it(':texts with single element', () => {
      const texts = ['only one'];
      render(<RateText value={3} texts={texts} />);
      expect(screen.getByText('3 分')).toBeInTheDocument();
    });

    it(':texts with exact matching indices', () => {
      const texts = ['1分', '2分', '3分'];
      render(<RateText value={2} texts={texts} />);
      expect(screen.getByText('2分')).toBeInTheDocument();
    });
  });
});
