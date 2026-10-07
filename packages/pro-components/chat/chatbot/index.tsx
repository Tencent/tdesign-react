import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { getMessageContentForCopy, isAIMessage } from '@tdesign/ai-chat-engine';

import { createChatRequestParams } from '../_util/attachment';
import { eventOf, flattenChildren, rootProps, useChatClass, useElementRef } from '../_util/native';
import { ChatActionBar, defaultActions } from '../chat-actionbar';
import { useChat } from '../chat-engine/hooks/useChat';
import { ChatMessage } from '../chat-message';
import { ChatSender } from '../chat-sender';
import { ChatList } from './list';

import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatMessageActionData,
  TdChatMessageActionName,
  TdChatProps,
  TdChatSenderApi,
} from '../_util/native-types';

const emptyMessages: NonNullable<TdChatProps['defaultMessages']> = [];
export const ChatBot = forwardRef<HTMLElement | undefined, TdChatProps & Partial<TdChatbotApi>>((props, ref) => {
  const latest = useRef(props);
  latest.current = props;
  const { chatEngine, messages, status, ready, error } = useChat({
    defaultMessages: props.defaultMessages || emptyMessages,
    chatServiceConfig: props.chatServiceConfig || {},
  });
  const sender = useRef<HTMLElement & TdChatSenderApi>(null);
  const list = useRef<HTMLElement & TdChatListApi>(null);
  const [operationError, setOperationError] = useState<unknown>();
  const [prompt, setPrompt] = useState('');
  const autoSent = useRef(false);
  const loading = status === 'pending' || status === 'streaming';
  const send = useCallback(
    async (params: Parameters<typeof createChatRequestParams>[0]) => {
      setOperationError(undefined);
      const owned = createChatRequestParams(params);
      await chatEngine.sendUserMessage(owned);
      list.current?.scrollList({ to: 'bottom' });
      latest.current.onChatAfterSend?.(eventOf('chatAfterSend', owned));
    },
    [chatEngine],
  );
  const root = useElementRef(ref, {
    sendUserMessage: send,
    sendSystemMessage: (text: string) => {
      chatEngine.sendSystemMessage(text).catch(setOperationError);
    },
    sendAIMessage: (options: Parameters<TdChatbotApi['sendAIMessage']>[0]) => chatEngine.sendAIMessage(options),
    setMessages: (data: Parameters<TdChatbotApi['setMessages']>[0], mode = 'replace') =>
      chatEngine.setMessages(data, mode as 'replace' | 'append' | 'prepend'),
    clearMessages: () => chatEngine.messageStore.clearHistory(),
    abortChat: () => chatEngine.abortChat(),
    addPrompt: (text: string, autoFocus = true) => {
      setPrompt(text);
      if (autoFocus) sender.current?.focus();
    },
    scrollList: (options?: Parameters<TdChatListApi['scrollList']>[0]) => list.current?.scrollList(options),
    selectFile: () => sender.current?.selectFile(),
    regenerate: (keepVersion = false) => chatEngine.regenerateAIMessage(keepVersion),
    registerMergeStrategy: chatEngine.registerMergeStrategy.bind(chatEngine),
    get chatMessageValue() {
      return chatEngine.messages;
    },
    get chatStatus() {
      return chatEngine.status;
    },
    get senderLoading() {
      return chatEngine.status === 'pending' || chatEngine.status === 'streaming';
    },
    get isChatEngineReady() {
      return ready;
    },
  });
  useEffect(() => {
    if (!ready) return;
    latest.current.onChatReady?.(eventOf('chatReady', {}));
    if (!autoSent.current && latest.current.autoSendPrompt) {
      autoSent.current = true;
      send({ prompt: latest.current.autoSendPrompt }).catch(setOperationError);
    }
  }, [ready, send]);
  useEffect(() => {
    if (ready) latest.current.onMessageChange?.(eventOf('messageChange', messages));
  }, [messages, ready]);
  const action = (name: TdChatMessageActionName, data: TdChatMessageActionData) => {
    const config =
      data.message &&
      (typeof props.messageProps === 'function'
        ? props.messageProps(data.message)
        : props.messageProps?.[data.message.role]);
    (config?.handleActions?.[name] as ((data: TdChatMessageActionData) => void) | undefined)?.(data);
    props.onChatMessageAction?.(eventOf('chatMessageAction', { action: name, data }));
  };
  const senderProps = props.senderProps || {};
  const ordered = props.reverse ? [...messages].reverse() : messages;
  return (
    <div ref={root} {...rootProps(props, useChatClass('chat'))} data-td-chat="bot" data-layout={props.layout || 'both'}>
      {error || operationError ? <div role="alert">{String(error || operationError)}</div> : null}
      <ChatList css={props.injectCSS?.chatList} {...props.listProps} ref={list}>
        {ordered.map((message, index) => {
          const config =
            typeof props.messageProps === 'function' ? props.messageProps(message) : props.messageProps?.[message.role];
          const childSlots = flattenChildren(props.children).flatMap((child) => {
            if (!React.isValidElement(child) || !child.props.slot?.startsWith(`${message.id}-`)) return [];
            return [
              React.cloneElement(child, {
                slot: child.props.slot.slice(message.id.length + 1),
              }),
            ];
          });
          const actions = config?.actions ?? false;
          const showActions =
            isAIMessage(message) &&
            messages.length > 1 &&
            message.id !== messages[0]?.id &&
            message.content.length > 0 &&
            ['complete', 'stop'].includes(message.status);
          let configuredActions: Array<
            import('../_util/native-types').TdChatActionsName | import('../_util/native-types').TdChatMessageAction
          > = [];
          if (actions === true) configuredActions = defaultActions;
          else if (Array.isArray(actions)) configuredActions = actions;
          const visibleActions =
            message.id === messages[messages.length - 1]?.id
              ? configuredActions
              : configuredActions.filter((item) =>
                  typeof item === 'string' ? item !== 'replay' : item.name !== 'replay',
                );
          const handlers = Object.fromEntries(
            ['copy', 'good', 'bad', 'replay', 'share', 'searchResult', 'searchItem', 'suggestion', 'codeCopy'].map(
              (name) => [name, (data: TdChatMessageActionData) => action(name as TdChatMessageActionName, data)],
            ),
          );
          return (
            <ChatMessage
              css={props.injectCSS?.chatItem}
              key={message.id || `${message.role}-${index}`}
              message={message}
              variant="text"
              placement={message.role === 'user' && props.layout !== 'single' ? 'right' : 'left'}
              {...config}
              handleActions={handlers}
            >
              {childSlots}
              {showActions && actions !== false && (
                <div slot="actionbar">
                  <ChatActionBar
                    actionBar={visibleActions}
                    copyText={getMessageContentForCopy(message)}
                    comment={'comment' in message ? message.comment : undefined}
                    handleAction={(name, data) => action(name, { ...data, message })}
                  />
                </div>
              )}
            </ChatMessage>
          );
        })}
      </ChatList>
      <ChatSender
        css={props.injectCSS?.ChatSender}
        loading={loading}
        value={prompt}
        {...senderProps}
        ref={sender}
        onChange={(e) => {
          setPrompt(e.detail);
          senderProps.onChange?.(e);
        }}
        onSend={(e) => {
          senderProps.onSend?.(e);
          setPrompt('');
          send({
            prompt: e.detail.value,
            attachments: e.detail.attachments,
          }).catch(setOperationError);
        }}
        onStop={(e) => {
          senderProps.onStop?.(e);
          chatEngine.abortChat().catch(setOperationError);
          props.onChatStop?.(eventOf('chatStop', {}));
        }}
      >
        {flattenChildren(props.children)
          .filter((child) => React.isValidElement(child) && child.props.slot?.startsWith('sender-'))
          .map((child: React.ReactElement) => React.cloneElement(child, { slot: child.props.slot.slice(7) }))}
      </ChatSender>
    </div>
  );
});
ChatBot.displayName = 'ChatBot';
export type {
  BackBottomParams,
  FetchSSEOptions,
  Layout,
  MetaData,
  ModelRoleEnum,
  ScrollPosition,
  SSEEvent,
  TdChatbotApi,
  TdChatCodeProps,
  TdChatInjectCSS,
  TdChatListApi,
  TdChatListProps,
  TdChatListScrollToOptions,
  TdChatMessageActionEvent,
  TdChatMessageConfig,
  TdChatMessageConfigItem,
  TdChatProps,
} from '../_util/native-types';
export { ChatSearchContent, ChatSuggestionContent } from './content';
export { ChatList } from './list';
