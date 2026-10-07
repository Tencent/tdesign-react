import React from 'react';
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

const colorText = MarkdownEngine.createSyntaxHook('important', MarkdownEngine.constants.HOOKS_TYPE_LIST.SEN, {
  makeHtml(str) {
    return str.replace(
      this.RULE.reg,
      (_whole, _marker, text) => `<span class="md-color-text">${escapeHTML(text)}</span>`,
    );
  },
  rule() {
    return { reg: /(!!)([^!]+)\1/g };
  },
});

export default function MarkdownExample() {
  return (
    <div
      onClick={(event) => {
        const text = (event.target as HTMLElement).closest('.md-color-text');
        if (text) console.log('点击:', text.textContent);
      }}
    >
      <style>{'.markdown-custom .md-color-text { color: var(--td-error-color); cursor: pointer; }'}</style>
      <ChatMarkdown
        className="markdown-custom"
        content="我是普通内容 !!我是自定义markdown结构!!"
        options={{
          engine: {
            customSyntax: {
              colorTextHook: { syntaxClass: colorText, force: false },
            },
          },
        }}
      />
    </div>
  );
}
