import React from 'react';
import { vi, render } from '@test/utils';
import Breadcrumb from '../Breadcrumb';

const { BreadcrumbItem } = Breadcrumb;

describe('Breadcrumb', () => {
  const rootTestID = 'breadcrumbRoot';
  const childTestID = 'breadcrumbChild';

  test('trigger events on breadcrumbItem', () => {
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

  test('use custom separator', () => {
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

  test('render options breadCrumbItem correctly', () => {
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
});
