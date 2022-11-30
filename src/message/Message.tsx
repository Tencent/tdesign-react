import React, { CSSProperties, useEffect } from 'react';
import classNames from 'classnames';
import { render, unmount } from '../_util/react-render';

import {
  MessageCloseAllMethod,
  MessageErrorMethod,
  MessageInfoMethod,
  MessageInstance,
  MessageLoadingMethod,
  MessageMethod,
  MessageOptions,
  MessageQuestionMethod,
  MessageSuccessMethod,
  MessageWarningMethod,
  MessageThemeList,
  MessageConfigMethod,
  MessagePlacementList,
} from './type';
import { AttachNodeReturnValue } from '../common';
import noop from '../_util/noop';
import { PlacementOffset } from './const';
import MessageComponent from './MessageComponent';

import { getMessageConfig, globalConfig, setGlobalConfig } from './config';
import { useMessageClass } from './useMessageClass';

// 定义全局的 message 列表，closeAll 函数需要使用
let MessageList: MessageInstance[] = [];
let keyIndex = 1;

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

const MessageContainer: React.FC<MessageContainerProps> = (props) => {
  const { placement, children, zIndex, id, renderCallback } = props;

  const style: CSSProperties = {
    zIndex,
  };

  Object.keys(PlacementOffset[placement]).forEach((key) => {
    style[key] = PlacementOffset[placement][key];
  });

  if (placement.includes('top')) {
    style.top = `${globalConfig.top}px`;
  }

  useEffect(() => {
    renderCallback();
    // eslint-disable-next-line
  }, []);

  const { tdMessagePlacementClassGenerator, tdMessageListClass } = useMessageClass();

  return (
    <div className={classNames(tdMessageListClass, tdMessagePlacementClassGenerator(placement))} style={style} id={id}>
      {children}
    </div>
  );
};

/**
 * @desc 创建容器，所有的 message 会填充到容器中
 */
function createContainer({ attach, zIndex, placement = 'top' }: MessageOptions): Promise<Element> {
  return new Promise((resolve) => {
    // 默认注入到 body 中，如果用户有指定，以用户指定的为准
    let mountedDom: AttachNodeReturnValue = document.body;

    // attach 为字符串时认为是选择器
    if (typeof attach === 'string') {
      const result = document.querySelectorAll(attach);
      if (result.length >= 1) {
        // :todo 编译器提示 nodelist 为类数组类型，并没有实现迭代器，没办法使用数组解构，暂时加上 eslint-disable
        // eslint-disable-next-line prefer-destructuring
        mountedDom = result[0];
      }
    } else if (typeof attach === 'function') {
      mountedDom = attach();
    }

    // 选择器找到一个挂载 message 的容器，不存在则创建
    const containerId = `tdesign-message-container--${placement}`;
    const container = Array.from(mountedDom.querySelectorAll(`#${containerId}`));
    if (container.length < 1) {
      const div = document.createElement('div');
      render(
        <MessageContainer
          id={containerId}
          placement={placement}
          zIndex={zIndex}
          renderCallback={() => {
            mountedDom.appendChild(div);
            const container = Array.from(mountedDom.querySelectorAll(`#${containerId}`));
            resolve(container[0]);
          }}
        />,
        div,
      );
    } else {
      resolve(container[0]);
    }
  });
}

/**
 * @desc 函数式调用时的 message 渲染函数
 */
async function renderElement(theme, config: MessageOptions): Promise<MessageInstance> {
  const container = (await createContainer(config)) as HTMLElement;

  const { content, offset, onDurationEnd = noop, onCloseBtnClick = noop } = config;
  const div = document.createElement('div');

  keyIndex += 1;

  const message = {
    close: () => {
      unmount(div);
      div.remove();
      message.closed = true;
    },
    key: keyIndex,
    closed: false,
  };

  if (config.duration !== 0) {
    setTimeout(() => {
      if (!message.closed) {
        message.close();
        onDurationEnd();
      }
    }, config.duration);
  }

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

  return new Promise((resolve) => {
    // 渲染组件
    render(
      <MessageComponent
        key={keyIndex}
        {...config}
        theme={theme}
        style={style}
        onCloseBtnClick={(ctx) => {
          onCloseBtnClick(ctx);
          message.close();
        }}
      >
        {content}
      </MessageComponent>,
      div,
    );

    // 将当前渲染的 message 挂载到指定的容器中
    container.appendChild(div);
    // message 推入 message 列表
    MessageList.push(message);
    // 将 message 实例通过 resolve 返回给 promise 调用方
    resolve(message);
  });
}

// 判断是否是 messageOptions
function isConfig(content: MessageOptions | React.ReactNode): content is MessageOptions {
  return Object.prototype.toString.call(content) === '[object Object]' && !!(content as MessageOptions).content;
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
 * @date 2021-05-16 13:11:24
 * @desc Message 顶层内置函数，传入 message promise，关闭传入的 message.
 */
MessagePlugin.close = (messageInstance) => {
  messageInstance.then((instance) => instance.close());
};

/**
 * @desc 关闭所有的 message
 */
MessagePlugin.closeAll = (): MessageCloseAllMethod => {
  MessageList.forEach((message) => {
    typeof message.close === 'function' && message.close();
  });
  MessageList = [];
  return;
};

export default MessageComponent;
