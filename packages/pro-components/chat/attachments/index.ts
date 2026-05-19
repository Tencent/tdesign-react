import 'tdesign-web-components/lib/attachments';

import reactify from '../_util/reactify';

import type { TdAttachmentsProps } from 'tdesign-web-components';

export const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default Attachments;

export type { TdAttachmentItem, TdAttachmentsProps } from 'tdesign-web-components';
