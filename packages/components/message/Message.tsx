import React, { createRef, useRef } from 'react';
import classNames from 'classnames';
import { camelCase } from 'lodash-es';

import { PLACEMENT_OFFSET, fadeOut } from '@tdesign/common-js/message/index';
import { getAttach } from '../_util/dom';
import { render } from '../_util/react-render';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';
import { getMessageConfig, globalConfig, setGlobalConfig } from './config';
import MessageComponent from './MessageComponent';
import { useMessageClass } from './useMessageClass';

import type { TNode } from '../common';
import type {
  MessageCloseAllMethod,
  MessageConfigMethod,
  MessageErrorMethod,
  MessageInfoMethod,
  MessageInstance,
  MessageLoadingMethod,
  MessageMethod,
  MessageOptions,
  MessagePlacementList,
  MessageQuestionMethod,
  MessageSuccessMethod,
  MessageThemeList,
  MessageWarningMethod,
  TdMessageProps,
} from './type';

export interface MessagePlugin {
  (theme: MessageThemeList, message: TNode | MessageOptions, duration?: number): Promise<MessageInstance>;
  info: MessageInfoMethod;
  success: MessageSuccessMethod;
  warning: MessageWarningMethod;
  error: MessageErrorMethod;
  question: MessageQuestionMethod;
  loading: MessageLoadingMethod;
  closeAll: MessageCloseAllMethod;
  close: (message: Promise<MessageInstance>) => void;
  config: MessageConfigMethod;
}

interface MessageContainerProps {
  placement?: MessagePlacementList;
  zIndex?: number;
  children?: React.ReactNode;
}

interface ContainerInstance {
  container: HTMLDivElement;
  messages: MessageItem[];
  placement: MessagePlacementList;
  zIndex?: number;
}

interface MessageItem extends MessageInstance {
  ref?: React.RefObject<HTMLDivElement>;
  key: number;
  theme: MessageThemeList;
  config: MessageOptions;
  content: TNode;
}

let messageKey = 1;

const MessageContainerMaps: Map<HTMLElement, Map<MessagePlacementList, ContainerInstance>> = new Map();

const MessageContainer: React.FC<MessageContainerProps> = (props) => {
  const { placement, children, zIndex } = props;

  const ref = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {};
  Object.keys(PLACEMENT_OFFSET[placement]).forEach((key) => {
    style[camelCase(key)] = PLACEMENT_OFFSET[placement][key];
  });
  if (placement.includes('top')) {
    style.top = `${globalConfig.top}px`;
  }
  // 允许自定义消息列表的层级，默认使用全局配置值
  if (typeof zIndex !== 'undefined') {
    style.zIndex = zIndex;
  }

  const { tdMessagePlacementClassGenerator, tdMessageListClass } = useMessageClass();

  return (
    <div
      ref={ref}
      className={classNames(tdMessageListClass, tdMessagePlacementClassGenerator(placement))}
      style={style}
    >
      {children}
    </div>
  );
};

function getAttachNodeMap(attachNode: HTMLElement) {
  if (!MessageContainerMaps.has(attachNode)) {
    MessageContainerMaps.set(attachNode, new Map());
  }
  return MessageContainerMaps.get(attachNode);
}

function createContainer(placement: MessagePlacementList, attachNode: HTMLElement, zIndex?: number): HTMLDivElement {
  const mGlobalConfig = ConfigProvider.getGlobalConfig();
  const containerWrapper = document.createElement('div');
  attachNode.appendChild(containerWrapper);
  render(
    <PluginContainer globalConfig={mGlobalConfig}>
      <MessageContainer placement={placement} zIndex={zIndex} />
    </PluginContainer>,
    containerWrapper,
  );
  return containerWrapper;
}

function renderContainer(containerInstance: ContainerInstance) {
  const mGlobalConfig = ConfigProvider.getGlobalConfig();
  render(
    <PluginContainer globalConfig={mGlobalConfig}>
      <MessageContainer placement={containerInstance.placement} zIndex={containerInstance.zIndex}>
        {containerInstance.messages.map((item) => (
          <MessageComponent key={item.key} ref={item.ref} {...item.config} theme={item.theme} />
        ))}
      </MessageContainer>
    </PluginContainer>,
    containerInstance.container,
  );
}

function destroyContainer(containerInstance: ContainerInstance, attachNode: HTMLElement) {
  if (containerInstance.messages.length > 0) return;

  // 没有消息时，销毁容器
  const { container, placement } = containerInstance;
  render(null, container);

  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }

  const attachNodeMap = MessageContainerMaps.get(attachNode);
  if (attachNodeMap) {
    attachNodeMap.delete(placement);
    if (attachNodeMap.size === 0) {
      MessageContainerMaps.delete(attachNode);
    }
  }
}

function renderElement(theme: MessageThemeList, config: MessageOptions): MessageInstance {
  const { attach, placement = 'top', zIndex } = config;
  const attachNode = getAttach(attach);
  const attachNodeMap = getAttachNodeMap(attachNode);

  let containerInstance = attachNodeMap.get(placement);
  if (!containerInstance) {
    const container = createContainer(placement, attachNode, zIndex);
    containerInstance = {
      container,
      messages: [],
      placement,
      zIndex,
    };
    attachNodeMap.set(placement, containerInstance);
  } else if (typeof zIndex !== 'undefined') {
    // 已有容器也需要更新层级，保持后续调用一致
    containerInstance.zIndex = zIndex;
  }

  let style: React.CSSProperties = { ...config.style };
  if (Array.isArray(config.offset) && config.offset.length === 2) {
    const [left, top] = config.offset;
    style = {
      left,
      top,
      ...style,
      position: 'relative',
    };
  }

  messageKey += 1;
  const currentKey = messageKey;
  const messageRef = createRef<HTMLDivElement>();

  const message: MessageItem = {
    key: currentKey,
    ref: messageRef,
    theme,
    content: config.content,
    config: {
      ...config,
      style,
      placement,
      onClose: (context) => {
        // 自动消失
        closeMessage(context);
      },
    },
    close: () => {
      // 手动消失
      const index = containerInstance.messages.indexOf(message);
      if (index === -1) return;
      fadeOut(messageRef.current, placement, () => {
        closeMessage();
      });
    },
  };

  function closeMessage(context?: Parameters<TdMessageProps['onClose']>[0]) {
    const index = containerInstance.messages.indexOf(message);
    if (index === -1) return;
    fadeOut(messageRef.current, placement, () => {
      containerInstance.messages.splice(index, 1);
      renderContainer(containerInstance);
      destroyContainer(containerInstance, attachNode);
      if (context) {
        config.onClose?.(context);
      }
    });
  }

  containerInstance.messages.push(message);
  renderContainer(containerInstance);
  return message;
}

function isConfig(content: MessageOptions | React.ReactNode): content is MessageOptions {
  return Object.prototype.toString.call(content) === '[object Object]' && 'content' in (content as MessageOptions);
}

const messageMethod: MessageMethod = (theme: MessageThemeList, content, duration?: number) => {
  let config = {} as MessageOptions;
  if (isConfig(content)) {
    config = {
      duration,
      ...content,
    };
  } else {
    config = {
      content,
      duration,
    };
  }
  return Promise.resolve(renderElement(theme, getMessageConfig(config)));
};

export const MessagePlugin: MessagePlugin = (theme, message, duration) => messageMethod(theme, message, duration);
MessagePlugin.info = (content, duration) => messageMethod('info', content, duration);
MessagePlugin.error = (content, duration) => messageMethod('error', content, duration);
MessagePlugin.warning = (content, duration) => messageMethod('warning', content, duration);
MessagePlugin.success = (content, duration) => messageMethod('success', content, duration);
MessagePlugin.question = (content, duration) => messageMethod('question', content, duration);
MessagePlugin.loading = (content, duration) => messageMethod('loading', content, duration);
MessagePlugin.config = (options: MessageOptions) => setGlobalConfig(options);

MessagePlugin.close = (messageInstance) => {
  messageInstance.then((instance) => instance.close());
};

MessagePlugin.closeAll = () => {
  MessageContainerMaps.forEach((placementMap, attachNode) => {
    placementMap.forEach((container) => {
      if (container.messages.length) {
        container.messages.splice(0, container.messages.length);
        destroyContainer(container, attachNode);
      }
    });
  });
};

export default MessageComponent;
