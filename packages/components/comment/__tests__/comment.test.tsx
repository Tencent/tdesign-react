import React from 'react';
import { render } from '@test/utils';

import Comment from '../Comment';

describe('Comment', () => {
  test('author', () => {
    const { container } = render(<Comment author="评论作者名"></Comment>);
    expect(container.querySelector('.t-comment__author > .t-comment__name')).toContainHTML('评论作者名');
  });

  test('datetime', () => {
    const { container } = render(<Comment datetime="今天16:38"></Comment>);
    expect(container.querySelector('.t-comment__author > .t-comment__time')).toContainHTML('今天16:38');
  });

  test('content', () => {
    const { container } = render(<Comment content="评论内容"></Comment>);
    expect(container.querySelector('.t-comment__detail')).toContainHTML('评论内容');
  });

  test('reply', () => {
    const { container } = render(<Comment reply="回复内容"></Comment>);
    expect(container.querySelector('.t-comment__reply')).toContainHTML('回复内容');
  });

  test('quote', () => {
    const { container } = render(<Comment quote="引用内容"></Comment>);
    expect(container.querySelector('.t-comment__quote')).toContainHTML('引用内容');
  });

  describe('avatar', () => {
    test('avatar is url string', () => {
      const { container } = render(<Comment avatar="https://tdesign.gtimg.com/site/images/list-icon.png"></Comment>);
      expect(container.querySelector('.t-comment__avatar-image')).toHaveAttribute(
        'src',
        'https://tdesign.gtimg.com/site/images/list-icon.png',
      );
    });

    test('avatar is custom element', () => {
      const { container } = render(
        <Comment
          avatar={<img className="custom-image" src="https://tdesign.gtimg.com/site/images/list-icon.png" />}
        ></Comment>,
      );
      expect(container.querySelector('.t-comment__avatar-image')).toBeNull();
      expect(container.querySelector('.t-comment__avatar > img')).toHaveClass('custom-image');
    });
  });

  test('actions with ReactNode items', () => {
    const actions = [
      <span key="thumbUp">
        <span>6</span>
      </span>,
      <span key="chat">
        <span>回复</span>
      </span>,
    ];

    const { container } = render(<Comment actions={actions}></Comment>);
    expect(container.querySelector('.t-comment__actions')).toBeInTheDocument();
    expect(container.querySelectorAll('.t-comment__actions .t-button')).toHaveLength(2);
  });

  test('actions with a single ReactNode', () => {
    const { container } = render(<Comment actions={<span className="single-action">操作</span>}></Comment>);
    expect(container.querySelectorAll('.t-comment__actions .t-button')).toHaveLength(1);
    expect(container.querySelector('.single-action')).toHaveTextContent('操作');
  });

  test('actions with a Fragment TNode', () => {
    const actions = (
      <>
        <React.Fragment key="thumbUp">
          <span className="thumb-up-icon" />
          <span>6</span>
        </React.Fragment>
        <React.Fragment key="chat">
          <span className="chat-icon" />
          <span>回复</span>
        </React.Fragment>
      </>
    );

    const { container } = render(<Comment actions={actions}></Comment>);
    const buttons = container.querySelectorAll('.t-comment__actions .t-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toContainElement(container.querySelector('.thumb-up-icon'));
    expect(buttons[0]).toHaveTextContent('6');
    expect(buttons[1]).toContainElement(container.querySelector('.chat-icon'));
    expect(buttons[1]).toHaveTextContent('回复');
  });
});
