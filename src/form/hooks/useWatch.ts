import { useState, useEffect, useMemo, useRef } from 'react';
import get from 'lodash/get';
import type { NamePath } from '../type';
import type { InternalFormInstance } from './interface';
import { HOOK_MARK } from './useForm';
import noop from '../../_util/noop';

export default function useWatch(name: NamePath, form: InternalFormInstance) {
  const [value, setValue] = useState<any>();
  const valueStr = useMemo(() => JSON.stringify(value), [value]);
  const valueStrRef = useRef(valueStr);

  // eslint-disable-next-line
  const isValidForm = form && form._init;

  useEffect(() => {
    if (!isValidForm) return;

    const { registerWatch = noop } = form.getInternalHooks?.(HOOK_MARK);

    const cancelRegister = registerWatch(() => {
      const allFieldsValue = form.getFieldsValue?.(true);
      const newValue = get(allFieldsValue, name);
      const nextValueStr = JSON.stringify(newValue);

      // Compare stringify in case it's nest object
      if (valueStrRef.current !== nextValueStr) {
        valueStrRef.current = nextValueStr;
        setValue(newValue);
      }
    });

    const allFieldsValue = form.getFieldsValue?.(true);
    const initialValue = get(allFieldsValue, name);
    setValue(initialValue);

    return cancelRegister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
