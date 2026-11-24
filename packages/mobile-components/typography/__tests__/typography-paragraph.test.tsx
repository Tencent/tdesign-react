import React from 'react';
import { describe, it, expect, vi, render, fireEvent } from '@test/utils';
import { TypographyParagraph } from '../index';

const prefix = 't';
const COMPONENT_NAME = `${prefix}-typography`;

const longText =
  'TDesign 秉承开放的设计理念从创立之初就采用开源协作的方式进行设计和开发。协作方案讨论、组件设计以及 API 设计，包括源代码在内均在公司内部完全开放，赢得了内部开发者和设计师的广泛关注。TDesign 遵循平等、开放、严格的原则，不论参与者的角色如何。';
const shortText = 'TDesign 是腾讯各业务团队在服务业务过程中沉淀的一套企业级设计体系。';

describe('TypographyParagraph', () => {
  it(':children renders div tag with class', () => {
    const { container } = render(<TypographyParagraph>{shortText}</TypographyParagraph>);
    const node = container.querySelector(`div.${COMPONENT_NAME}`);
    expect(node).toBeTruthy();
    expect(node?.textContent).toContain(shortText);
  });

  it(':content[String]', () => {
    const { container } = render(<TypographyParagraph content={shortText} />);
    expect(container.querySelector(`.${COMPONENT_NAME}`)?.textContent).toBe(shortText);
  });

  it('children takes precedence over content prop', () => {
    const { container } = render(<TypographyParagraph content="content-text">children-text</TypographyParagraph>);
    expect(container.querySelector(`.${COMPONENT_NAME}`)?.textContent).toBe('children-text');
  });

  it(':ellipsis[Boolean] renders Ellipsis wrapper with p tag', () => {
    const { container } = render(<TypographyParagraph ellipsis>{longText}</TypographyParagraph>);
    expect(container.querySelector(`.${COMPONENT_NAME}`)).toBeTruthy();
    expect(container.querySelector('p')).toBeTruthy();
  });

  it(':ellipsis[Object] with expandable triggers expand', () => {
    const onExpand = vi.fn();
    const { container } = render(
      <TypographyParagraph ellipsis={{ row: 2, expandable: true, onExpand }}>{longText}</TypographyParagraph>,
    );
    const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    expect(symbol).toBeTruthy();
    fireEvent.click(symbol);
    expect(onExpand).toHaveBeenCalledWith(true);
  });

  it(':ellipsis[Object] with collapsible can collapse after expand', () => {
    const onExpand = vi.fn();
    const { container } = render(
      <TypographyParagraph ellipsis={{ expandable: true, collapsible: true, onExpand }}>
        {longText}
      </TypographyParagraph>,
    );
    const expandSymbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    fireEvent.click(expandSymbol);

    const collapseSymbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    expect(collapseSymbol.textContent).toContain('收起');
    fireEvent.click(collapseSymbol);
    expect(onExpand).toHaveBeenLastCalledWith(false);
  });

  it(':ellipsis[Object] with expandable=false does not show expand symbol', () => {
    const { container } = render(
      <TypographyParagraph ellipsis={{ row: 2, expandable: false }}>{longText}</TypographyParagraph>,
    );
    expect(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`)).toBeNull();
  });

  it('supports custom className and style', () => {
    const { container } = render(
      <TypographyParagraph className="custom-para" style={{ margin: '10px' }}>
        {shortText}
      </TypographyParagraph>,
    );
    const node = container.querySelector(`.${COMPONENT_NAME}`) as HTMLElement;
    expect(node.classList.contains('custom-para')).toBe(true);
    expect(node.style.margin).toBe('10px');
  });
});
