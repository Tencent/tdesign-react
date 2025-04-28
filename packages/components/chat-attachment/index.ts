import { TdAttachmentsProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export const ChatAttachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default ChatAttachments;

export type { TdAttachmentsProps, TdAttachmentItem } from '@tencent/tdesign-chatbot';
