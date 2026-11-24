import React from 'react';
import { describe, it, expect, render } from '@test/utils';
import { Typography, TypographyText, TypographyTitle, TypographyParagraph } from '../index';

describe('Typography', () => {
  it('exports all sub-components', () => {
    expect(Typography).toBeDefined();
    expect(TypographyText).toBeDefined();
    expect(TypographyTitle).toBeDefined();
    expect(TypographyParagraph).toBeDefined();
  });

  it('Typography object has Text/Title/Paragraph properties', () => {
    expect(Typography.Text).toBe(TypographyText);
    expect(Typography.Title).toBe(TypographyTitle);
    expect(Typography.Paragraph).toBe(TypographyParagraph);
  });

  it('Typography itself renders null (acts as namespace)', () => {
    // Typography 是一个返回 null 的命名空间函数组件，通过 createElement 调用以兼容类型
    const { container } = render(React.createElement(Typography as unknown as React.FC));
    expect(container.firstChild).toBeNull();
  });
});
