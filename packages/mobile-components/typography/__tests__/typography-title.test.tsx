import React from 'react';
import { describe, it, expect, vi, render, fireEvent } from '@test/utils';
import { TypographyTitle } from '../index';

const prefix = 't';
const COMPONENT_NAME = `${prefix}-typography`;

const longText =
  'TDesign 秉承开放的设计理念从创立之初就采用开源协作的方式进行设计和开发。协作方案讨论、组件设计以及 API 设计，包括源代码在内均在公司内部完全开放，赢得了内部开发者和设计师的广泛关注。TDesign 遵循平等、开放、严格的原则，不论参与者的角色如何。';
const shortText = 'TDesign 是腾讯各业务团队在服务业务过程中沉淀的一套企业级设计体系。';

describe('TypographyTitle', () => {
  it(':children renders default h1 tag with class', () => {
    const { container } = render(<TypographyTitle>{shortText}</TypographyTitle>);
    const h1 = container.querySelector(`h1.${COMPONENT_NAME}`);
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toContain(shortText);
  });

  it(':content[String] renders string content', () => {
    const { container } = render(<TypographyTitle content={shortText} />);
    expect(container.querySelector('h1')?.textContent).toBe(shortText);
  });

  it('children takes precedence over content prop', () => {
    const { container } = render(<TypographyTitle content="content-text">children-text</TypographyTitle>);
    expect(container.querySelector('h1')?.textContent).toBe('children-text');
  });

  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(':level - %s', (level) => {
    const { container } = render(<TypographyTitle level={level}>{shortText}</TypographyTitle>);
    expect(container.querySelector(level)).toBeTruthy();
  });

  it(':ellipsis[Boolean] wraps title in Ellipsis container', () => {
    const { container } = render(<TypographyTitle ellipsis>{longText}</TypographyTitle>);
    expect(container.querySelector(`.${COMPONENT_NAME}`)).toBeTruthy();
    expect(container.querySelector('h1')).toBeTruthy();
    expect(container.querySelector('p')).toBeTruthy();
  });

  it(':ellipsis with content prop', () => {
    const { container } = render(<TypographyTitle ellipsis content={longText} />);
    expect(container.querySelector('h1')?.textContent).toBe(longText);
  });

  it(':ellipsis[Object] with expandable and collapsible', () => {
    const onExpand = vi.fn();
    const { container } = render(
      <TypographyTitle ellipsis={{ row: 1, expandable: true, collapsible: true, onExpand }}>
        {longText}
      </TypographyTitle>,
    );
    const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    expect(symbol).toBeTruthy();
    fireEvent.click(symbol);
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it('supports custom className and style', () => {
    const { container } = render(
      <TypographyTitle className="custom-title" style={{ color: 'blue' }}>
        {shortText}
      </TypographyTitle>,
    );
    const node = container.querySelector(`.${COMPONENT_NAME}`) as HTMLElement;
    expect(node.classList.contains('custom-title')).toBe(true);
    expect(node.style.color).toBe('blue');
  });
});
