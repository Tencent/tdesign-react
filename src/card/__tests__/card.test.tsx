import { render } from '@test/utils';
import React from 'react';
import Card from '../Card';
import Avatar from '../../avatar';
import Loading from '../../loading';

const cover = 'https://tdesign.gtimg.com/site/source/card-demo.png';
const avatar = 'https://tdesign.gtimg.com/site/avatar.jpg';

describe('Card', () => {
  test('title', () => {
    const { container } = render(<Card title="标题"></Card>);
    expect(container.querySelector('.t-card__title')).toBeInTheDocument();
    expect(container.querySelector('.t-card__title').innerHTML).toBe('标题');
  });

  test('subtitle', () => {
    const { container } = render(<Card subtitle="副标题"></Card>);
    expect(container.querySelector('.t-card__subtitle')).toBeInTheDocument();
    expect(container.querySelector('.t-card__subtitle').innerHTML).toBe('副标题');
  });

  test('description', () => {
    const { container } = render(<Card description="这是一段描述"></Card>);
    expect(container.querySelector('.t-card__description')).toBeInTheDocument();
    expect(container.querySelector('.t-card__description').innerHTML).toBe('这是一段描述');
  });

  test('avatar', () => {
    const { container } = render(<Card avatar={<Avatar image={avatar} />}></Card>);
    expect(container.querySelector('.t-avatar')).toBeInTheDocument();
    expect(container.querySelector('.t-card__avatar')).toBeInTheDocument();
  });

  test('cover', () => {
    const { container } = render(<Card cover={cover}></Card>);
    expect(container.querySelector('.t-card__cover')).toBeInTheDocument();
    expect(container.querySelector('img').getAttribute('src')).toBe(cover);
  });

  test('header', () => {
    const { container } = render(<Card header></Card>);
    expect(container.querySelector('.t-card__header')).toBeInTheDocument();
  });

  test('footer', () => {
    const { container } = render(<Card footer={<div>底部</div>}></Card>);
    expect(container.querySelector('.t-card__footer')).toBeInTheDocument();
    expect(container.querySelector('.t-card__footer').textContent).toBe('底部');
  });

  test('actions', () => {
    const { container } = render(<Card actions={<div>操作</div>}></Card>);
    expect(container.querySelector('.t-card__actions')).toBeInTheDocument();
    expect(container.querySelector('.t-card__actions').textContent).toBe('操作');
  });

  test('loading', () => {
    const { container } = render(
      <Loading>
        <Card></Card>
      </Loading>,
    );
    expect(container.querySelector('.t-loading')).toBeInTheDocument();
  });
});
