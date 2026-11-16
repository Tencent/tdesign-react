import React from 'react';
import { AngryIcon, SmileIcon } from 'tdesign-icons-react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import { Typography } from '..';

const { Text, Title, Paragraph } = Typography;

const longTextString = `TDesign was founded with the principles of open-source collaboration from the beginning. The collaboration scheme discussion, component design, and API design, including source code, are fully open within the company, garnering widespread attention from internal developers and designers. TDesign follows an equal, open, and strict policy, regardless of the participants' roles.`;

const shortText = 'TDesign was founded with the principles of open-source collaboration from the beginning.';

describe('Typography', () => {
  const mockGetCanvasContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
  const mockGetCanvasToDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL');

  beforeAll(() => {
    mockGetCanvasContext.mockReturnValue({
      font: vi.fn(),
      measureText: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    mockGetCanvasToDataURL.mockReturnValue('test');
  });

  describe('props', () => {
    test('Title.children', async () => {
      const { container } = render(<Title>{shortText}</Title>);
      expect((container.firstChild as HTMLElement).innerHTML).toBe(shortText);
    });

    test('Paragraph.children', async () => {
      const { container } = render(<Paragraph>{shortText}</Paragraph>);
      expect((container.firstChild as HTMLElement).innerHTML).toBe(shortText);
    });

    test('Text.children', async () => {
      const { container } = render(<Text>{shortText}</Text>);
      expect((container.firstChild as HTMLElement).innerHTML).toBe(shortText);
    });

    test('Text.code', async () => {
      const { container } = render(<Text code>{shortText}</Text>);
      expect(container.querySelector('code').innerHTML).toBe(shortText);
    });

    window.innerWidth = 1280;
    test('ellipsis', async () => {
      const { container } = render(<Paragraph ellipsis>{longTextString}</Paragraph>);
      expect(container.querySelector('.t-typography-ellipsis-symbol-wrapper')).toHaveTextContent('...');
    });

    test('copyable.suffix', async () => {
      const { container } = render(
        <Text
          copyable={{
            suffix: ({ copied }) => (copied ? <SmileIcon /> : <AngryIcon />),
          }}
        >
          {shortText}
        </Text>,
      );

      expect(container.querySelector('.t-icon-angry')).toBeTruthy();
      fireEvent.click(container.querySelector('.t-button'));
      expect(container.querySelector('.t-icon-smile')).toBeTruthy();
    });

    test('Title.ellipsis', async () => {
      const { container } = render(<Title ellipsis>{longTextString}</Title>);
      expect(container.querySelector('.t-typography-ellipsis-symbol-wrapper')).toHaveTextContent('...');
      expect(container.querySelectorAll('h1')).toHaveLength(1);
    });

    test('ellipsis.tooltipProps', async () => {
      const handleExpand = vi.fn();
      const { container } = render(
        <Paragraph
          ellipsis={{
            collapsible: true,
            onExpand: handleExpand,
            expandable: true,
            tooltipProps: { content: '点击展开' },
          }}
        >
          {longTextString}
        </Paragraph>,
      );

      // 模拟鼠标进入
      fireEvent.mouseEnter(container.querySelector('.t-trigger'));
      await mockDelay(600);
      expect(container.querySelector('.t-popup-open')).toBeTruthy();
    });

    test('Text.strong with ellipsis', async () => {
      const { container } = render(
        <Text strong ellipsis>
          {longTextString}
        </Text>,
      );
      expect(container.querySelector('.t-typography-ellipsis-symbol-wrapper')).toHaveTextContent('...');
      expect(container.querySelectorAll('strong')).toHaveLength(1);
    });
  });

  describe('events', () => {
    test('ellipsis.onExpand', async () => {
      const handleExpand = vi.fn();
      const { container } = render(
        <Paragraph
          ellipsis={{
            collapsible: true,
            onExpand: handleExpand,
            expandable: true,
          }}
        >
          {longTextString}
        </Paragraph>,
      );
      expect(container.querySelector('.t-typography-ellipsis-symbol')).toBeInTheDocument();
      expect(container.querySelector('.t-typography-ellipsis-symbol').innerHTML).toBe('展开');

      fireEvent.click(container.querySelector('.t-typography-ellipsis-symbol'));
      expect(handleExpand).toHaveBeenCalled();
      expect(container.querySelector('.t-typography-ellipsis-symbol').innerHTML).toBe('收起');
    });

    test('copyable.onCopy', async () => {
      const handleCopy = vi.fn();
      const { container } = render(<Text copyable={{ onCopy: handleCopy }}>{shortText}</Text>);

      fireEvent.click(container.querySelector('.t-button'));
      expect(handleCopy).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    test('ellipsis escapes HTML content', async () => {
      const htmlStrings = [
        { text: '<b>bold text</b>', tag: 'b' },
        { text: '<a href="https://example.com">link</a>', tag: 'a' },
        { text: '<script>alert("xss")</script>', tag: 'script' },
      ];

      for (const { text, tag } of htmlStrings) {
        const { container, unmount } = render(
          <div style={{ width: 200 }}>
            <Text ellipsis>{text}</Text>
          </div>,
        );
        expect(container.querySelector(tag)).toBeNull();
        expect(container.querySelector('.t-typography-ellipsis-symbol-wrapper')).toHaveTextContent('...');
        unmount();
      }
    });
  });
});
