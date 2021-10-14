import useDefault from '../_util/useDefault';
import { TdTreeProps } from '../_type/components/tree';

export default function useControllable(
  props: TdTreeProps,
): Pick<TdTreeProps, 'value' | 'onChange' | 'expanded' | 'onExpand' | 'actived' | 'onActive'> {
  const [value, onChange] = useDefault(props.value, props.defaultValue, props.onChange);

  const [expanded, onExpand] = useDefault(props.expanded, props.defaultExpanded, props.onExpand);

  const [actived, onActive] = useDefault(props.actived, props.defaultActived, props.onActive);

  return {
    value,
    onChange,
    expanded,
    onExpand,
    actived,
    onActive,
  };
}
