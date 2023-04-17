import _Tag from './Tag';
import _CheckTag from './CheckTag';

import './style/index.js';

export type { TagProps } from './Tag';
export type { CheckTagProps } from './CheckTag';
export * from './type';

export const Tag = _Tag;
export const CheckTag = _CheckTag;
export default Tag;
