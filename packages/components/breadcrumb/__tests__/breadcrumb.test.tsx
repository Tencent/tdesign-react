import React from 'react';
import { render, vi } from '@test/utils';

import Breadcrumb from '../Breadcrumb';

import type { TdBreadcrumbItemProps } from '../type';

const { BreadcrumbItem } = Breadcrumb;

describe('Breadcrumb', () => {
  const rootTestID = 'breadcrumbRoot';
  const childTestID = 'breadcrumbChild';

  describe('props', () => {
    test('options[array<TdBreadcrumbItemProps>]', () => {
      const contentShouldNotBeExist = 'hello';
      const options = [{ content: '页面1' }, { content: '页面2' }, { content: '页面3' }];
      const el = (
        <Breadcrumb options={options} data-testid={rootTestID}>
          <BreadcrumbItem>{contentShouldNotBeExist}</BreadcrumbItem>
        </Breadcrumb>
      );
      const wrapper = render(el);

      const root = wrapper.getByTestId(rootTestID);

      expect(root.childNodes).toHaveLength(options.length);
      expect(root).not.toHaveTextContent(contentShouldNotBeExist);
      root.childNodes.forEach((node, index) => {
        expect(node).toHaveTextContent(options[index]?.content);
      });
    });

    test('separator[TNode]', () => {
      const el = (
        <Breadcrumb data-testid={rootTestID}>
          <BreadcrumbItem separator={<span role="separator"> xxx </span>} data-testid={childTestID} />
        </Breadcrumb>
      );
      const wrapper = render(el);

      const root = wrapper.getByTestId(rootTestID);
      const separator = wrapper.getByRole('separator');

      expect(root).toContainElement(separator);
    });
  });

  describe('events', () => {
    test('onClick', () => {
      const mockFn = vi.fn();
      const el = (
        <Breadcrumb>
          <BreadcrumbItem onClick={mockFn} data-testid={childTestID}>
            hello
          </BreadcrumbItem>
        </Breadcrumb>
      );
      const wrapper = render(el);

      const child = wrapper.getByTestId(childTestID);
      child.click();

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    describe('ellipsis', () => {
      test('maxItems with children preserves boundary items', () => {
        const options = [
          { content: '页面1' },
          { content: '页面2' },
          { content: '页面3' },
          { content: '页面4' },
          { content: '页面5' },
          { content: '页面6' },
          { content: '页面7' },
          { content: '页面8' },
        ];

        const el = (
          <Breadcrumb maxItems={5} itemsBeforeCollapse={2} itemsAfterCollapse={1} data-testid={rootTestID}>
            {options.map((option) => (
              <BreadcrumbItem key={option.content}>{option.content}</BreadcrumbItem>
            ))}
          </Breadcrumb>
        );

        const wrapper = render(el);

        const root = wrapper.getByTestId(rootTestID);

        expect(root.childNodes).toHaveLength(4);
        expect(root.childNodes[0]).toHaveTextContent('页面1');
        expect(root.childNodes[1]).toHaveTextContent('页面2');
        expect(root.childNodes[3]).toHaveTextContent('页面8');
      });

      test('maxItems with options preserves boundary items', () => {
        const options = [
          { content: '页面1' },
          { content: '页面2' },
          { content: '页面3' },
          { content: '页面4' },
          { content: '页面5' },
          { content: '页面6' },
          { content: '页面7' },
          { content: '页面8' },
        ];

        const el = (
          <Breadcrumb
            maxItems={5}
            itemsBeforeCollapse={2}
            itemsAfterCollapse={1}
            data-testid={rootTestID}
            options={options}
          />
        );

        const wrapper = render(el);

        const root = wrapper.getByTestId(rootTestID);

        expect(root.childNodes).toHaveLength(4);
        expect(root.childNodes[0]).toHaveTextContent('页面1');
        expect(root.childNodes[1]).toHaveTextContent('页面2');
        expect(root.childNodes[3]).toHaveTextContent('页面8');
      });

      test('string value renders custom collapse content', () => {
        const options = [
          { content: '页面1' },
          { content: '页面2' },
          { content: '页面3' },
          { content: '页面4' },
          { content: '页面5' },
          { content: '页面6' },
          { content: '页面7' },
          { content: '页面8' },
        ];

        const el = (
          <Breadcrumb
            maxItems={5}
            itemsBeforeCollapse={2}
            itemsAfterCollapse={1}
            data-testid={rootTestID}
            options={options}
            ellipsis="..."
          />
        );

        const wrapper = render(el);

        const root = wrapper.getByTestId(rootTestID);

        expect(root.childNodes).toHaveLength(4);
        expect(root.childNodes[2]).toHaveTextContent('...');
      });

      test('function value renders collapsed item content', () => {
        const options = [
          { content: '页面1' },
          { content: '页面2' },
          { content: '页面3' },
          { content: '页面4' },
          { content: '页面5' },
          { content: '页面6' },
          { content: '页面7' },
          { content: '页面8' },
        ];

        const separator = '>';

        const getEllipsis = (items: TdBreadcrumbItemProps[]) => items.map((item: any) => item.content).join(separator);

        const el = (
          <Breadcrumb
            maxItems={5}
            itemsBeforeCollapse={2}
            itemsAfterCollapse={1}
            data-testid={rootTestID}
            separator={separator}
            options={options}
            ellipsis={({ items }) => getEllipsis(items)}
          />
        );

        const wrapper = render(el);

        const root = wrapper.getByTestId(rootTestID);

        expect(root.childNodes).toHaveLength(4);
        expect(root.childNodes[2]).toHaveTextContent(getEllipsis(options.slice(2, 7)));
      });
    });
  });
});
