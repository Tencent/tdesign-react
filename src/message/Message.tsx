import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

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
  TdMessageProps,
  MessageThemeList,
} from '../_type/components/message';
import { AttachNodeReturnValue } from '../_type/common';
import noop from '../_util/noop';
import { PlacementOffset, THEME_ARRAY } from './const';
import MessageComponent from './MessageComponent';

// 定义全局的 message 列表，closeAll 函数需要使用
let MessageList: MessageInstance[] = [];
let keyIndex = 1;

// 全局默认配置，zIndex 为 5000，默认关闭事件 3000
const globalConfig = {
  zIndex: 5000,
  duration: 3000,
  top: 32,
};

export interface MessageProps extends React.FC<TdMessageProps> {
  info: MessageInfoMethod;
  success: MessageSuccessMethod;
  warning: MessageWarningMethod;
  error: MessageErrorMethod;
  question: MessageQuestionMethod;
  loading: MessageLoadingMethod;
  closeAll: MessageCloseAllMethod;
  close: (message: Promise<MessageInstance>) => void;
}

/**
 * @author kenzyyang
 * @date 2021-05-11 20:36:52
 * @desc 创建容器，所有的 message 会填充到容器中
 */
function createContainer({ attach, zIndex, placement = 'top' }: MessageOptions) {
  // 默认注入到 body 中，如果用户有制定，以用户指定的为准
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

  // :todo 暂时写死，需要 pmc 确定如何在非组件中拿到动态配置的样式前缀
  const tdMessageListClass = 't-message-list';
  const tdMessagePlacementClass = `t-message-placement--${placement}`;

  // 选择器找到一个挂载 message 的容器，不存在则创建
  const container = Array.from(mountedDom.querySelectorAll(`.${tdMessageListClass}.${tdMessagePlacementClass}`));
  if (container.length < 1) {
    const div = document.createElement('div');
    div.className = classNames(tdMessageListClass, tdMessagePlacementClass);
    div.style.zIndex = String(zIndex || globalConfig.zIndex);

    Object.keys(PlacementOffset[placement]).forEach((key) => {
      div.style[key] = PlacementOffset[placement][key];
    });

    if (placement.includes('top')) {
      div.style.top = `${globalConfig.top}px`;
    }
    mountedDom.appendChild(div);
    return div;
  }
  return container[0];
}

/**
 * @desc 函数式调用时的 message 渲染函数
 */
function renderElement(theme, config: MessageOptions): Promise<MessageInstance> {
  const container = createContainer(config) as HTMLElement;
  let { duration = globalConfig.duration } = config;
  const { content, offset, onDurationEnd = noop } = config;
  const div = document.createElement('div');

  keyIndex += 1;

  const message = {
    close: () => {
      ReactDOM.unmountComponentAtNode(div);
      div.remove();
    },
    key: keyIndex,
  };

  // 校验duration 合法性
  if (duration < 0) {
    duration = 3000;
  }
  if (duration !== 0) {
    setTimeout(() => {
      message.close();
      onDurationEnd();
    }, duration);
  }

  let style: React.CSSProperties = {};
  if (Array.isArray(offset) && offset.length === 2) {
    const [left, top] = offset;
    style = {
      left,
      top,
      position: 'relative',
    };
  }

  return new Promise((resolve) => {
    // 渲染组件
    ReactDOM.render(
      <MessageComponent theme={theme} style={style} key={keyIndex} {...config}>
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// :todo 需要 api 定义完全的 message 格式，否则用户使用时没法得到 message.info 的提示.
const Message: MessageProps = MessageComponent;

// 判断是否是 messageOptions
function isConfig(content: MessageOptions | React.ReactNode): content is MessageOptions {
  return Object.prototype.toString.call(content) === '[object Object]' && !!(content as MessageOptions).content;
}

const messageMethod: MessageMethod = (theme: MessageThemeList, content, duration: number = globalConfig.duration) => {
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
  config = {
    ...config,
    zIndex: config.zIndex || globalConfig.zIndex,
  };
  return renderElement(theme, config);
};

THEME_ARRAY.forEach((theme) => {
  Message[theme] = (content, duration) => messageMethod(theme, content, duration);
});

/**
 * @date 2021-05-16 13:11:24
 * @desc Message 顶层内置函数，传入 message promise，关闭传入的 message.
 */
Message.close = (message) => {
  message.then((instance) => instance.close());
};

/**
 * @date 2021-05-16 13:11:24
 * @desc 关闭所有的 message
 * :todo 需明确关闭范围，目前 message 中暂无 namespace 类似概念，暂时做全 message 关闭
 * 可预见到的扩展: 根据不同的 attach 做关闭,根据不同的类型做关闭，根据不同的 namespace 做关闭等等
 */
Message.closeAll = (): MessageCloseAllMethod => {
  MessageList.forEach((message) => {
    typeof message.close === 'function' && message.close();
  });
  MessageList = [];
  return;
};

export default Message;
