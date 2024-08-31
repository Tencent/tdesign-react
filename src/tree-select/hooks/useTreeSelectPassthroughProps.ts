import pick from 'lodash/pick';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
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
  'autoWidth',
  'borderless',
  'readonly',
];

export const useTreeSelectPassThroughProps = (props: TreeSelectProps) => {
  const { classPrefix } = useConfig();

  return {
    ...pick(props, SelectInputPassthroughPropsKey),
    popupProps: {
      ...props.popupProps,
      overlayClassName: classNames(props?.popupProps?.overlayClassName, `${classPrefix}-tree-select-popup`),
    },
  };
};
