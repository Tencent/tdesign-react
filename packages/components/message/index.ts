import './style/index.js';

import _Message, { MessagePlugin as _MessagePlugin } from './Message';

export * from './type';

export const Message = _Message;
export const message = _MessagePlugin;
export const MessagePlugin = _MessagePlugin;

export default Message;
