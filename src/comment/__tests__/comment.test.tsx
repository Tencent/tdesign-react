import React from 'react';
import { describe, it, expect, render, fireEvent, vi, act } from '@test/utils';
import Comment from '../Comment';
import ConfigProvider from '../../config-provider';
import type { CommentFold } from '../type';

const prefix = 't';
const name = `.${prefix}-comment`;

// 默认折叠/展开文案（来自 zh_CN 语言包中的 comment 配置）
const DEFAULT_FOLDS_CONTENT: CommentFold['content'] = {
  collapsed: '展开回复',
  partial: ['展开更多回复', '收起'],
  expanded: '收起',
};

describe('Comment', () => {
  describe('props', () => {
    it(':avatar with object', () => {
      const { container } = render(<Comment avatar={{ image: 'https://example.com/avatar.png', shape: 'circle' }} />);
      expect(container.querySelector(`${name}__avatar`)).toBeInTheDocument();
    });

    it(':avatar with custom node', () => {
      const { container } = render(<Comment avatar={<span className="custom-avatar">custom</span>} />);
      expect(container.querySelector('.custom-avatar')).toBeInTheDocument();
    });

    it(':author', () => {
      const { container } = render(<Comment author="张三" />);
      expect(container.querySelector(`${name}__author`).textContent).toBe('张三');
    });

    it(':content', () => {
      const { container } = render(<Comment content="这是评论内容" />);
      expect(container.querySelector(`${name}__content`).textContent).toBe('这是评论内容');
    });

    it(':datetime', () => {
      const { container } = render(<Comment datetime="今天16:38" />);
      expect(container.querySelector(`${name}__date`).textContent).toBe('今天16:38');
    });

    it(':actions with array', () => {
      const actions = [
        { key: 'reply', placement: 'start' as const, content: '回复' },
        { key: 'like', placement: 'end' as const, content: '点赞' },
      ];
      const { container } = render(<Comment actions={actions} />);
      const blocks = container.querySelectorAll(`${name}__actions-block`);
      expect(blocks).toHaveLength(2);
      expect(blocks[0].textContent).toBe('回复');
      expect(blocks[1].textContent).toBe('点赞');
    });

    it(':actions with node', () => {
      const { container } = render(<Comment actions={<span className="custom-action">操作</span>} />);
      expect(container.querySelector('.custom-action')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it(':onActions', () => {
      const onActions = vi.fn();
      const action = { key: 'reply', placement: 'start' as const, content: '回复' };
      const { container } = render(<Comment actions={[action]} onActions={onActions} />);
      const actionItem = container.querySelector(`${name}__actions-block > div`);
      fireEvent.click(actionItem);
      expect(onActions).toHaveBeenCalledWith({ action, e: expect.anything() });
    });

    it(':onLongPress', () => {
      vi.useFakeTimers();
      const onLongPress = vi.fn();
      const { container } = render(<Comment content="内容" onLongPress={onLongPress} />);
      const inner = container.querySelector(`${name}__inner`);

      // 按下并保持超过长按阈值，触发长按
      fireEvent.touchStart(inner, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(onLongPress).toHaveBeenCalledTimes(1);
      expect(inner).toHaveClass(`${prefix}-comment__inner--long-press`);

      // 抬起后移除长按态
      fireEvent.touchEnd(inner, { changedTouches: [{ clientX: 0, clientY: 0 }] });
      expect(inner).not.toHaveClass(`${prefix}-comment__inner--long-press`);
      vi.useRealTimers();
    });

    it(':onLongPress not triggered on short press', () => {
      vi.useFakeTimers();
      const onLongPress = vi.fn();
      const { container } = render(<Comment content="内容" onLongPress={onLongPress} />);
      const inner = container.querySelector(`${name}__inner`);

      fireEvent.touchStart(inner, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      fireEvent.touchEnd(inner, { changedTouches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(onLongPress).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe('folds', () => {
    it(':total does not render folds when <= 1', () => {
      const { container, rerender } = render(
        <Comment folds={{ state: 'collapsed', total: 1, content: DEFAULT_FOLDS_CONTENT }} />,
      );
      expect(container.querySelector(`${name}__folds`)).not.toBeInTheDocument();

      rerender(<Comment folds={{ state: 'collapsed', total: 0, content: DEFAULT_FOLDS_CONTENT }} />);
      expect(container.querySelector(`${name}__folds`)).not.toBeInTheDocument();
    });

    it(':state renders correctly', () => {
      // collapsed
      const { container, rerender } = render(
        <Comment
          folds={{ state: 'collapsed', total: 5, content: DEFAULT_FOLDS_CONTENT }}
          reply={<div className="reply-item">回复1</div>}
        />,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('展开回复');

      // expanded
      rerender(
        <Comment
          folds={{ state: 'expanded', total: 5, content: DEFAULT_FOLDS_CONTENT }}
          reply={<div className="reply-item">回复</div>}
        />,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('收起');

      // partial
      rerender(
        <Comment
          folds={{ state: 'partial', total: 5, content: DEFAULT_FOLDS_CONTENT }}
          reply={<div className="reply-item">回复</div>}
        />,
      );
      expect(container.querySelectorAll(`${name}__folds-item`)).toHaveLength(2);
    });

    it(':click triggers onFolds', () => {
      const onFolds = vi.fn();
      // expand
      const { container, rerender } = render(
        <Comment
          folds={{ state: 'collapsed', total: 5, content: DEFAULT_FOLDS_CONTENT }}
          onFolds={onFolds}
          reply={<div className="reply-item">回复</div>}
        />,
      );
      fireEvent.click(container.querySelector(`${name}__folds-item`));
      expect(onFolds.mock.calls[0][0].fold.state).toBe('partial');

      // collapse
      onFolds.mockClear();
      rerender(
        <Comment
          folds={{ state: 'expanded', total: 5, content: DEFAULT_FOLDS_CONTENT }}
          onFolds={onFolds}
          reply={<div className="reply-item">回复</div>}
        />,
      );
      fireEvent.click(container.querySelector(`${name}__folds-item`));
      expect(onFolds.mock.calls[0][0].fold.state).toBe('collapsed');
    });
  });

  describe('i18n', () => {
    // 不传 folds.content 时，默认使用全局配置（zh_CN 语言包）中的 comment 文案
    it(': falls back to global config default locale text when folds.content is not provided', () => {
      const { container, rerender } = render(
        <Comment folds={{ state: 'collapsed', total: 5, step: 3 }} reply={<div className="reply-item">回复</div>} />,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('展开回复');

      rerender(
        <Comment folds={{ state: 'partial', total: 5, step: 3 }} reply={<div className="reply-item">回复</div>} />,
      );
      const items = container.querySelectorAll(`${name}__folds-item`);
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain('展开更多回复');
      expect(items[1].textContent).toContain('收起');

      rerender(
        <Comment folds={{ state: 'expanded', total: 5, step: 3 }} reply={<div className="reply-item">回复</div>} />,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('收起');
    });

    // ConfigProvider 的 globalConfig.comment 可以覆盖默认文案
    it(': ConfigProvider globalConfig.comment overrides default locale text', () => {
      const { container } = render(
        <ConfigProvider
          globalConfig={{
            comment: {
              collapsedText: 'Expand replies',
              expandMoreText: 'More replies',
              collapseText: 'Collapse',
            },
          }}
        >
          <Comment folds={{ state: 'collapsed', total: 5, step: 3 }} reply={<div className="reply-item">reply</div>} />
        </ConfigProvider>,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('Expand replies');
    });

    // folds.content 的优先级高于 ConfigProvider 的全局配置
    it(': folds.content takes priority over ConfigProvider global config', () => {
      const { container } = render(
        <ConfigProvider
          globalConfig={{
            comment: {
              collapsedText: 'Expand replies',
              expandMoreText: 'More replies',
              collapseText: 'Collapse',
            },
          }}
        >
          <Comment
            folds={{ state: 'collapsed', total: 5, step: 3, content: { collapsed: '自定义展开文案' } }}
            reply={<div className="reply-item">reply</div>}
          />
        </ConfigProvider>,
      );
      const text = container.querySelector(`${name}__folds`).textContent;
      expect(text).toContain('自定义展开文案');
      expect(text).not.toContain('Expand replies');
    });

    // folds.content.partial 作为数组整体覆盖，不与全局配置做字段级合并
    it(': folds.content.partial fully overrides global config partial pair', () => {
      const { container } = render(
        <ConfigProvider
          globalConfig={{
            comment: {
              expandMoreText: 'More replies',
              collapseText: 'Collapse',
            },
          }}
        >
          <Comment
            folds={{ state: 'partial', total: 5, step: 3, content: { partial: ['自定义更多回复', '自定义收起'] } }}
            reply={<div className="reply-item">reply</div>}
          />
        </ConfigProvider>,
      );
      const items = container.querySelectorAll(`${name}__folds-item`);
      expect(items[0].textContent).toContain('自定义更多回复');
      expect(items[1].textContent).toContain('自定义收起');
    });

    // ConfigProvider 全局配置支持字段级深合并，未覆盖的字段回退到默认语言包
    it(': ConfigProvider global config deep-merges with default locale, unset fields fall back to defaults', () => {
      const { container } = render(
        <ConfigProvider
          globalConfig={{
            comment: {
              collapsedText: '仅覆盖折叠文案',
            },
          }}
        >
          <Comment folds={{ state: 'partial', total: 5, step: 3 }} reply={<div className="reply-item">reply</div>} />
        </ConfigProvider>,
      );
      const items = container.querySelectorAll(`${name}__folds-item`);
      // expandMoreText/collapseText 未被覆盖，回退到默认语言包中的中文文案
      expect(items[0].textContent).toContain('展开更多回复');
      expect(items[1].textContent).toContain('收起');
    });
  });

  describe('defaultFolds', () => {
    it(':initial state and click expand', () => {
      const { container } = render(
        <Comment
          defaultFolds={{ state: 'collapsed', total: 5, step: 3, content: DEFAULT_FOLDS_CONTENT }}
          reply={<div className="reply-item">回复</div>}
        />,
      );
      expect(container.querySelector(`${name}__folds`).textContent).toContain('展开回复');

      fireEvent.click(container.querySelector(`${name}__folds-item`));
      expect(container.querySelectorAll(`${name}__folds-item`)).toHaveLength(2);
    });
  });

  describe('slots', () => {
    it(':children and reply', () => {
      const { container, rerender } = render(
        <Comment>
          <div className="reply-child">嵌套回复</div>
        </Comment>,
      );
      expect(container.querySelector('.reply-child')).toBeInTheDocument();

      rerender(<Comment reply={<div className="reply-slot">回复插槽</div>} />);
      expect(container.querySelector('.reply-slot')).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it(':renders correct root structure', () => {
      const { container } = render(<Comment content="内容" />);
      expect(container.querySelector(`${name}`)).toBeInTheDocument();
      expect(container.querySelector(`${name}__inner`)).toBeInTheDocument();
      expect(container.querySelector(`${name}__detail`)).toBeInTheDocument();
      expect(container.querySelector(`${name}__bottom`)).toBeInTheDocument();
      expect(container.querySelector(`${name}__reply`)).toBeInTheDocument();
    });

    it(':className and style', () => {
      const { container } = render(<Comment className="custom-comment" style={{ color: 'red' }} content="内容" />);
      const root = container.querySelector(`${name}`);
      expect(root).toHaveClass('custom-comment');
      expect(root).toHaveStyle('color: rgb(255, 0, 0)');
    });
  });
});
