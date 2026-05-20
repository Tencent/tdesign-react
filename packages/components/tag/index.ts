import './style/index.js';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import _CheckTag from './CheckTag';
import _CheckTagGroup from './CheckTagGroup';
import { TagFunction } from './Tag';

export type { CheckTagProps } from './CheckTag';
export type { TagProps } from './Tag';
export * from './type';

/**
 * 标签组件
 */
export const Tag = forwardRefWithStatics(TagFunction, {
  CheckTag: _CheckTag,
  CheckTagGroup: _CheckTagGroup,
});

Tag.displayName = 'Tag';

export const CheckTag = _CheckTag;
export const CheckTagGroup = _CheckTagGroup;

export default Tag;
