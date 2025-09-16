import { TdAttachmentsProps } from '@tencent/tdesign-webc-test';
import '@tencent/tdesign-webc-test/lib/attachments';
import reactify from '../_util/reactify';

export const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default Attachments;

export type { TdAttachmentsProps, TdAttachmentItem } from '@tencent/tdesign-webc-test';
