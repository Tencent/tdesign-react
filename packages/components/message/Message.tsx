import React, { useRef } from 'react';
import classNames from 'classnames';
import { camelCase } from 'lodash-es';

import { fadeOut } from '@tdesign/common-js/message/animation';
import { PLACEMENT_OFFSET } from '@tdesign/common-js/message/index';
import { getAttach } from '../_util/dom';
import { render } from '../_util/react-render';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';
import { getMessageConfig, globalConfig, setGlobalConfig } from './config';
import MessageComponent from './MessageComponent';
import { useMessageClass } from './useMessageClass';

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
} from './type';

export interface MessagePlugin {
  (theme: MessageThemeList, message: string | MessageOptions, duration?: number): Promise<MessageInstance>;
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
  children?: React.ReactNode;
}

interface ContainerInstance {
  container: HTMLDivElement;
  messages: MessageItem[];
  placement: MessagePlacementList;
}

interface MessageItem extends MessageInstance {
  ref?: React.RefObject<HTMLDivElement>;
  key: number;
  theme: MessageThemeList;
  config: MessageOptions;
  content: React.ReactNode;
}

let messageKey = 1;

const MessageContainerMaps: Map<HTMLElement, Map<MessagePlacementList, ContainerInstance>> = new Map();

const MessageContainer: React.FC<MessageContainerProps> = (props) => {
  const { placement, children } = props;

  const ref = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = {};
  Object.keys(PLACEMENT_OFFSET[placement]).forEach((key) => {
    style[camelCase(key)] = PLACEMENT_OFFSET[placement][key];
  });
  if (placement.includes('top')) {
    style.top = `${globalConfig.top}px`;
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

function createContainer(placement: MessagePlacementList, attachNode: HTMLElement): HTMLDivElement {
  const mGlobalConfig = ConfigProvider.getGlobalConfig();
  const containerElement = document.createElement('div');
  attachNode.appendChild(containerElement);
  const ContainerWrapper = () => <MessageContainer placement={placement} />;
  render(
    <PluginContainer globalConfig={mGlobalConfig}>
      <ContainerWrapper />
    </PluginContainer>,
    containerElement,
  );
  return containerElement;
}

function renderElement(theme: MessageThemeList, config: MessageOptions): MessageInstance {
  const { attach, placement = 'top' } = config;
  const attachNode = getAttach(attach);
  const attachNodeMap = getAttachNodeMap(attachNode);

  let containerInstance = attachNodeMap.get(placement);
  if (!containerInstance) {
    const container = createContainer(placement, attachNode);
    containerInstance = {
      container,
      messages: [],
      placement,
    };
    attachNodeMap.set(placement, containerInstance);
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
  const messageRef = React.createRef<HTMLDivElement>();

  const message: MessageItem = {
    key: currentKey,
    theme,
    ref: messageRef,
    config: {
      ...config,
      style,
      placement,
      onClose: (context) => {
        const index = containerInstance.messages.indexOf(message);
        if (index === -1) return;
        fadeOut(messageRef.current, placement, () => {
          containerInstance.messages.splice(index, 1);
          renderContainer(containerInstance);
          config.onClose?.(context);
        });
      },
    },
    content: config.content,
    close: () => {
      const index = containerInstance.messages.indexOf(message);
      if (index === -1) return;
      fadeOut(messageRef.current, placement, () => {
        containerInstance.messages.splice(index, 1);
        renderContainer(containerInstance);
      });
    },
  };

  containerInstance.messages.push(message);
  renderContainer(containerInstance);

  return message;
}

function renderContainer(containerInstance: ContainerInstance) {
  const mGlobalConfig = ConfigProvider.getGlobalConfig();

  render(
    <PluginContainer globalConfig={mGlobalConfig}>
      <MessageContainer placement={containerInstance.placement}>
        {containerInstance.messages.map((item) => (
          <MessageComponent key={item.key} ref={item.ref} {...item.config} theme={item.theme}>
            {item.config.content}
          </MessageComponent>
        ))}
      </MessageContainer>
    </PluginContainer>,
    containerInstance.container,
  );
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

MessagePlugin.closeAll = (): void => {
  MessageContainerMaps.forEach((placementMap) => {
    placementMap.forEach((container) => {
      if (container.messages.length) {
        container.messages.splice(0, container.messages.length);
        renderContainer(container);
      }
    });
  });
};

export default MessageComponent;
