import React, { forwardRef, useState } from 'react';
import { ChevronDownIcon, JumpIcon, SwapRightIcon } from 'tdesign-icons-react';

import { rootProps, useChatClass, useElementRef } from '../_util/native';

import type { StyledProps, TdChatSearchContentProps, TdChatSuggestionContentProps } from '../_util/native-types';

export const ChatSearchContent = forwardRef<HTMLElement | undefined, TdChatSearchContentProps & StyledProps>(
  (props, ref) => {
    const [local, setLocal] = useState(true);
    const collapsed = props.collapsed ?? local;
    const { content, status, useCollapse = true } = props;
    const root = useElementRef(ref);
    const base = useChatClass('chat-search');
    if (!content || (status === 'complete' && !content.references?.length)) return null;
    const title = status === 'stop' ? '搜索已终止' : content.title;
    return (
      <div ref={root} {...rootProps(props, base)} data-td-chat="search">
        <button
          data-td-chat-button=""
          type="button"
          aria-expanded={useCollapse ? !collapsed : undefined}
          onClick={(e) => {
            if (useCollapse) setLocal(!collapsed);
            else props.handleSearchResultClick?.({ event: e.nativeEvent, content });
          }}
        >
          {!useCollapse &&
            content.references?.map((item) => item.icon && <img key={item.url} src={item.icon} alt={item.title} />)}
          <span>{title}</span>
          {useCollapse && <ChevronDownIcon />}
        </button>
        {useCollapse && (
          <div hidden={collapsed}>
            {content.references?.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  props.handleSearchItemClick?.({
                    event: e.nativeEvent,
                    content: item,
                  })
                }
              >
                {index + 1}. {item.title}
                <JumpIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  },
);
ChatSearchContent.displayName = 'ChatSearchContent';
export const ChatSuggestionContent = forwardRef<HTMLElement | undefined, TdChatSuggestionContentProps & StyledProps>(
  (props, ref) => (
    <div ref={useElementRef(ref)} {...rootProps(props, useChatClass('chat-suggestion'))} data-td-chat="suggestion">
      {props.content?.map(
        (item, index) =>
          item.title && (
            <button
              data-td-chat-button=""
              key={index}
              type="button"
              onClick={(e) => props.handlePromptClick?.({ event: e.nativeEvent, content: item })}
            >
              {item.title}
              <SwapRightIcon />
            </button>
          ),
      )}
    </div>
  ),
);
ChatSuggestionContent.displayName = 'ChatSuggestionContent';
