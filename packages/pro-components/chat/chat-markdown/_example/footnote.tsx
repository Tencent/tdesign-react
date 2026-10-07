import React, { useState } from 'react';
import { ChatMarkdown, MarkdownEngine } from '@tdesign-react/chat';

const escapeHTML = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
const hoverRefHook = MarkdownEngine.createSyntaxHook('hoverRef', MarkdownEngine.constants.HOOKS_TYPE_LIST.SEN, {
  makeHtml(str) {
    return str.replace(
      this.RULE.reg,
      (_whole, id, title, summary, link) =>
        `<span class="hover-ref" data-title="${escapeHTML(title)}" data-summary="${escapeHTML(summary)}" data-link="${escapeHTML(link)}">${escapeHTML(id)}</span>`,
    );
  },
  rule() {
    return { reg: /\[ref:([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^\]]+)\]/g };
  },
});
const safeLink = (href: string) => {
  try {
    const url = new URL(href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};

export default function FootnoteDemo() {
  const [tooltip, setTooltip] = useState<{
    title: string;
    summary: string;
    link?: string;
    left: number;
    top: number;
  }>();
  return (
    <div
      className="markdown-footnote"
      onMouseLeave={() => setTooltip(undefined)}
      onMouseOver={(event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>('.hover-ref');
        if (!target) return;
        const rect = target.getBoundingClientRect();
        setTooltip({
          title: target.dataset.title || '',
          summary: target.dataset.summary || '',
          link: safeLink(target.dataset.link || ''),
          left: rect.left,
          top: rect.bottom,
        });
      }}
    >
      <style>{`.markdown-footnote .hover-ref { color: var(--td-text-color-secondary); background: var(--td-bg-color-secondarycontainer); padding: 2px 6px; border-radius: 12px; font-size: 12px; cursor: pointer; }
        .markdown-footnote .hover-tooltip { position: fixed; z-index: 10000; max-width: 300px; padding: 12px; background: var(--td-bg-color-container); color: var(--td-text-color-primary); box-shadow: var(--td-shadow-2); border-radius: 8px; }`}</style>
      <ChatMarkdown
        content="人工智能的发展经历了不同的阶段[ref:1|人工智能的发展历程|探讨 AI 的重要里程碑和技术突破|https://tdesign.tencent.com]。"
        options={{
          engine: {
            global: {
              htmlAttrWhiteList: 'class|data-title|data-summary|data-link',
            },
            customSyntax: {
              hoverRefHook: {
                syntaxClass: hoverRefHook,
                force: true,
                before: 'link',
              },
            },
          },
        }}
      />
      {tooltip && (
        <aside role="tooltip" className="hover-tooltip" style={{ left: tooltip.left, top: tooltip.top }}>
          {tooltip.link ? (
            <a href={tooltip.link} target="_blank" rel="noopener noreferrer">
              {tooltip.title}
            </a>
          ) : (
            <strong>{tooltip.title}</strong>
          )}
          <p>{tooltip.summary}</p>
        </aside>
      )}
    </div>
  );
}
