import React from 'react';
import { isBrowser } from '../_util/dom';
import { render } from '../_util/react-render';
import { MessageThemeList, TdMessageProps } from './type';
import { messageDefaultProps } from './defaultProps';
import Message from './Message';

export interface MessageActionOptionsType extends TdMessageProps {
  context?: Element;
}

const instanceMap: Map<Element, Record<string, Element>> = new Map();

function destroy(context: Element, root: Element) {
  if (context.contains(root)) {
    context.removeChild(root);
    if (instanceMap.has(root)) {
      instanceMap.delete(root);
    }
  }
}

const createMessage = (props: MessageActionOptionsType | string, theme?: MessageThemeList) => {
  const normalizedProps = typeof props === 'string' ? { content: props } : props;
  const config = {
    ...messageDefaultProps,
    visible: true,
    context: isBrowser ? document.body : null,
    ...normalizedProps,
  };
  const { context } = config;
  if (!context) {
    console.error('未找到组件, 请确认 context 是否正确');
    return;
  }

  const root = document.createElement('div');
  context.appendChild(root);

  instanceMap.set(root, {
    context,
  });

  render(<Message {...{ ...config, theme, container: root }} />, root);
};

const closeAll = () => {
  for (const [key, value] of instanceMap) {
    const { context } = value;
    destroy(context as Element, key);
  }
};

export default {
  info: (props: MessageActionOptionsType | string) => createMessage(props, 'info'),
  success: (props: MessageActionOptionsType | string) => createMessage(props, 'success'),
  warning: (props: MessageActionOptionsType | string) => createMessage(props, 'warning'),
  error: (props: MessageActionOptionsType | string) => createMessage(props, 'error'),
  closeAll,
};
