import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeEach, act } from '@test/utils';
import { Tabs, TabPanel } from '../index';

const prefix = 't';
const name = `.${prefix}-tabs`;
const panelClass = `.${prefix}-tab-panel`;

describe('TabPanel', () => {
  beforeEach(() => {
    Object.defineProperty(Element.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  });

  describe('props', () => {
    it(': value', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabPanel label="Tab 1" value="tab1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="tab2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      // 根据 value 确定激活状态
      const panels = container.querySelectorAll(panelClass);
      expect(panels[0]).toHaveStyle({ display: 'block' });
      expect(panels[1]).toHaveStyle({ display: 'none' });
    });

    it(': label', () => {
      const { queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="自定义标签" value="1">
            Content
          </TabPanel>
        </Tabs>,
      );

      expect(queryByText('自定义标签')).toBeInTheDocument();
    });

    it(': children', () => {
      const { queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            子元素内容
          </TabPanel>
        </Tabs>,
      );

      expect(queryByText('子元素内容')).toBeInTheDocument();
    });

    it(': disabled', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2" disabled>
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      expect(tab2).toHaveClass(`${prefix}-tabs__item--disabled`);

      fireEvent.click(tab2);
      expect(onChange).not.toHaveBeenCalled();
    });
    it(': lazy', async () => {
      const { container, queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2" lazy>
            Content 2
          </TabPanel>
        </Tabs>,
      );

      expect(queryByText('Content 2')).not.toBeInTheDocument();
      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(tab2);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(queryByText('Content 2')).toBeInTheDocument();
    });

    it(': destroyOnHide', async () => {
      const { container, queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1" destroyOnHide>
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2" destroyOnHide>
            Content 2
          </TabPanel>
        </Tabs>,
      );

      expect(queryByText('Content 1')).toBeInTheDocument();

      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(tab2);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(queryByText('Content 2')).toBeInTheDocument();
      expect(queryByText('Content 1')).not.toBeInTheDocument();
    });

    it(': badgeProps', () => {
      const { container } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1" badgeProps={{ count: 5 }}>
            Content 1
          </TabPanel>
        </Tabs>,
      );

      expect(container.querySelector('.t-badge')).toBeInTheDocument();
    });
  });
});
