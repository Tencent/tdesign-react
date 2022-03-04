import _Message, { MessagePlugin as _MessagePlugin } from './Message';

import './style/index.js';

export * from './type';

export const Message = _Message;
export const message = _MessagePlugin;
export const MessagePlugin = _MessagePlugin;

export default Message;
