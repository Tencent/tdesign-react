import '@tdesign/web-components-chat/attachments';

import reactify from '../_util/reactify';

import type { TdAttachmentsProps } from '@tdesign/web-components-chat';

export const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default Attachments;

export type { TdAttachmentItem, TdAttachmentsProps } from '@tdesign/web-components-chat';
