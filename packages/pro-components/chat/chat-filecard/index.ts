import '@tdesign/web-components-chat/filecard';

import reactify from '../_util/reactify';

import type { TdFileCardProps } from '@tdesign/web-components-chat';

export const Filecard: React.ForwardRefExoticComponent<
  Omit<TdFileCardProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdFileCardProps>('t-filecard');

export default Filecard;
export type { TdFileCardProps } from '@tdesign/web-components-chat';
