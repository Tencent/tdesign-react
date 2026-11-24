import _Avatar from './Avatar';

import './style/index.js';

import _AvatarGroup from './AvatarGroup';

export type { AvatarProps } from './Avatar';
export type { AvatarGroupProps } from './AvatarGroup';

export * from './type';
export * from './AvatarGroupContext';

export const Avatar = _Avatar;
export const AvatarGroup = _AvatarGroup;
export default Avatar;
