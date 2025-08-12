import { TdFileCardProps } from '@tencent/tdesign-webc-test';
import '@tencent/tdesign-webc-test/lib/filecard';
import reactify from '../_util/reactify';

export const Filecard: React.ForwardRefExoticComponent<
  Omit<TdFileCardProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdFileCardProps>('t-filecard');

export default Filecard;
export type { TdFileCardProps } from '@tencent/tdesign-webc-test';
