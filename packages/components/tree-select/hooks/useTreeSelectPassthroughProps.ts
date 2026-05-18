import classNames from 'classnames';
import { pick } from 'lodash-es';

import useConfig from '../../hooks/useConfig';

import type { SelectInputProps } from '../../select-input';
import type { TreeSelectProps } from '../TreeSelect';

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
  'readOnly',
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
