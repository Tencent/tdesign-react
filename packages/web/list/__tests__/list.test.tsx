import { render, fireEvent, vi } from '@test/utils';
import React from 'react';
import List from '../List';

const { ListItem, ListItemMeta } = List;

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

    test('header and footer props', () => {
      const header = 'header content';
      const footer = 'footer content';
      const { queryByText } = render(<List header={header} footer={footer} />);

      expect(queryByText(header)).not.toBeNull();
      expect(queryByText(header)).toBeInTheDocument();
      expect(queryByText(footer)).not.toBeNull();
      expect(queryByText(footer)).toBeInTheDocument();
    });

    test('asyncLoading props', () => {
      const { container } = render(<List asyncLoading="loading" />);

      expect(container.querySelector('.t-loading')).not.toBeNull();
      expect(container.querySelector('.t-loading')).toBeInTheDocument();
    });
  });

  describe('ListItem Component Test', () => {
    test('content and children render', () => {
      const contextText = 'content render';
      const { container } = render(<ListItem content={<div id="content_id">{contextText}</div>} />);

      const { container: childContainer } = render(
        <ListItem>
          <div id="child_test">{contextText}</div>
        </ListItem>,
      );

      expect(container.querySelector('#content_id')).not.toBeNull();
      expect(container.querySelector('#content_id')).toBeInTheDocument();
      expect(childContainer.querySelector('#child_test')).not.toBeNull();
      expect(childContainer.querySelector('#child_test')).toBeInTheDocument();
    });

    test('action', () => {
      const { queryByText } = render(<ListItem action={<span>操作1</span>} />);

      expect(queryByText('操作1')).not.toBeNull();
      expect(queryByText('操作1')).toBeInTheDocument();
    });
  });

  describe('ListItemMeta Component Test', () => {
    const imgSrc = 'https://tdesign.gtimg.com/list-icon.png';
    const description = 'Test Description';
    test('image string', () => {
      const { container } = render(<ListItemMeta image={imgSrc} />);

      expect(container.querySelector('img')).not.toBeNull();
      expect(container.querySelector('img')).toBeInTheDocument();
    });
    test('image TNode', () => {
      const Img = () => <img id="img_test" src={imgSrc} alt="test img" />;
      const { container } = render(<ListItemMeta image={<Img />} />);

      expect(container.querySelector('#img_test')).not.toBeNull();
      expect(container.querySelector('#img_test')).toBeInTheDocument();
    });
    test('description string', () => {
      const { queryByText } = render(<ListItemMeta description={description} />);

      expect(queryByText(description)).not.toBeNull();
      expect(queryByText(description)).toBeInTheDocument();
    });
    test('description TNode', () => {
      const Description = () => <div id="description_test">{description}</div>;
      const { container } = render(<ListItemMeta description={<Description />} />);

      expect(container.querySelector('#description_test')).not.toBeNull();
      expect(container.querySelector('#description_test')).toBeInTheDocument();
    });
  });
});
