import React from 'react';
import { render, fireEvent, mockDelay } from '@test/utils';
import { ArrowTriangleDownFilledIcon, ArrowTriangleUpFilledIcon } from 'tdesign-icons-react';
import Statistic from '../index';

describe('Statistic 组件测试', () => {
  /**
   * props
   */

  test('props', () => {
    render(<Statistic title="Total Assets" value={82.76} unit="%" trend="increase" color="black" />);

    expect(document.querySelector('.t-statistic-title')).toHaveTextContent('Total Assets');

    expect(document.querySelector('.t-statistic-content-unit')).toHaveTextContent('%');
  });

  /**
   * color
   */

  const COLOR_MAP = {
    black: 'black',
    blue: 'var(--td-brand-color)',
    red: 'var(--td-error-color)',
    orange: 'var(--td-warning-color)',
    green: 'var(--td-success-color)',
  };
  const colors = ['black', 'blue', 'red', 'orange', 'green'] as const;
  colors.forEach((color) => {
    test('color', () => {
      render(<Statistic title="Total Assets" value={82.76} unit="%" trend="increase" color={color} />);

      expect(document.querySelector('.t-statistic-content')).toHaveStyle(`color: ${COLOR_MAP[color]}`);
    });
  });

  /**
   * trend
   */

  test('trend', () => {
    render(
      <div>
        <Statistic title="Total Assets" value={82.76} unit="%" trend="increase" />
        <Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" />
      </div>,
    );

    const { container: upIcon } = render(<ArrowTriangleUpFilledIcon />);
    const { container: downIcon } = render(<ArrowTriangleDownFilledIcon />);

    expect(upIcon).toBeInTheDocument();
    expect(downIcon).toBeInTheDocument();
  });

  test('trendPlacement left', () => {
    render(<Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" />);

    expect(document.querySelector('.t-statistic-content-prefix')).toBeInTheDocument();
  });

  test('trendPlacement right', () => {
    render(<Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" trendPlacement="right" />);

    expect(document.querySelector('.t-statistic-content-suffix')).toBeInTheDocument();
  });

  /**
   * loading
   */

  test('loading', () => {
    render(<Statistic title="Total Assets" value={82.76} loading />);

    expect(document.querySelector('.t-statistic-title')).toHaveTextContent('Total Assets');

    expect(document.querySelector('.t-skeleton__row')).toBeInTheDocument();
  });

  /**
   * Start
   */

  test('Start Function', async () => {
    const TestDom = () => {
      const [start, setStart] = React.useState(false);

      return (
        <>
          <button id="button" onClick={() => setStart(true)}></button>
          <Statistic
            title="Total Assets"
            value={82.76}
            animation={{
              valueFrom: 0,
              duration: 2000,
            }}
            format={(value) => +value.toFixed(2)}
            animationStart={start}
          />
        </>
      );
    };
    render(<TestDom />);

    fireEvent.click(document.querySelector('#button'));

    await mockDelay(2000);

    expect(document.querySelector('.t-statistic-content-value')).toHaveTextContent('82.76');
  });

  /**
   * not animation config display value
   */
  test('not animation', async () => {
    render(<Statistic title="Total Assets" value={82.76} format={(value) => +value.toFixed(2)} />);

    expect(document.querySelector('.t-statistic-content-value')).toHaveTextContent('82.76');
  });

  /**
   * have animation config display valueFrom
   */
  test('not animation', async () => {
    render(
      <Statistic
        title="Total Assets"
        value={82.76}
        animation={{
          valueFrom: 0,
          duration: 2000,
        }}
        format={(value) => +value.toFixed(2)}
      />,
    );

    expect(document.querySelector('.t-statistic-content-value')).toHaveTextContent('0');
  });
});
