import { render, fireEvent, vi } from '@test/utils';
import React from 'react';
import List from '../List';

const { ListItem } = List;

describe('List 组件测试', () => {
  const data = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];

  describe('List Props', () => {
    test('asyncLoading is string & onLoadMore', () => {
      const clickFn = vi.fn();
      const { container, queryByText } = render(
        <List
          asyncLoading="load-more"
          onLoadMore={() => {
            clickFn();
          }}
        >
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(container.querySelector('.t-list__load--load-more')).toBeInTheDocument();
      expect(queryByText('点击加载更多')).toBeInTheDocument();
      fireEvent.click(queryByText('点击加载更多'));
      expect(clickFn).toBeCalledTimes(1);
    });

    test('onScroll', () => {
      const fn = vi.fn();
      const { container } = render(
        <List
          style={{
            height: '10px',
            overflow: 'auto',
          }}
          onScroll={fn}
        >
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      fireEvent.scroll(container.firstChild);
      expect(fn).toHaveBeenCalled();
    });
  });
});
