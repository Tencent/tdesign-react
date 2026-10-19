import React from 'react';
import { ArrowTriangleDownFilledIcon, ArrowTriangleUpFilledIcon } from 'tdesign-icons-react';
import { COLOR_MAP } from '@tdesign/common-js/statistic/utils';
import { fireEvent, mockDelay, render } from '@test/utils';

import Statistic from '../index';

describe('Statistic', () => {
  describe('props', () => {
    test('color[string]', () => {
      const title = 'Total Sales';
      const value = 1000;

      const { container: keywordContainer } = render(<Statistic title={title} value={value} color="yellow" />);
      expect(keywordContainer.querySelector('.t-statistic-content')).toHaveStyle('color: yellow');

      const customHex = '#fff123';
      const { container: hexContainer } = render(<Statistic title={title} value={value} color={customHex} />);
      expect(hexContainer.querySelector('.t-statistic-content')).toHaveStyle(`color: ${customHex}`);

      Object.keys(COLOR_MAP).forEach((colorKey) => {
        const { container } = render(
          <Statistic title={title} value={value} color={colorKey as keyof typeof COLOR_MAP} />,
        );
        const contentElement = container.querySelector('.t-statistic-content');
        expect(contentElement).toBeTruthy();
        expect(contentElement).toHaveStyle(`color: ${COLOR_MAP[colorKey as keyof typeof COLOR_MAP]}`);
      });
    });

    test.each([
      ['increase', <ArrowTriangleUpFilledIcon key="increase" />],
      ['decrease', <ArrowTriangleDownFilledIcon key="decrease" />],
    ] as const)('trend[%s]', (trend, icon) => {
      render(<Statistic title="Total Assets" value={82.76} unit="%" trend={trend} />);
      const { container } = render(icon);
      expect(container).toBeInTheDocument();
    });

    test('trendPlacement[left]', () => {
      render(<Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" />);
      expect(document.querySelector('.t-statistic-content-prefix')).toBeInTheDocument();
    });

    test('trendPlacement[right]', () => {
      render(<Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" trendPlacement="right" />);
      expect(document.querySelector('.t-statistic-content-suffix')).toBeInTheDocument();
    });

    test('loading', () => {
      render(<Statistic title="Total Assets" value={82.76} loading />);
      expect(document.querySelector('.t-statistic-title')).toHaveTextContent('Total Assets');
      expect(document.querySelector('.t-skeleton__row')).toBeInTheDocument();
    });

    test('animation[false]', () => {
      render(<Statistic title="Total Assets" value={82.76} format={(value) => +value.toFixed(2)} />);
      expect(document.querySelector('.t-statistic-content-value')).toHaveTextContent('82.76');
    });

    test('animation[object]', () => {
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

    test('title[string] and unit[string]', () => {
      render(<Statistic title="Total Assets" value={82.76} unit="%" trend="increase" color="black" />);
      expect(document.querySelector('.t-statistic-title')).toHaveTextContent('Total Assets');
      expect(document.querySelector('.t-statistic-content-unit')).toHaveTextContent('%');
    });
  });

  describe('scenarios', () => {
    test('animation with animationStart delays transition until triggered', async () => {
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
  });
});
