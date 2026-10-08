import React, { forwardRef, useRef, useState } from 'react';
import { FileAttachmentIcon, ImageIcon, SendFilledIcon, StopIcon } from 'tdesign-icons-react';
import { Textarea } from 'tdesign-react';

import { eventOf, renderNode, rootProps, slot, useChatClass, useElementRef } from '../_util/native';
import { useInjectedCSS } from '../_util/useInjectedCSS';
import { Attachments } from '../attachments';

import type { TextareaRefInterface } from 'tdesign-react/es/textarea/Textarea';
import type { StyledProps, TdChatSenderAction, TdChatSenderActionName, TdChatSenderProps } from '../_util/native-types';

export const ChatSender = forwardRef<HTMLElement | undefined, TdChatSenderProps & StyledProps & { css?: string }>(
  (props, ref) => {
    const { disabled = false, loading = false, autosize = { minRows: 2 }, textareaProps = {} } = props;
    const [localValue, setValue] = useState(props.defaultValue || '');
    const value = props.value === undefined ? localValue : props.value;
    const files = props.attachmentsProps?.items || [];
    const upload = useRef<HTMLInputElement>(null);
    const image = useRef<HTMLInputElement>(null);
    const input = useRef<TextareaRefInterface>(null);
    const composing = useRef(false);
    const sendDisabled =
      disabled ||
      (typeof props.sendBtnDisabled === 'function'
        ? props.sendBtnDisabled(value)
        : (props.sendBtnDisabled ?? !value.trim()));
    const root = useElementRef(ref, {
      focus: (options?: FocusOptions) => input.current?.textareaElement?.focus(options),
      blur: () => input.current?.textareaElement?.blur(),
      selectFile: () => {
        if (!disabled) upload.current?.click();
      },
    });
    useInjectedCSS(root, props.css);
    const base = useChatClass('chat-sender');
    const send = () => {
      if (sendDisabled || loading) return;
      props.onSend?.(eventOf('send', { value, attachments: files }));
      if (props.value === undefined) setValue('');
    };
    const actions = props.actions ?? props.suffix ?? ['send'];
    const config = (name: TdChatSenderActionName) =>
      (Array.isArray(actions)
        ? (
            actions.find(
              (item) =>
                typeof item === 'object' &&
                'name' in item &&
                (item.name === name || (name === 'uploadAttachment' && item.name === 'attachment')),
            ) as TdChatSenderAction
          )?.uploadProps
        : undefined) || props.uploadProps;
    const select = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onFileSelect?.(eventOf('fileSelect', Array.from(e.currentTarget.files || [])));
      e.currentTarget.value = '';
    };
    const preset = [
      {
        name: 'uploadImage',
        render: (
          <button
            data-td-chat-button=""
            type="button"
            disabled={disabled}
            aria-label="上传图片"
            onClick={() => image.current?.click()}
          >
            <ImageIcon />
          </button>
        ),
      },
      {
        name: 'uploadAttachment',
        render: (
          <button
            data-td-chat-button=""
            type="button"
            disabled={disabled}
            aria-label="上传附件"
            onClick={() => upload.current?.click()}
          >
            <FileAttachmentIcon />
          </button>
        ),
      },
      {
        name: 'attachment',
        render: (
          <button
            data-td-chat-button=""
            type="button"
            disabled={disabled}
            aria-label="上传附件"
            onClick={() => upload.current?.click()}
          >
            <FileAttachmentIcon />
          </button>
        ),
      },
      {
        name: 'send',
        render: (
          <button
            data-td-chat-button="send"
            type="button"
            disabled={disabled || (!loading && sendDisabled)}
            aria-label={loading ? '停止' : '发送'}
            onClick={() => {
              if (loading) props.onStop?.(eventOf('stop', value));
              else send();
            }}
          >
            {loading ? <StopIcon size="28px" /> : <SendFilledIcon />}
          </button>
        ),
      },
    ];
    const renderActions = () => {
      if (actions === false) return null;
      if (actions === true) return preset[preset.length - 1].render;
      if (typeof actions === 'function') {
        const result = actions(preset);
        return Array.isArray(result)
          ? result.map((item) => <React.Fragment key={item.name}>{renderNode(item.render)}</React.Fragment>)
          : result;
      }
      if (Array.isArray(actions))
        return actions.map((action, index) => (
          <React.Fragment key={index}>
            {
              preset.find(
                (item) => item.name === (typeof action === 'string' ? action : (action as TdChatSenderAction).name),
              )?.render
            }
          </React.Fragment>
        ));
      return renderNode(actions);
    };
    return (
      <div
        ref={root}
        {...rootProps(props, base)}
        data-td-chat="sender"
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
        }}
      >
        <input ref={upload} type="file" hidden disabled={disabled} {...config('uploadAttachment')} onChange={select} />
        <input
          ref={image}
          type="file"
          hidden
          disabled={disabled}
          {...config('uploadImage')}
          accept={config('uploadImage')?.accept || 'image/*'}
          onChange={select}
        />
        {slot(props.children, 'header')}
        <div className={props.innerClass} style={props.innerStyle} data-td-chat-part="sender-content">
          {slot(props.children, 'inner-header')}
          {files.length > 0 && (
            <Attachments
              {...props.attachmentsProps}
              items={files}
              onRemove={(e) => {
                props.attachmentsProps?.onRemove?.(e);
                props.onFileRemove?.(
                  eventOf(
                    'fileRemove',
                    files.filter((item) => item !== e.detail),
                  ),
                );
              }}
            />
          )}
          <div data-td-chat-part="sender-textarea">
            {slot(props.children, 'input-prefix')}
            {slot(
              props.children,
              'textarea',
              <Textarea
                {...textareaProps}
                ref={input}
                value={value}
                disabled={disabled}
                placeholder={props.placeholder}
                autosize={autosize}
                onChange={(text, context) => {
                  if (props.value === undefined) setValue(text);
                  props.onChange?.(eventOf('change', text));
                  textareaProps.onChange?.(text, context);
                }}
                onFocus={(text, context) => {
                  props.onFocus?.(eventOf('focus', value));
                  textareaProps.onFocus?.(text, context);
                }}
                onBlur={(text, context) => {
                  props.onBlur?.(eventOf('blur', value));
                  textareaProps.onBlur?.(text, context);
                }}
                onKeydown={(text, context) => {
                  textareaProps.onKeydown?.(text, context);
                  const event = context.e;
                  if (
                    event.key === 'Enter' &&
                    !event.shiftKey &&
                    !composing.current &&
                    !event.nativeEvent.isComposing &&
                    !event.defaultPrevented
                  ) {
                    event.preventDefault();
                    send();
                  }
                }}
              />,
            )}
          </div>
          <div
            data-td-chat-part="sender-footer"
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
          >
            <div>{slot(props.children, 'footer-prefix')}</div>
            <div>{slot(props.children, 'actions', renderActions())}</div>
          </div>
        </div>
      </div>
    );
  },
);
ChatSender.displayName = 'ChatSender';
export default ChatSender;
export type {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderApi,
  TdChatSenderParams,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
} from '../_util/native-types';
