import React from 'react';
import { describe, it, expect, vi, render, fireEvent, act } from '@test/utils';
import { TypographyText } from '../index';
import Ellipsis from '../Ellipsis';

const prefix = 't';
const COMPONENT_NAME = `${prefix}-typography`;

const longText =
  'TDesign 秉承开放的设计理念从创立之初就采用开源协作的方式进行设计和开发。协作方案讨论、组件设计以及 API 设计，包括源代码在内均在公司内部完全开放，赢得了内部开发者和设计师的广泛关注。TDesign 遵循平等、开放、严格的原则，不论参与者的角色如何。';
const shortText = 'TDesign 是腾讯各业务团队在服务业务过程中沉淀的一套企业级设计体系。';

describe('TypographyText', () => {
  describe('props', () => {
    it(':children renders text content', () => {
      const { container } = render(<TypographyText>{shortText}</TypographyText>);
      const span = container.querySelector('span');
      expect(span).toBeTruthy();
      expect(span?.textContent).toContain(shortText);
      expect(container.querySelector(`.${COMPONENT_NAME}`)).toBeTruthy();
    });

    it(':code[Boolean]', () => {
      const { container } = render(<TypographyText code>{shortText}</TypographyText>);
      const code = container.querySelector('code');
      expect(code).toBeTruthy();
      expect(code?.textContent).toBe(shortText);
    });

    it(':delete[Boolean]', () => {
      const { container } = render(<TypographyText delete>{shortText}</TypographyText>);
      expect(container.querySelector('del')).toBeTruthy();
    });

    it(':italic[Boolean]', () => {
      const { container } = render(<TypographyText italic>{shortText}</TypographyText>);
      expect(container.querySelector('i')).toBeTruthy();
    });

    it(':keyboard[Boolean]', () => {
      const { container } = render(<TypographyText keyboard>{shortText}</TypographyText>);
      expect(container.querySelector('kbd')).toBeTruthy();
    });

    it(':mark[Boolean] renders mark tag with default style', () => {
      const { container } = render(<TypographyText mark>{shortText}</TypographyText>);
      const mark = container.querySelector('mark');
      expect(mark).toBeTruthy();
      // mark === true 时不传 backgroundColor
      expect(mark?.style.backgroundColor).toBe('');
    });

    it(':mark[String] renders mark with custom color', () => {
      const color = '#07c160';
      const { container } = render(<TypographyText mark={color}>{shortText}</TypographyText>);
      const mark = container.querySelector('mark') as HTMLElement;
      expect(mark).toBeTruthy();
      // jsdom 会把 hex 转成 rgb
      expect(mark.style.backgroundColor).toBe('rgb(7, 193, 96)');
    });

    it(':strong[Boolean]', () => {
      const { container } = render(<TypographyText strong>{shortText}</TypographyText>);
      expect(container.querySelector('strong')).toBeTruthy();
    });

    it(':underline[Boolean]', () => {
      const { container } = render(<TypographyText underline>{shortText}</TypographyText>);
      expect(container.querySelector('u')).toBeTruthy();
    });

    it(':disabled[Boolean] adds disabled class', () => {
      const { container } = render(<TypographyText disabled>{shortText}</TypographyText>);
      const node = container.querySelector(`.${COMPONENT_NAME}`);
      expect(node).toBeTruthy();
      expect(node?.classList.contains(`${COMPONENT_NAME}--disabled`)).toBe(true);
    });

    it.each(['primary', 'secondary', 'success', 'warning', 'error'] as const)(':theme - %s', (theme) => {
      const { container } = render(<TypographyText theme={theme}>{shortText}</TypographyText>);
      expect(container.querySelector(`.${COMPONENT_NAME}--${theme}`)).toBeTruthy();
    });

    it(':theme should not add class when disabled', () => {
      const { container } = render(
        <TypographyText theme="primary" disabled>
          {shortText}
        </TypographyText>,
      );
      const node = container.querySelector(`.${COMPONENT_NAME}`);
      expect(node?.classList.contains(`${COMPONENT_NAME}--disabled`)).toBe(true);
      expect(node?.classList.contains(`${COMPONENT_NAME}--primary`)).toBe(false);
    });

    it('combines multiple decorations', () => {
      const { container } = render(
        <TypographyText strong italic underline code>
          {shortText}
        </TypographyText>,
      );
      expect(container.querySelector('strong')).toBeTruthy();
      expect(container.querySelector('i')).toBeTruthy();
      expect(container.querySelector('u')).toBeTruthy();
      expect(container.querySelector('code')).toBeTruthy();
    });

    it('supports custom className and style', () => {
      const { container } = render(
        <TypographyText className="custom-cls" style={{ color: 'red' }}>
          {shortText}
        </TypographyText>,
      );
      const node = container.querySelector(`.${COMPONENT_NAME}`) as HTMLElement;
      expect(node.classList.contains('custom-cls')).toBe(true);
      expect(node.style.color).toBe('red');
    });
  });

  describe('copyable', () => {
    it(':copyable[Boolean] renders copy button', () => {
      const { container } = render(<TypographyText copyable>{shortText}</TypographyText>);
      expect(container.querySelector(`.${COMPONENT_NAME}__copy`)).toBeTruthy();
    });

    it(':copyable[Object] triggers onCopy callback on click', () => {
      const handleCopy = vi.fn();
      const { container } = render(<TypographyText copyable={{ onCopy: handleCopy }}>{shortText}</TypographyText>);
      const copyBtn = container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement;
      expect(copyBtn).toBeTruthy();
      fireEvent.click(copyBtn);
      expect(handleCopy).toHaveBeenCalled();
    });

    it(':copyable[Object] uses custom text option', () => {
      const handleCopy = vi.fn();
      const customText = '自定义复制文本';
      const { container } = render(
        <TypographyText copyable={{ text: customText, onCopy: handleCopy }}>{shortText}</TypographyText>,
      );
      const copyBtn = container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement;
      fireEvent.click(copyBtn);
      expect(handleCopy).toHaveBeenCalled();
    });

    it(':copyable[Object] with custom suffix function', () => {
      const suffix = ({ copied }: { copied: boolean }) => (
        <span className="custom-icon">{copied ? '已复制' : '复制'}</span>
      );
      const { container } = render(<TypographyText copyable={{ suffix }}>{shortText}</TypographyText>);
      expect(container.querySelector('.custom-icon')).toBeTruthy();
      expect(container.querySelector('.custom-icon')?.textContent).toBe('复制');
    });

    it(':copyable[Object] with ReactNode suffix', () => {
      const { container } = render(
        <TypographyText copyable={{ suffix: <span className="vnode-suffix">复制</span> }}>{shortText}</TypographyText>,
      );
      expect(container.querySelector('.vnode-suffix')).toBeTruthy();
    });

    it(':copyable icon switches to check after click and reverts after timeout', () => {
      vi.useFakeTimers();
      const suffix = ({ copied }: { copied: boolean }) => <span className="status">{copied ? 'copied' : 'idle'}</span>;
      const { container } = render(<TypographyText copyable={{ suffix }}>{shortText}</TypographyText>);

      expect(container.querySelector('.status')?.textContent).toBe('idle');
      const copyBtn = container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement;

      act(() => {
        fireEvent.click(copyBtn);
      });
      expect(container.querySelector('.status')?.textContent).toBe('copied');

      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(container.querySelector('.status')?.textContent).toBe('idle');
      vi.useRealTimers();
    });

    it(':copyable copies array string children', () => {
      const handleCopy = vi.fn();
      const { container } = render(
        <TypographyText copyable={{ onCopy: handleCopy }}>
          {'foo'}
          {'bar'}
        </TypographyText>,
      );
      fireEvent.click(container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement);
      expect(handleCopy).toHaveBeenCalled();
    });

    it(':copyable handles array children with mixed string and node', () => {
      const handleCopy = vi.fn();
      const { container } = render(
        <TypographyText copyable={{ onCopy: handleCopy }}>
          {'plain text'}
          <span key="node">node-text</span>
          {'tail'}
        </TypographyText>,
      );
      fireEvent.click(container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement);
      // 数组子节点中包含非字符串元素，分支：return ''
      expect(handleCopy).toHaveBeenCalled();
    });

    it(':copyable with non-string children still triggers onCopy', () => {
      const handleCopy = vi.fn();
      const { container } = render(
        <TypographyText copyable={{ onCopy: handleCopy }}>
          <div>nested</div>
        </TypographyText>,
      );
      fireEvent.click(container.querySelector(`.${COMPONENT_NAME}__copy`) as HTMLElement);
      expect(handleCopy).toHaveBeenCalled();
    });

    it(':copyable with ellipsis renders copy button inside ellipsis container', () => {
      const { container } = render(
        <TypographyText ellipsis copyable>
          {longText}
        </TypographyText>,
      );
      expect(container.querySelector(`.${COMPONENT_NAME}__copy`)).toBeTruthy();
    });
  });

  describe('ellipsis', () => {
    it(':ellipsis[Boolean] applies ellipsis styles', () => {
      const { container } = render(<TypographyText ellipsis>{longText}</TypographyText>);
      const p = container.querySelector('p') as HTMLElement;
      expect(p).toBeTruthy();
      expect(p.style.overflow).toBe('hidden');
      expect(p.style.textOverflow).toBe('ellipsis');
    });

    it(':ellipsis[Object] with row', () => {
      const { container } = render(<TypographyText ellipsis={{ row: 2 }}>{longText}</TypographyText>);
      const p = container.querySelector('p') as HTMLElement;
      expect(p.style.overflow).toBe('hidden');
    });

    it(':ellipsis[Object] with expandable shows expand symbol', () => {
      const onExpand = vi.fn();
      const { container } = render(
        <TypographyText ellipsis={{ row: 1, expandable: true, onExpand }}>{longText}</TypographyText>,
      );
      const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`);
      expect(symbol).toBeTruthy();
      expect(symbol?.textContent).toContain('展开');

      fireEvent.click(symbol as HTMLElement);
      expect(onExpand).toHaveBeenCalledWith(true);
    });

    it(':ellipsis[Object] with collapsible can expand and collapse', () => {
      const onExpand = vi.fn();
      const { container } = render(
        <TypographyText ellipsis={{ row: 1, expandable: true, collapsible: true, onExpand }}>
          {longText}
        </TypographyText>,
      );

      const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
      fireEvent.click(symbol);
      expect(onExpand).toHaveBeenCalledWith(true);

      const collapseSymbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`);
      expect(collapseSymbol?.textContent).toContain('收起');
      fireEvent.click(collapseSymbol as HTMLElement);
      expect(onExpand).toHaveBeenCalledWith(false);
    });

    it(':ellipsis[Object] with collapsible=false hides symbol after expand', () => {
      const { container } = render(
        <TypographyText ellipsis={{ row: 1, expandable: true, collapsible: false }}>{longText}</TypographyText>,
      );

      const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
      fireEvent.click(symbol);
      expect(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`)).toBeNull();
    });

    it(':ellipsis[Object] with custom suffix function', () => {
      const suffix = ({ expanded }: { expanded: boolean }) => (
        <span className="custom-suffix">{expanded ? '收起' : '更多'}</span>
      );
      const { container } = render(<TypographyText ellipsis={{ expandable: true, suffix }}>{longText}</TypographyText>);
      const customSuffix = container.querySelector('.custom-suffix');
      expect(customSuffix).toBeTruthy();
      expect(customSuffix?.textContent).toBe('更多');
    });

    it(':ellipsis[Object] without expandable does not render expand symbol', () => {
      const { container } = render(
        <TypographyText ellipsis={{ row: 2, expandable: false }}>{longText}</TypographyText>,
      );
      expect(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`)).toBeNull();
    });
  });
});

describe('Ellipsis component', () => {
  it('renders children content', () => {
    const { container } = render(<Ellipsis ellipsis>{longText}</Ellipsis>);
    expect(container.textContent).toContain(longText);
  });

  it('default row is 1', () => {
    const { container } = render(<Ellipsis ellipsis>{longText}</Ellipsis>);
    const p = container.querySelector('p') as HTMLElement;
    // jsdom 把 webkitLineClamp 序列化到 style 属性
    expect(p.getAttribute('style')).toContain('1');
  });

  it(':ellipsis[Object] with row=2', () => {
    const { container } = render(<Ellipsis ellipsis={{ row: 2 }}>{longText}</Ellipsis>);
    const p = container.querySelector('p') as HTMLElement;
    expect(p.style.overflow).toBe('hidden');
  });

  it('expand toggles overflow/display style and triggers onExpand for collapse', () => {
    const onExpand = vi.fn();
    const { container } = render(
      <Ellipsis ellipsis={{ expandable: true, collapsible: true, onExpand }}>{longText}</Ellipsis>,
    );
    const expandSymbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    fireEvent.click(expandSymbol);

    const p = container.querySelector('p') as HTMLElement;
    expect(p.style.overflow).toBe('visible');
    expect(p.style.display).toBe('initial');
    expect(onExpand).toHaveBeenCalledWith(true);

    fireEvent.click(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement);
    expect(p.style.overflow).toBe('hidden');
    expect(onExpand).toHaveBeenCalledWith(false);
  });

  it('default expandable is false: no expand symbol when ellipsis is true', () => {
    const { container } = render(<Ellipsis ellipsis>{longText}</Ellipsis>);
    expect(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`)).toBeNull();
  });

  it('custom suffix function receives expanded state', () => {
    const suffix = vi.fn(({ expanded }: { expanded: boolean }) => (
      <span className="my-suffix">{expanded ? '收起' : '展开更多'}</span>
    ));
    const { container } = render(
      <Ellipsis ellipsis={{ expandable: true, collapsible: true, suffix }}>{longText}</Ellipsis>,
    );
    expect(container.querySelector('.my-suffix')?.textContent).toBe('展开更多');

    fireEvent.click(container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement);
    expect(container.querySelector('.my-suffix')?.textContent).toBe('收起');
  });

  it('non-function suffix renders as-is', () => {
    const { container } = render(
      <Ellipsis ellipsis={{ expandable: true, suffix: <span className="static-suffix">查看更多</span> }}>
        {longText}
      </Ellipsis>,
    );
    expect(container.querySelector('.static-suffix')?.textContent).toBe('查看更多');
  });

  it('renderCopy renders the copy button and adds marginRight 8 to symbol', () => {
    const renderCopy = () => <span className="copy-btn">复制</span>;
    const { container } = render(
      <Ellipsis ellipsis={{ expandable: true }} renderCopy={renderCopy}>
        {longText}
      </Ellipsis>,
    );
    expect(container.querySelector('.copy-btn')).toBeTruthy();
    const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    expect(symbol.style.marginRight).toBe('8px');
  });

  it('expand symbol has marginRight 0 without renderCopy', () => {
    const { container } = render(<Ellipsis ellipsis={{ expandable: true }}>{longText}</Ellipsis>);
    const symbol = container.querySelector(`.${COMPONENT_NAME}-ellipsis-symbol`) as HTMLElement;
    expect(symbol.style.marginRight).toBe('0px');
  });

  it('without ellipsis prop: p has no ellipsis style', () => {
    const { container } = render(<Ellipsis ellipsis={false}>{longText}</Ellipsis>);
    const p = container.querySelector('p') as HTMLElement;
    expect(p.style.overflow).not.toBe('hidden');
  });

  it('outer wrapper uses flex layout and merges custom style/className', () => {
    const { container } = render(
      <Ellipsis ellipsis className="custom-ellipsis" style={{ background: 'red' }}>
        {longText}
      </Ellipsis>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.alignItems).toBe('flex-end');
    expect(wrapper.style.background).toBe('red');
    expect(wrapper.classList.contains('custom-ellipsis')).toBe(true);
  });
});
