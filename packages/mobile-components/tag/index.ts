import _Tag from './Tag';
import _CheckTag from './CheckTag';

import './style/index.js';

export type { TagProps } from './Tag';
export * from './type';

export const Tag = _Tag;
export const TagCheck = _CheckTag;
export default {
  Tag,
  TagCheck,
};
