import { TagFunction } from './Tag';
import _CheckTag from './CheckTag';
import _CheckTagGroup from './CheckTagGroup';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import './style/index.js';

export type { TagProps } from './Tag';
export type { CheckTagProps } from './CheckTag';
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
