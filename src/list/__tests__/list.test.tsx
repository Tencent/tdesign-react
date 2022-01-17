import { testExamples, render, fireEvent } from '@test/utils';
import React from 'react';
import List from '../List';

const { ListItem, ListItemMeta } = List;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('List 组件测试', () => {
  const data = [
    { id: 1, content: '列表内容列表内容列表内容' },
    { id: 2, content: '列表内容列表内容列表内容' },
    { id: 3, content: '列表内容列表内容列表内容' },
    { id: 4, content: '列表内容列表内容列表内容' },
  ];

  describe('Base', () => {
    test('create', () => {
      const wrapper = render(
        <List>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('List Props', () => {
    test('asyncLoading is string & onLoadMore', () => {
      const clickFn = jest.fn();
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

    test('asyncLoading is node', () => {
      const wrapper = render(
        <List asyncLoading={<div style={{ textAlign: 'center', marginTop: 12 }}>没有更多数据了</div>}>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('footer is string', () => {
      const wrapper = render(
        <List footer="这是Footer">
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('footer is node', () => {
      const wrapper = render(
        <List footer={<p>这是Footer</p>}>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('header is string', () => {
      const wrapper = render(
        <List header="这是Header">
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('header is node', () => {
      const wrapper = render(
        <List footer={<p>这是Header</p>}>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('layout', () => {
      const wrapper = render(
        <List layout="vertical">
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('size', () => {
      const wrapper = render(
        <List size="large">
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('split', () => {
      const wrapper = render(
        <List split={true}>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('stripe', () => {
      const wrapper = render(
        <List stripe={true}>
          {data.map((val) => (
            <ListItem key={val.id}>{val.content}</ListItem>
          ))}
        </List>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('onScroll', () => {
      const fn = jest.fn();
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

  describe('ListItem Props', () => {
    const text = 'ListItem 组件';

    test('action & children', () => {
      const wrapper = render(
        <ListItem
          action={
            <li>
              <a href="" key="operate-one">
                操作
              </a>
            </li>
          }
        >
          {text}
        </ListItem>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    test('content', () => {
      const wrapper = render(<ListItem content={text}></ListItem>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('ListItemMeta Props', () => {
    const text = 'ListItemMeta 组件';

    test('description', () => {
      const wrapper = render(<ListItemMeta description={text} />);
      expect(wrapper).toMatchSnapshot();
    });

    test('title', () => {
      const wrapper = render(<ListItemMeta title="列表主内容"></ListItemMeta>);
      expect(wrapper).toMatchSnapshot();
    });

    test('image', () => {
      const wrapper = render(<ListItemMeta image="https://tdesign.gtimg.com/list-icon.png"></ListItemMeta>);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
