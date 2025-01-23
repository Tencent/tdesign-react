import { useState } from 'react';
import useControlled from '../../hooks/useControlled';
import { TdTreeProps } from '../type';
import type { TreeNodeValue } from '../../_common/js/tree-v1/types';

export default function useControllable(props: TdTreeProps): Pick<
  TdTreeProps,
  'value' | 'onChange' | 'expanded' | 'onExpand' | 'actived' | 'onActive'
> & {
  setTreeIndeterminate: (value: Array<TreeNodeValue>) => void;
  indeterminate: Array<TreeNodeValue>;
} {
  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const [expanded, onExpand] = useControlled(props, 'expanded', props.onExpand);

  const [actived, onActive] = useControlled(props, 'actived', props.onActive);

  // Indeterminate state
  const [indeterminate, setTreeIndeterminate] = useState([]);

  return {
    value,
    onChange,
    expanded,
    onExpand,
    actived,
    onActive,
    setTreeIndeterminate,
    indeterminate,
  };
}
