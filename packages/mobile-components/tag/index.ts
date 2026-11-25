import './style/index.js';

import _CheckTag from './CheckTag';
import _Tag from './Tag';

export type { TagProps } from './Tag';
export * from './type';

export const Tag = _Tag;
export const TagCheck = _CheckTag;
export default {
  Tag,
  TagCheck,
};
