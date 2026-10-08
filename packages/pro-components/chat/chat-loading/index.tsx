import React, { forwardRef } from 'react';
import { Skeleton } from 'tdesign-react';

import { rootProps, useChatClass, useElementRef } from '../_util/native';

import type { TdChatLoadingProps } from '../_util/native-types';

export const ChatLoading = forwardRef<HTMLElement | undefined, TdChatLoadingProps>((props, ref) => {
  const { animation = 'moving', text = '' } = props;
  return (
    <div
      ref={useElementRef(ref)}
      {...rootProps(props, useChatClass('chat-loading'))}
      data-td-chat="loading"
      data-animation={animation}
      role="status"
      aria-label={text || '加载中'}
    >
      {animation === 'skeleton' ? (
        <Skeleton theme="paragraph" animation="gradient" />
      ) : (
        <span data-td-chat-part="loading-indicator" aria-hidden="true">
          {animation === 'circle' || animation === 'gradient' ? (
            <i />
          ) : (
            <>
              <i />
              <i />
              <i />
            </>
          )}
        </span>
      )}
      {text && (
        <span data-td-chat-part={animation === 'skeleton' ? 'loading-description' : 'loading-text'}>{text}</span>
      )}
    </div>
  );
});
ChatLoading.displayName = 'ChatLoading';
export default ChatLoading;
export type { ChatLoadingAnimationType, TdChatLoadingProps } from '../_util/native-types';
