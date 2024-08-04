/* eslint-disable prefer-destructuring */
/*
 * @Author: Bin
 * @Date: 2022-04-07
 * @FilePath: /tdesign-react/src/progress/__tests__/progress.test.tsx
 */
import React from 'react';
import { render, waitFor } from '@test/utils';
import Progress from '../Progress';
import { ThemeEnum } from '../type';

describe('Progress 组件测试', () => {
  test('render theme', async () => {
    const testId = 'progress test theme';
    const themes: ThemeEnum[] = ['line', 'plump', 'circle'];
    const { getByTestId } = render(
      <div data-testid={testId}>
        {themes?.map((theme, index) => (
          <Progress key={index} strokeWidth={120} theme={theme} size={120} />
        ))}
      </div>,
    );

    const instance = await waitFor(() => getByTestId(testId));

    for (let index = 0; index < themes.length; index++) {
      const theme = themes[index];
      expect(() => instance.querySelector(`.t-progress--${theme}`)).not.toBe(null);
    }
  });

  test('render size', async () => {
    // const testId = 'progress test size';
    const sizes: any[] = [
      { name: 'small', size: 72 },
      { name: 'medium', size: 112 },
      { name: 'large', size: 160 },
      { name: 240, size: 240 },
    ];

    const createProgressSizeTest = async (sizeOjb: any) => {
      //   const sizeOjb = sizes[0];
      const testId = `progress test size ${sizeOjb.name}`;
      const view = render(
        <div data-testid={testId}>
          <Progress strokeWidth={'120px'} theme="circle" size={sizeOjb.name} />
        </div>,
      );
      const instance = await waitFor(() => view.getByTestId(testId));
      expect(instance.querySelector('.t-progress--circle')).toHaveStyle(`width: ${sizeOjb.size}px`);
    };

    await createProgressSizeTest(sizes[0]);
    await createProgressSizeTest(sizes[1]);
    await createProgressSizeTest(sizes[2]);
    await createProgressSizeTest(sizes[3]);
  });
});
