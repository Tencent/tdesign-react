/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdAnchorProps, TdAnchorItemProps, TdAnchorTargetProps } from './type';

export const anchorDefaultProps: TdAnchorProps = {
  bounds: 5,
  container: () => window,
  size: 'medium',
  targetOffset: 0,
};

export const anchorItemDefaultProps: Pick<TdAnchorItemProps, 'target'> = { target: '_self' };

export const anchorTargetDefaultProps: Pick<TdAnchorTargetProps, 'tag'> = { tag: 'div' };
