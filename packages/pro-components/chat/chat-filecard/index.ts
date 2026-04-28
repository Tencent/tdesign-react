import { TdFileCardProps } from '@tdesign/web-components-chat';
import '@tdesign/web-components-chat/lib/filecard';
import reactify from '../_util/reactify';

export const Filecard: React.ForwardRefExoticComponent<
  Omit<TdFileCardProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdFileCardProps>('t-filecard');

export default Filecard;
export type { TdFileCardProps } from '@tdesign/web-components-chat';
