import { TdAttachmentsProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/attachments';
import reactify from '../_util/reactify';

export const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

export default Attachments;

export type { TdAttachmentsProps, TdAttachmentItem } from 'tdesign-web-components';
