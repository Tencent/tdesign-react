import '@tdesign/web-components-chat/attachments';

import reactify from '../_util/reactify';

import type { TdAttachmentsProps } from '@tdesign/web-components-chat/attachments';

export const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default Attachments;

export type { TdAttachmentsProps } from '@tdesign/web-components-chat/attachments';
export type { TdAttachmentItem } from '@tdesign/web-components-chat/filecard';
