import pick from 'lodash/pick';
import type { TreeSelectProps } from './TreeSelect';
import type { SelectInputProps } from '../select-input';

const SelectInputPassthroughPropsKey: Array<keyof SelectInputProps> = [
  'multiple',
  'style',
  'disabled',
  'minCollapsedNum',
  'popupProps',
  'clearable',
  'loading',
];

export const useTreeSelectPassThroughProps = (props: TreeSelectProps) => pick(props, SelectInputPassthroughPropsKey);
