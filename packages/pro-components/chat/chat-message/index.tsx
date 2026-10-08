import React, { forwardRef } from 'react';

import { namedChildren, renderNode, rootProps, slot, useChatClass, useElementRef } from '../_util/native';
import { useInjectedCSS } from '../_util/useInjectedCSS';
import { Attachments } from '../attachments';
import { ChatLoading } from '../chat-loading';
import { ChatMarkdown } from '../chat-markdown';
import { ChatThinking } from '../chat-thinking';
import { ChatSearchContent, ChatSuggestionContent } from '../chatbot/content';

import type { ChatMessagesData } from '@tdesign/ai-chat-engine';
import type {
  StyledProps,
  TdChatMessageActionData,
  TdChatMessageActionName,
  TdChatMessageProps,
} from '../_util/native-types';

export const ChatMessage = forwardRef<HTMLElement | undefined, TdChatMessageProps & StyledProps & { css?: string }>(
  (props, ref) => {
    const message = {
      ...props.message,
      id: props.id ?? props.message?.id,
      role: props.role ?? props.message?.role,
      content: props.content ?? props.message?.content ?? [],
      status: props.status ?? props.message?.status,
    } as ChatMessagesData;
    const { children, variant = 'text', placement = 'left', chatContentProps = {} } = props;
    const base = useChatClass('chat__item');
    const root = useElementRef(ref);
    useInjectedCSS(root, props.css);
    const action = (name: TdChatMessageActionName, data: object) => {
      const enriched = { ...data, message } as TdChatMessageActionData;
      // Each handler has a correlated content type; the dispatch preserves that correlation.
      (props.handleActions?.[name] as ((value: TdChatMessageActionData) => void) | undefined)?.(enriched);
    };
    const loading = message.status === 'pending' || (message.status === 'streaming' && !message.content?.length);
    const error =
      message.status === 'error' &&
      (!message.content?.length || (message.content.length === 1 && message.content[0].type === 'text'));
    const content = message.content?.map((segment, index) => {
      const { data } = segment;
      const key = `${segment.type}-${index}`;
      const ext = 'ext' in segment ? segment.ext : undefined;
      let node: React.ReactNode;
      if (segment.type === 'text' || segment.type === 'markdown')
        node =
          message.role === 'assistant' ? (
            <ChatMarkdown
              {...chatContentProps.markdown}
              onCodeCopy={(data) => action('codeCopy', data)}
              content={typeof data === 'string' ? data : ''}
            />
          ) : (
            <div data-td-chat-part="message-text">{typeof data === 'string' ? data : ''}</div>
          );
      else if (segment.type === 'attachment')
        node = (
          <Attachments items={segment.data} removable={false} onFileClick={chatContentProps.attachments?.onFileClick} />
        );
      else if (segment.type === 'thinking')
        node = <ChatThinking content={segment.data} status={segment.status} {...chatContentProps.thinking} {...ext} />;
      else if (String(segment.type) === 'reasoning') {
        const reasoning = Array.isArray(data) ? (data as Array<{ type: string; data: unknown }>) : [];
        const state = 'status' in segment ? segment.status : undefined;
        let title = '思考中';
        if (state === 'complete') title = '思考完成';
        if (state === 'error') title = '思考过程出错';
        node = (
          <ChatThinking
            content={{
              title,
            }}
            status={state}
            layout="border"
            {...chatContentProps.reasoning}
            {...ext}
          >
            <div slot="content">
              {reasoning.map((item, itemIndex) =>
                item.type === 'text' ? (
                  <p key={itemIndex}>{String(item.data)}</p>
                ) : (
                  <React.Fragment key={itemIndex}>
                    {slot(children, `reasoning-${item.type}-${itemIndex}`)}
                  </React.Fragment>
                ),
              )}
            </div>
          </ChatThinking>
        );
      } else if (segment.type === 'search')
        node = (
          <ChatSearchContent
            useCollapse
            collapsed
            content={segment.data}
            status={segment.status}
            {...chatContentProps.search}
            {...ext}
            handleSearchItemClick={(value) => action('searchItem', value)}
            handleSearchResultClick={(value) => action('searchResult', value)}
          />
        );
      else if (segment.type === 'suggestion')
        node = (
          <ChatSuggestionContent content={segment.data} handlePromptClick={(value) => action('suggestion', value)} />
        );
      else if (segment.type === 'image')
        node = <img src={segment.data.url} alt={segment.data.name} width={200} height={200} />;
      return (
        <React.Fragment key={key}>
          {slot(children, 'slotName' in segment && segment.slotName ? segment.slotName : key, node)}
        </React.Fragment>
      );
    });
    const avatar = slot(
      children,
      'avatar',
      typeof props.avatar === 'string' ? <img src={props.avatar} alt="avatar" /> : renderNode(props.avatar),
    );
    const name = slot(children, 'name', renderNode(props.name));
    const datetime = slot(children, 'datetime', renderNode(props.datetime));
    return (
      <div
        ref={root}
        {...rootProps(props, base)}
        data-td-chat="message"
        data-role={message.role}
        data-variant={variant}
        data-placement={placement}
      >
        {avatar && <div data-td-chat-part="message-avatar">{avatar}</div>}
        {loading && <ChatLoading animation={props.animation || 'skeleton'} />}
        {error && (
          <div role="alert">
            {typeof message.content?.[0]?.data === 'string' ? message.content[0].data : '请求出错'}
          </div>
        )}
        {!loading && !error && (
          <div data-td-chat-part="message-main" className={props.innerClass} style={props.innerStyle}>
            {slot(
              children,
              'header',
              (name || datetime) && (
                <div data-td-chat-part="message-header">
                  <span>{name}</span>
                  <span>{datetime}</span>
                </div>
              ),
            )}
            <div data-td-chat-part="message-content">
              {slot(
                children,
                'content',
                <>
                  {content}
                  {namedChildren(children)}
                </>,
              )}
            </div>
            {slot(children, 'actionbar')}
          </div>
        )}
      </div>
    );
  },
);
ChatMessage.displayName = 'ChatMessage';
export default ChatMessage;
export type {
  TdChatAttachmentContentProps,
  TdChatContentMDOptions,
  TdChatContentMDPluginConfig,
  TdChatContentMDPresetConfig,
  TdChatContentMDPresetPlugin,
  TdChatMarkdownContentProps,
  TdChatMessageAction,
  TdChatMessageActionData,
  TdChatMessageActionDataMap,
  TdChatMessageActionHandlers,
  TdChatMessageActionName,
  TdChatMessageProps,
  TdChatMessageVariant,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
  TdChatThinkContentProps,
} from '../_util/native-types';
