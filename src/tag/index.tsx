import { TagFunction } from './Tag';
import _CheckTag from './CheckTag';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { tagDefaultProps } from './defaultProps';

import './style/index.js';

export type { TagProps } from './Tag';
export type { CheckTagProps } from './CheckTag';
export * from './type';

/**
 * 标签组件
 */
export const Tag = forwardRefWithStatics(TagFunction, {
  CheckTag: _CheckTag,
});

Tag.displayName = 'Tag';
Tag.defaultProps = tagDefaultProps;
// export const Tag = _Tag;

export const CheckTag = _CheckTag;

export default Tag;
