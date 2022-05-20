import useControlled from '../hooks/useControlled';
import { TdTreeProps } from './type';

export default function useControllable(
  props: TdTreeProps,
): Pick<TdTreeProps, 'value' | 'onChange' | 'expanded' | 'onExpand' | 'actived' | 'onActive'> {
  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const [expanded, onExpand] = useControlled(props, 'expanded', props.onExpand);

  const [actived, onActive] = useControlled(props, 'actived', props.onActive);

  return {
    value,
    onChange,
    expanded,
    onExpand,
    actived,
    onActive,
  };
}
