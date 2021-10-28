import { useMemo } from 'react';
import isArray from 'lodash/isArray';
import useDefault from '../../_util/useDefault';
import noop from '../../_util/noop';
import { UploadProps } from '../types';

export default function useDefaultValue<T, P extends UploadProps>(props: P, defaultDefaultValue?: T) {
  type ReturnType = Omit<P, 'defaultFiles'>;

  const { value, defaultFiles, files, onChange = noop, ...restProps } = props;

  // 兼容form value props 且 form props 优先
  const controlledValue = useMemo(() => {
    // form 设置的默认值空字符串
    const formValue = value !== undefined && !isArray(value) ? [] : value;
    return formValue || files;
  }, [files, value]);

  const [finalValue, finalOnChange] = useDefault(
    controlledValue,
    typeof defaultFiles === 'undefined' ? defaultDefaultValue : defaultFiles,
    onChange,
  );

  return {
    files: finalValue,
    onChange: finalOnChange,
    ...restProps,
  } as ReturnType;
}
