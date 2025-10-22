import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { getAttach } from '../_util/dom';
import noop from '../_util/noop';
import { render, unmount } from '../_util/react-render';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';
import { getMessageConfig, globalConfig, setGlobalConfig } from './config';
import { PlacementOffset } from './const';
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
  zIndex?: number;
  id?: string;
  children?: React.ReactNode;
  renderCallback?: Function;
}

interface ContainerInstance {
  container: HTMLDivElement;
  messages: MessageInstance[];
}

let messageKey = 1;

// 不同 attach 和 placement 对应的消息容器
const MessageContainerMaps: Map<HTMLElement, Map<MessagePlacementList, ContainerInstance>> = new Map();

const MessageContainer: React.FC<MessageContainerProps> = (props) => {
  const { placement, children, zIndex, renderCallback } = props;

  const ref = useRef<HTMLDivElement>(null);

  const style: React.CSSProperties = { zIndex };

  Object.keys(PlacementOffset[placement]).forEach((key) => {
    style[key] = PlacementOffset[placement][key];
  });

  if (placement.includes('top')) {
    style.top = `${globalConfig.top}px`;
  }

  useEffect(() => {
    renderCallback?.(ref.current);
    // eslint-disable-next-line
  }, []);

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

async function findExistingContainer(attachNode: HTMLElement, placement: MessagePlacementList, zIndex?: number) {
  const attachNodeMap = getAttachNodeMap(attachNode);
  let containerInstance = attachNodeMap.get(placement);
  if (!containerInstance) {
    const container = await createContainer({ zIndex, placement });
    attachNode.appendChild(container);
    containerInstance = {
      container,
      messages: [],
    };
    attachNodeMap.set(placement, containerInstance);
  }
  return containerInstance;
}

/**
 * @desc 创建容器，所有的 message 会填充到容器中
 */
function createContainer({ zIndex, placement }): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const mGlobalConfig = ConfigProvider.getGlobalConfig();
    const fragment = document.createDocumentFragment(); // 临时容器
    render(
      <PluginContainer globalConfig={mGlobalConfig}>
        <MessageContainer
          placement={placement}
          zIndex={zIndex}
          renderCallback={(element) => {
            if (element) {
              resolve(element);
            }
          }}
        />
      </PluginContainer>,
      fragment,
    );
  });
}

/**
 * @desc 函数式调用时的 message 渲染函数
 */
async function renderElement(theme, config: MessageOptions): Promise<MessageInstance> {
  const { attach, placement = 'top', zIndex, content, offset, onClose = noop } = config;

  const attachNode = getAttach(attach);
  const containerInstance = await findExistingContainer(attachNode, placement, zIndex);

  let messageRef: HTMLDivElement | null = null;

  const message: MessageInstance = {
    close: () => {
      if (messageRef && messageRef.parentNode) {
        unmount(messageRef.parentNode as Element);
        messageRef.parentNode.removeChild(messageRef);
      }
      const index = containerInstance.messages.indexOf(message);
      if (index === -1) return;
      containerInstance.messages.splice(index, 1);
    },
  };

  let style: React.CSSProperties = { ...config.style };
  if (Array.isArray(offset) && offset.length === 2) {
    const [left, top] = offset;
    style = {
      left,
      top,
      ...style,
      position: 'relative',
    };
  }

  messageKey += 1;
  return new Promise((resolve) => {
    /**
     * message plugin 调用时走的渲染逻辑
     * 调用获取全局上下文的方法获取信息，可传递当前组件自身信息（ConfigProvider.getGlobalConfig({message:config})）
     * message组件不用穿，自身的配置信息都在props中
     */
    const mGlobalConfig = ConfigProvider.getGlobalConfig();
    render(
      <PluginContainer globalConfig={mGlobalConfig}>
        <MessageComponent
          key={messageKey}
          {...config}
          theme={theme}
          style={style}
          ref={(ref) => {
            messageRef = ref;
          }}
          onClose={(ctx) => {
            onClose(ctx);
            message.close();
          }}
        >
          {content}
        </MessageComponent>
      </PluginContainer>,
      containerInstance.container,
    );
    containerInstance.messages.push(message);
    resolve(message);
  });
}

// 判断是否是 messageOptions
function isConfig(content: MessageOptions | React.ReactNode): content is MessageOptions {
  return Object.prototype.toString.call(content) === '[object Object]' && 'content' in (content as MessageOptions);
}

// messageMethod 方法调用 message
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
  return renderElement(theme, getMessageConfig(config));
};

// 创建
export const MessagePlugin: MessagePlugin = (theme, message, duration) => messageMethod(theme, message, duration);
MessagePlugin.info = (content, duration) => messageMethod('info', content, duration);
MessagePlugin.error = (content, duration) => messageMethod('error', content, duration);
MessagePlugin.warning = (content, duration) => messageMethod('warning', content, duration);
MessagePlugin.success = (content, duration) => messageMethod('success', content, duration);
MessagePlugin.question = (content, duration) => messageMethod('question', content, duration);
MessagePlugin.loading = (content, duration) => messageMethod('loading', content, duration);
MessagePlugin.config = (options: MessageOptions) => setGlobalConfig(options);

/**
 * @desc Message 顶层内置函数，传入 message promise，关闭传入的 message.
 */
MessagePlugin.close = (messageInstance) => {
  messageInstance.then((instance) => instance.close());
};

/**
 * @desc 关闭所有的 message
 */
MessagePlugin.closeAll = (): MessageCloseAllMethod => {
  const allMessages: MessageInstance[] = [];
  MessageContainerMaps.forEach((placementMap) => {
    placementMap.forEach((instance) => {
      // 收集需要关闭的消息实例，避免同时遍历与删除导致的索引错乱问题
      allMessages.push(...instance.messages.slice());
    });
  });

  // 批量关闭所有消息
  allMessages.forEach((message) => {
    if (typeof message.close === 'function') {
      message.close();
    }
  });
  return;
};

export default MessageComponent;
