import React from 'react';
import { describe, expect, it, render, waitFor } from '@test/utils';
import getBackgroundColor from '../../_util/linearGradient';
import { getCircleStokeWidth } from '../../_common/js/progress/utils';
import Progress, { ProgressProps } from '../index';
import { ProgressTheme } from '../type';

describe('Progress', () => {
  describe('utils/getBackgroundColor', () => {
    it(':color', () => {
      expect(getBackgroundColor('red')).toEqual('red');

      expect(getBackgroundColor(['#000', '#fff'])).toEqual('linear-gradient( 90deg,#000,#fff )');

      expect(
        getBackgroundColor({
          '0%': '#f00',
          '100%': '#0ff',
        }),
      ).toEqual('linear-gradient(to right, #f00 0%,#0ff 100%)');
    });
  });

  describe('props', () => {
    it(':status', async () => {
      const statuses: ('success' | 'error' | 'warning' | 'active')[] = ['success', 'error', 'warning', 'active'];

      const checkStatus = async (status: ProgressProps['status']) => {
        const { container } = render(<Progress percentage={80} status={status} />);
        expect(container.querySelector(`.t-progress--status-${status}`)).toBeTruthy();
      };
      statuses.forEach(checkStatus);
    });

    it(':theme', async () => {
      const themes: ProgressTheme[] = ['line', 'plump', 'circle'];
      const checkThemes = async (theme: ProgressProps['theme']) => {
        const { container } = render(<Progress strokeWidth={120} theme={theme} percentage={80} />);
        expect(() => container.querySelector(`.t-progress--${theme}`)).toBeTruthy();
      };
      themes.forEach(checkThemes);
    });

    it(':size', async () => {
      const sizes = [
        { name: 'default', size: 112 },
        { name: 'micro', size: 24 },
        { name: 240, size: 240 },
      ];

      const checkSizes = async (sizeObj: { name: string; size: number }) => {
        const { container } = render(
          <Progress strokeWidth={'120px'} theme="circle" size={sizeObj.name} percentage={80} />,
        );
        expect(container.querySelector('.t-progress--circle')).toHaveStyle(`width: ${sizeObj.size}px`);
      };
      sizes.forEach(checkSizes);
    });

    it(':color string', async () => {
      const colors = ['#ED7B2F', 'pink', 'rgb(255, 192, 203)'];
      const checkColor = async (color: ProgressProps['color']) => {
        const { container } = render(<Progress strokeWidth={120} theme="line" percentage={80} color={color} />);

        expect(container.querySelector(`.t-progress__inner`)).toHaveStyle(`background: ${color};`);
      };

      colors.forEach(checkColor);
    });

    it(':color object', async () => {
      const colors = [{ from: '#000', to: '#000' }, { '0%': '#f00', '100%': '#0ff' }, ['#000', '#fff']];
      const checkColor = async (color: ProgressProps['color']) => {
        const { container } = render(<Progress strokeWidth={120} theme="line" percentage={80} color={color} />);
        expect(container.querySelector(`.t-progress__inner`)).toHaveStyle(`background: ${getBackgroundColor(color)};`);
      };

      colors.forEach(checkColor);
    });

    it(':label string', async () => {
      const label = 'test';
      const { container } = render(<Progress label={label} />);
      expect(container.querySelector(`.t-progress__info`)).toHaveTextContent(label);
    });

    it(':label boolean', async () => {
      const label = false;
      const { container } = render(<Progress label={label} />);
      expect(container.querySelector(`.t-progress__info`)).toBeFalsy();
    });

    it(':label function', async () => {
      const label = () => 'test';
      const { container } = render(<Progress label={label} />);
      expect(container.querySelector(`.t-progress__info`)).toHaveTextContent(label());
    });

    it(':percentage', async () => {
      const percentage = 30;
      const { container } = render(<Progress percentage={percentage} />);
      expect(container.querySelector(`.t-progress__info`)).toHaveTextContent(`${percentage}%`);
    });

    it(':trackColor(line or plump)', async () => {
      const trackColor = '#ED7B2F';
      const { container } = render(<Progress theme="line" trackColor={trackColor} />);
      expect(container.querySelector(`.t-progress__bar`)).toHaveStyle(`background-color: ${trackColor};`);
    });

    it('trackColor(circle)', async () => {
      const trackColor = '#ED7B2F';
      const { container } = render(<Progress theme="circle" trackColor={trackColor} />);
      expect(container.querySelector(`.t-progress__circle-outer`).getAttribute('stroke')).toEqual(trackColor);
    });

    it('strokeWidth && theme && status && label', async () => {
      // 场景设置
      const progressList: any[] = [
        {
          key: 0,
          label: 'label test',
          strokeWidth: 120,
          theme: 'line',
          targetClass: 't-progress__bar',
          status: 'active',
          percentage: 100,
        },
        {
          key: 1,
          label: () => 'label test',
          strokeWidth: 120,
          theme: 'line',
          targetClass: 't-progress__bar',
          status: 'success',
          percentage: 80,
        },
        {
          key: 2,
          label: false,
          strokeWidth: 120,
          theme: 'line',
          targetClass: 't-progress__bar',
          status: 'warning',
          percentage: 80,
        },
        {
          key: 3,
          label: true,
          strokeWidth: 120,
          theme: 'line',
          targetClass: 't-progress__bar',
          status: 'error',
          percentage: 80,
        },
        {
          key: 4,
          label: true,
          strokeWidth: '120px',
          theme: 'plump',
          targetClass: 't-progress__bar',
          status: 'success',
          percentage: 10,
        },
        {
          key: 5,
          label: true,
          strokeWidth: 120,
          theme: 'plump',
          targetClass: 't-progress__bar',
          status: 'error',
          percentage: 80,
        },
        {
          key: 6,
          label: true,
          strokeWidth: 120,
          theme: 'circle',
          targetClass: 't-progress__circle-inner',
          status: 'success',
          percentage: 80,
        },
      ];

      const createProgressTest = async (progress: any) => {
        const testId = `progress test scene ${progress.key}`;
        const { getByTestId, container } = render(
          <div data-testid={testId}>
            <Progress
              label={progress.label}
              strokeWidth={progress.strokeWidth}
              theme={progress.theme}
              status={progress.status}
              percentage={progress.percentage}
            />
          </div>,
        );
        const instance = await waitFor(() => getByTestId(testId));

        // label props
        if (progress.label) {
          if (typeof progress.label === 'string') {
            expect(instance.querySelector(`.t-progress__info`)).toHaveTextContent(progress.label);
          } else if (typeof progress.label === 'function') {
            expect(instance.querySelector(`.t-progress__info`)).toHaveTextContent(progress.label());
          } else {
            if (progress.status && progress.theme !== 'plump') {
              // line、 circle 会根据 statue 使用默认图标
              const icon = container.querySelector('.t-progress__info svg');
              expect(icon).toBeInTheDocument();
              return;
            }

            expect(instance.querySelector(`.t-progress__info`)).toHaveTextContent(`${progress.percentage}%`);
          }
        } else {
          // label = false
          expect(instance.querySelector(`.t-progress__info`)).toBeFalsy();
        }

        // strokeWidth, color and percentage props
        if (progress.theme !== 'circle') {
          const height = typeof progress.strokeWidth === 'number' ? `${progress.strokeWidth}px` : progress.strokeWidth;

          expect(instance.querySelector(`.${progress.targetClass}`)).toHaveStyle(
            `height: ${height}; border-radius: ${height};`,
          );

          expect(instance.querySelector(`.t-progress__inner`)).toHaveStyle(`width: ${progress.percentage}%;`);
        } else {
          const size = 112;
          const circleStokeWidth = getCircleStokeWidth(progress.strokeWidth, size);
          const strokeLinecap = circleStokeWidth < 30 ? 'round' : 'buff';
          expect(instance.querySelector(`.${progress.targetClass}`)).toHaveStyle(
            `stroke: ${progress.color}; stroke-linecap: ${strokeLinecap}`,
          );
        }
      };
      await createProgressTest(progressList[0]);
      await createProgressTest(progressList[1]);
      await createProgressTest(progressList[2]);
      await createProgressTest(progressList[3]);
      await createProgressTest(progressList[4]);
      await createProgressTest(progressList[5]);
      await createProgressTest(progressList[6]);
    });
  });
});
