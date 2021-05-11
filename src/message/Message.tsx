import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { prefixWrapper, ThemeList, PlacementOffset } from './const';
import { MessageConfig, MessageInstance, MessageComponent } from './MessageProps';
import MessageKen from './Messages';

let MessageList: MessageInstance[] = [];
let keyIndex = 1;

const Top = 'top';

const globalConfig = {
  zIndex: 6000,
  duration: 3000,
  top: 32,
};

function createContainer({ attach, zIndex, placement = Top }: MessageConfig) {
  let mountedDom = document.body as HTMLElement;
  if (React.isValidElement(attach)) {
    mountedDom = attach;
  }

  const container = Array.from(mountedDom.querySelectorAll(`.${prefixWrapper}`));
  if (container.length < 1) {
    const div = document.createElement('div');
    div.className = classNames(prefixWrapper);
    div.style.zIndex = String(zIndex);

    Object.keys(PlacementOffset[placement]).forEach((key) => {
      div.style[key] = PlacementOffset[placement][key];
    });

    if (placement.includes(Top)) {
      div.style[Top] = `${globalConfig.top}px`;
    }
    mountedDom.appendChild(div);
    return div;
  }
  return container[0];
}

function renderElement(theme, config: MessageConfig) {
  const container = createContainer(config) as HTMLElement;
  const { content, offset } = config;
  const div = document.createElement('div');

  keyIndex += 1;

  const message = {
    close: () => {
      ReactDOM.unmountComponentAtNode(div);
      div.remove();
    },
    key: keyIndex,
  };

  let style: React.CSSProperties = {};
  if (offset) {
    style = {
      ...offset,
      position: 'absolute',
      width: 'auto',
    };
  }

  return new Promise((res) => {
    ReactDOM.render(
      <Message
        theme={theme}
        style={style}
        ref={() => {
          res(message);
        }}
        key={keyIndex}
        {...config}
        close={() => message.close()}
      >
        {content}
      </Message>,
      div,
    );
    container.appendChild(div);
    MessageList.push(message);
  });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const Message: MessageComponent = MessageKen;

function isConfig(content: MessageConfig | React.ReactNode): content is MessageConfig {
  return Object.prototype.toString.call(content) === '[object Object]' && !!(content as MessageConfig).content;
}

ThemeList.forEach((theme) => {
  Message[theme] = (content: MessageConfig | React.ReactNode, duration: number = globalConfig.duration) => {
    let config = {} as MessageConfig;
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
});

Message.close = (message) => {
  message.then((instance) => instance.close());
};

Message.closeAll = function () {
  MessageList.forEach((message) => {
    typeof message.close === 'function' && message.close();
  });
  MessageList = [];
};

export default Message;
