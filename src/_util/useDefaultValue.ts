import { SyntheticEvent, FormEvent, MouseEvent } from 'react';
import useDefault from './useDefault';
import noop from './noop';

export interface ControlledProps<
  V,
  E extends SyntheticEvent = SyntheticEvent | FormEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
  C extends ChangeContext<E> = ChangeContext<E>,
> {
  /**
   * 未提供 `value` 的情况下，提供了 `defaultValue`，则可以当做是非受控组件使用
   */
  defaultValue?: V;

  /**
   * 当前值
   */
  value?: V;

  /**
   * 值发生变更时进行回调
   * - `value` 变更的目标值
   * - `context` 此次变更的更多上下文信息，其中 `context.event` 可以获得导致变更的 React 事件
   */
  onChange?(value: V, context: C): void;
}

/**
 * 表单 `onChange` 事件中，提供的上下文信息
 */
export interface ChangeContext<E extends SyntheticEvent = SyntheticEvent> {
  /**
   * 触发 `onChange` 事件的事件对象
   */
  event?: E;
  e?: E;
}

export default function useDefaultValue<T, P extends ControlledProps<T>>(props: P, defaultDefaultValue?: T) {
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
