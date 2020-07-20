import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import { prefix, prefixWrapper, THEME_LIST, PLACEMENT_OFFSET } from './const';
import useConfig from '../_util/useConfig';
import { MessageProps, ConfigProps } from './Props';
import {
  PromptFillIcon,
  SuccessFillIcon,
  WarningFillIcon,
  HelpFillIcon,
  LoadingIcon,
  CloseIcon,
} from '@tdesign/react';
const Components = {
  info: PromptFillIcon,
  success: SuccessFillIcon,
  warning: WarningFillIcon,
  error: WarningFillIcon,
  question: HelpFillIcon,
  loading: LoadingIcon,
};
function RenderIcon({ theme }) {
  const Comp = Components[theme];
  return Comp ? <Comp /> : null;
}

let MessageList: MessageInstanceProps[] = [];
let keyIndex = 1;
const Top = 'top';

const globalConfig = {
  zIndex: 6000,
  duration: 3000,
  top: 32,
};

function createContainer(params) {
  const { attach, zIndex, placement = 'top' } = params;
  let mountedDom = document.body as HTMLElement;
  if (React.isValidElement(attach)) {
    mountedDom = attach;
  }
  const container = Array.from(mountedDom.querySelectorAll(`.${prefixWrapper}`));
  if (container.length < 1) {
    const div = document.createElement('div');
    div.className = cls(prefixWrapper);
    div.style.zIndex = zIndex;
    Object.keys(PLACEMENT_OFFSET[placement]).forEach((key) => {
      div.style[key] = PLACEMENT_OFFSET[placement][key];
    });
    if (placement.includes(Top)) {
      div.style[Top] = `${globalConfig.top}px`;
    }
    mountedDom.appendChild(div);
    return div;
  }
  return container[0];
}

interface MessageInstanceProps {
  key: number;
  remove: () => void;
}
function renderElement(theme, config: ConfigProps) {
  const container = createContainer(config) as HTMLElement;
  const { content, offset } = config;
  const div = document.createElement('div');
  keyIndex += 1;
  const message = {};
  let style = {};
  if (offset) {
    style = {
      ...offset,
      position: 'absolute',
      width: 'auto',
    };
  }
  ReactDOM.render(
    <Message
      theme={theme}
      style={style}
      {...config}
      onDurationEnd={() => {
        message.remove();
      }}
      onClickCloseBtn={() => {
        message.remove();
      }}
      key={keyIndex}
    >
      {content}
    </Message>,
    div,
  );
  container.appendChild(div);
  message.remove = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  };
  message.key = keyIndex;
  MessageList.push(message);
  return keyIndex;
}
function RenderClose(props) {
  const { closeBtn, onClickCloseBtn } = props;
  const { classPrefix } = useConfig();
  if (typeof closeBtn === 'string') {
    return (
      <span className={`${classPrefix}-message-close`} onClick={onClickCloseBtn}>
        {closeBtn}
      </span>
    );
  }
  if (React.isValidElement(closeBtn)) return closeBtn;
  if (typeof closeBtn === 'function') return closeBtn(onClickCloseBtn);
  if (!closeBtn) return null;
  return <CloseIcon className={`${classPrefix}-message-close`} />;
}
const Message = (props: MessageProps) => {
  const timerRef = useRef(0);
  const { theme, children, closeBtn, className, style, duration, onDurationEnd, onClosed } = props;
  const { classPrefix } = useConfig();
  useEffect(() => {
    if (duration) {
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        console.log('durationEnd....');
        typeof onDurationEnd === 'function' && onDurationEnd();
      }, duration);
    }
    return () => {
      clearTimeout(timerRef.current);
      typeof onClosed === 'function' && onClosed();
    };
  }, [duration, onDurationEnd, onClosed]);
  return (
    <div
      key="message"
      className={cls(`${prefix}`, className, `${classPrefix}-is-${theme}`, {
        [`${classPrefix}-is-closable`]: closeBtn,
      })}
      style={style}
    >
      <RenderIcon theme={theme} />
      {children}
      <RenderClose {...props} />
    </div>
  );
};

Message.defaultProps = {
  okText: 'Ok',
  cancelText: 'Cancel',
  theme: 'info',
  closeBtn: false,
};

THEME_LIST.forEach((theme) => {
  Message[theme] = (args, duration = globalConfig.duration) => {
    let config = {} as ConfigProps;
    if (typeof args === 'string') {
      config = {
        content: args,
        duration,
      };
    } else if (typeof args === 'object') {
      config = {
        duration,
        ...args,
      };
    }
    config = {
      ...config,
      zIndex: config.zIndex || globalConfig.zIndex,
    };
    return renderElement(theme, config);
  };
});

Message.close = function (keyIndex) {
  const index = MessageList.findIndex((item) => item.key === keyIndex);
  if (index > -1) {
    const [message] = MessageList.splice(index, 1);
    typeof message.remove === 'function' && message.remove();
  }
};

Message.closeAll = function () {
  MessageList.forEach((message) => {
    typeof message.remove === 'function' && message.remove();
  });
  MessageList = [];
};

export default Message;
