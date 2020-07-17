import useDefault from '../_util/useDefault';
import noop from './noop';
import { ControlledProps } from '../_type';

export default function useDefaultValue<T, P extends ControlledProps<T>>(
  props: P,
  defaultDefaultValue?: T,
) {
  type ReturnType = Omit<P, 'defaultValue'>;

  const { defaultValue, value, onChange = noop, ...restProps } = props;

  const [finalValue, finalOnChange] = useDefault(
    value,
    typeof defaultValue === 'undefined' ? defaultDefaultValue : defaultValue,
    onChange,
  );

  return {
    value: finalValue,
    onChange: finalOnChange,
    ...restProps,
  } as ReturnType;
}
