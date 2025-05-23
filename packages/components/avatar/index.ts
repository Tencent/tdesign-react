import _Avatar from './Avatar';
import _AvatarGroup from './AvatarGroup';

import './style/index.js';

export type { AvatarProps } from './Avatar';
export type { AvatarGroupProps } from './AvatarGroup';
export * from './type';

export const AvatarGroup = _AvatarGroup;
export const Avatar = _Avatar;
export default Avatar;
