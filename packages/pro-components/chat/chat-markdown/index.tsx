import React, { forwardRef, useEffect, useRef } from 'react';
import MermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin.esm.js';
import { merge } from 'lodash-es';

import loadMarkdownEngine from '../_util/markdown-engine.cjs';
import { rootProps, useChatClass, useElementRef } from '../_util/native';

import type CherryStream from 'cherry-markdown/dist/cherry-markdown.stream.esm.js';
import type { StyledProps, TdChatMarkdownContentProps } from '../_util/native-types';

export const MarkdownEngine = loadMarkdownEngine();
const registerMarkdownPlugin = MarkdownEngine.usePlugin?.bind(MarkdownEngine);
const registeredMermaid = new WeakSet<object>();
export const ChatMarkdown = forwardRef<
  HTMLElement | undefined,
  TdChatMarkdownContentProps & StyledProps & { onCodeCopy?: (data: { code: string; lang?: string }) => void }
>((props, ref) => {
  const target = useRef<HTMLDivElement>(null);
  const instance = useRef<CherryStream>();
  const content = useRef(props.content);
  const latest = useRef(props);
  latest.current = props;
  content.current = props.content;
  useEffect(() => {
    if (!target.current) return undefined;
    const { mermaid } = window as Window & { mermaid?: object };
    if (mermaid && !registeredMermaid.has(mermaid)) {
      registerMarkdownPlugin?.(MermaidPlugin, { mermaidCanvasAppendDom: document.body, mermaid, mermaidAPI: mermaid });
      registeredMermaid.add(mermaid);
    }
    const options = merge(
      {},
      {
        engine: {
          global: { flowSessionContext: true },
          syntax: {
            table: { selfClosing: true },
            link: { target: '_blank' },
            codeBlock: {
              wrap: false,
              lineNumber: false,
              copyCode: true,
              editCode: false,
            },
          },
        },
        toolbars: {
          toolbar: false as const,
          toc: false as const,
          showToolbar: false as const,
        },
        editor: { defaultModel: 'previewOnly' as const },
        previewer: {},
      },
      props.options,
    );
    const theme = props.options?.themeSettings?.codeBlockTheme || 'one-light';
    const md = new MarkdownEngine({
      ...options,
      callback: {
        ...options.callback,
        onCopyCode: (event, code) => {
          const result = latest.current.options?.callback?.onCopyCode?.(event, code);
          if (result !== false) latest.current.onCodeCopy?.({ code: typeof result === 'string' ? result : code });
          return result ?? code;
        },
      },
      themeSettings: {
        themeList: [],
        mainTheme: 'default',
        inlineCodeTheme: 'red',
        codeBlockTheme: ({ dark: 'one-dark', light: 'one-light' } as Record<string, string>)[theme] || theme,
      },
      el: target.current,
      value: content.current || ' ',
    });
    instance.current = md;
    return () => {
      instance.current = undefined;
      md.destroy();
    };
  }, [props.options]);
  useEffect(() => {
    instance.current?.setMarkdown(props.content || ' ');
  }, [props.content]);
  return (
    <div ref={useElementRef(ref)} {...rootProps(props, useChatClass('chat-markdown'))} data-td-chat="markdown">
      <div ref={target} />
    </div>
  );
});
ChatMarkdown.displayName = 'ChatMarkdown';
export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from '../_util/native-types';
