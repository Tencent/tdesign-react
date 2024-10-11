import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Clipboard from 'clipboard';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { useChatItemContext } from './ChatItemProvider';
import useConfig from '../../hooks/useConfig';

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
type Iescape = {
  [key in '&<>"\'']: string;
};
const escapeReplacements: Iescape = {
  // @ts-ignore
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const getEscapeReplacement = (ch: string): string => escapeReplacements[ch as keyof Iescape];

function escape(html: string, encode: Boolean = false) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else if (escapeTestNoEncode.test(html)) {
    return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
  }

  return html;
}

const marked = new Marked(
  markedHighlight({
    highlight(code) {
      return hljs.highlightAuto(code).value;
    },
  }),
  {
    renderer: {
      // @ts-ignore
      code(code: any, lang: any, escaped: any) {
        return `<pre class="hljs"><div class="t-chat__code-header">
        <span class="t-chat__language-txt">${escape(lang) || ''}</span>
        <div class="t-chat__copy-btn" data-clipboard-action="copy">复制代码</div>
        </div><code class="hljs language-${escape(lang)}" >${escaped ? code : escape(code)}</code></pre>`;
      },
    },
  },
);

const getHtmlByMarked = (markdown: string) => {
  if (!markdown) {
    return '<div class="waiting"></div>';
  }
  return marked.parse(markdown);
};

const ChatContent = (props) => {
  const { role, content } = props;
  const { classPrefix } = useConfig();
  const chatItemContext = useChatItemContext();

  const COMPONENT_NAME = `${classPrefix}-chat`;

  const roleValue = role || chatItemContext.role;

  useEffect(() => {
    const clipboard = new Clipboard('.t-chat__copy-btn', {
      target: (trigger: HTMLDivElement) => (trigger.parentNode as HTMLElement).nextElementSibling,
    });

    clipboard.on('success', (e) => {
      e.trigger.textContent = '已复制';
      setTimeout(() => {
        e.trigger.textContent = '复制代码';
      }, 2000);
      e.clearSelection();
    });
  }, []);

  const textInfo = useMemo(() => {
    if (roleValue === 'user') {
      return escape(content || '');
    }
    return getHtmlByMarked(content) as string;
  }, [roleValue, content]);

  return (
    <div className={`${COMPONENT_NAME}__text`}>
      {roleValue === 'user' ? (
        <div className={`${COMPONENT_NAME}__text__user`}>
          <pre dangerouslySetInnerHTML={{ __html: textInfo }}></pre>
        </div>
      ) : (
        <div className={`${COMPONENT_NAME}__text__assistant`}>
          <div
            className={classNames([`${COMPONENT_NAME}__text__content ${COMPONENT_NAME}__text--${role.value}`])}
            dangerouslySetInnerHTML={{ __html: textInfo }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;
