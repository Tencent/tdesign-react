import React from 'react';
import { render, fireEvent, mockDelay } from '@test/utils';
import { ArrowTriangleDownFilledIcon, ArrowTriangleUpFilledIcon } from 'tdesign-icons-react';
import { COLOR_MAP } from '@tdesign/common-js/statistic/utils';
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
   * props
   */

  it('color="yellow"', () => {
    const { container } = render(<Statistic title="Total Sales" value={1000} color="yellow" />);

    const contentElement = container.querySelector('.t-statistic-content');
    expect(contentElement).toHaveStyle('color: yellow');
  });

  it('color="#fff123"', () => {
    const { container } = render(<Statistic title="Total Sales" value={1000} color="#fff123" />);

    const contentElement = container.querySelector('.t-statistic-content');
    expect(contentElement).toHaveStyle('color: #fff123');
  });

  it('colors: colorKeys', () => {
    Object.keys(COLOR_MAP).forEach((color) => {
      const { container } = render(<Statistic title="Total Sales" value={1000} color={color} />);

      const contentElement = container.querySelector('.t-statistic-content');
      expect(contentElement).toBeTruthy();
      const expectedColor = COLOR_MAP[color as keyof typeof COLOR_MAP];
      expect(contentElement).toHaveStyle(`color: ${expectedColor}`);
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
