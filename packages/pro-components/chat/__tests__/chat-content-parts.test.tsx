import './setup';

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Attachments } from '../attachments';
import { Filecard } from '../chat-filecard';
import { ChatThinking } from '../chat-thinking';
import { ChatSearchContent, ChatSuggestionContent } from '../chatbot/content';

describe('chat-content-parts public contracts', () => {
  it('updates thinking, collapse and controlled collapsed state', () => {
    const change = vi.fn();
    const view = render(
      <ChatThinking content={{ title: '思考', text: '步骤' }} status="complete" onCollapsedChange={change} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /思考/ }));
    expect(screen.getByText('步骤')).not.toBeVisible();
    expect(change.mock.calls[0][0].detail).toBe(true);
    view.rerender(<ChatThinking content={{ title: '思考', text: '更新' }} collapsed={false} />);
    expect(screen.getByText('更新')).toBeVisible();
  });
  it('reports search and suggestion interactions with their exact content', () => {
    const item = { title: '来源', url: 'https://tdesign.tencent.com' };
    const search = vi.fn();
    const suggestion = vi.fn();
    render(
      <>
        <ChatSearchContent
          content={{ title: '搜索结果', references: [item] }}
          useCollapse
          collapsed
          handleSearchItemClick={search}
        />
        <ChatSuggestionContent content={[{ title: '继续提问' }]} handlePromptClick={suggestion} />
      </>,
    );
    expect(screen.queryByRole('link', { name: /来源/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '搜索结果' }));
    fireEvent.click(screen.getByRole('link', { name: /来源/ }));
    expect(search.mock.calls[0][0].content).toBe(item);
    fireEvent.click(screen.getByRole('button', { name: '继续提问' }));
    expect(suggestion.mock.calls[0][0].content.title).toBe('继续提问');
  });
  it('uses a result card by default and keeps configured search panels interactive', () => {
    const content = {
      title: '搜索结果',
      references: [{ title: '来源', url: '#reference' }],
    };
    const result = vi.fn();
    const view = render(<ChatSearchContent content={content} handleSearchResultClick={result} />);
    fireEvent.click(screen.getByRole('button', { name: '搜索结果' }));
    expect(result.mock.calls[0][0].content).toBe(content);
    expect(screen.queryByRole('link', { name: /来源/ })).toBeNull();
    view.rerender(<ChatSearchContent content={content} useCollapse collapsed={false} />);
    expect(screen.getByRole('link', { name: /来源/ })).toBeVisible();
    view.rerender(<ChatSearchContent content={content} useCollapse collapsed />);
    expect(screen.queryByRole('link', { name: /来源/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '搜索结果' }));
    expect(screen.getByRole('link', { name: /来源/ })).toBeVisible();
  });
  it('renders one thumbnail, recovers image failures and excludes previews for ordinary files', () => {
    const view = render(<Filecard cardType="image" item={{ name: 'a.png', url: '/a.png' }} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('status', { name: '图片加载中' })).toBeVisible();
    fireEvent.error(screen.getByAltText('a.png'));
    expect(screen.getByRole('img', { name: '图片加载失败' })).toBeVisible();
    expect(screen.queryByAltText('a.png')).toBeNull();
    view.rerender(<Filecard cardType="image" item={{ name: 'b.png', url: '/b.png' }} />);
    fireEvent.load(screen.getByAltText('b.png'));
    expect(screen.getByAltText('b.png')).toBeVisible();
    expect(screen.queryByRole('status', { name: '图片加载中' })).toBeNull();
    expect(screen.queryByRole('img', { name: '图片加载失败' })).toBeNull();
    view.rerender(<Filecard item={{ name: 'a.pdf', url: '/a.pdf' }} />);
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('updates file status and keeps disabled remove/click inactive', () => {
    const click = vi.fn();
    const remove = vi.fn();
    const view = render(
      <Filecard item={{ name: 'a.pdf', status: 'progress', percent: 30 }} onFileClick={click} onRemove={remove} />,
    );
    expect(screen.getByText('上传中...30%')).toBeVisible();
    view.rerender(<Filecard item={{ name: 'a.pdf', status: 'fail' }} disabled onFileClick={click} onRemove={remove} />);
    expect(screen.getByText('上传失败')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'a.pdf' }));
    fireEvent.click(screen.getByRole('button', { name: '移除 a.pdf' }));
    expect(click).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it('renders all attachment overflow modes and forwards the original item', () => {
    const item = { name: 'a.txt' };
    const click = vi.fn();
    const view = render(<Attachments items={[item]} onFileClick={click} overflow="scrollX" />);
    fireEvent.click(screen.getByRole('button', { name: 'a.txt' }));
    expect(click.mock.calls[0][0].detail).toBe(item);
    view.rerender(<Attachments items={[item]} overflow="scrollY" removable={false} />);
    expect(screen.queryByRole('button', { name: /移除/ })).toBeNull();
  });
});
